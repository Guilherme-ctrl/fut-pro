"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ProtocolsService = class ProtocolsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncTrainingCount(protocolId) {
        const count = await this.prisma.trainingSession.count({
            where: { protocolId },
        });
        await this.prisma.protocol.update({
            where: { id: protocolId },
            data: { trainingCount: count },
        });
    }
    async ensureProtocol(personalId, protocolId) {
        const p = await this.prisma.protocol.findFirst({
            where: { id: protocolId, personalId },
        });
        if (!p) {
            throw new common_1.NotFoundException({
                code: 'NOT_FOUND',
                message: 'Protocolo não encontrado',
            });
        }
        return p;
    }
    list(personalId) {
        return this.prisma.protocol.findMany({
            where: { personalId },
            orderBy: { name: 'asc' },
        });
    }
    async getOne(personalId, id) {
        await this.ensureProtocol(personalId, id);
        return this.prisma.protocol.findUnique({
            where: { id },
            include: {
                trainingSessions: {
                    orderBy: { order: 'asc' },
                    include: {
                        trainingExercises: {
                            orderBy: { order: 'asc' },
                            include: { exercise: true },
                        },
                    },
                },
            },
        });
    }
    create(personalId, dto) {
        return this.prisma.protocol.create({
            data: {
                personalId,
                name: dto.name,
                description: dto.description,
                objective: dto.objective,
                cycleCount: dto.cycleCount ?? 1,
                isActive: dto.isActive ?? true,
                trainingCount: 0,
            },
        });
    }
    async update(personalId, id, dto) {
        await this.ensureProtocol(personalId, id);
        return this.prisma.protocol.update({
            where: { id },
            data: dto,
        });
    }
    async remove(personalId, id) {
        await this.ensureProtocol(personalId, id);
        const active = await this.prisma.prescription.findFirst({
            where: { protocolId: id, status: client_1.PrescriptionStatus.ACTIVE },
        });
        if (active) {
            throw new common_1.ConflictException({
                code: 'CONFLICT',
                message: 'Protocolo vinculado a prescrição ativa',
            });
        }
        await this.prisma.protocol.delete({ where: { id } });
        return { ok: true };
    }
    async addTrainingSession(personalId, protocolId, dto) {
        await this.ensureProtocol(personalId, protocolId);
        const session = await this.prisma.trainingSession.create({
            data: {
                protocolId,
                order: dto.order,
                name: dto.name,
                type: dto.type,
                description: dto.description,
                estimatedDurationMinutes: dto.estimatedDurationMinutes,
                generalInstructions: dto.generalInstructions,
            },
        });
        await this.syncTrainingCount(protocolId);
        return session;
    }
    async updateTrainingSession(personalId, protocolId, sessionId, dto) {
        await this.ensureProtocol(personalId, protocolId);
        const session = await this.prisma.trainingSession.findFirst({
            where: { id: sessionId, protocolId },
        });
        if (!session) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Treino não encontrado' });
        }
        return this.prisma.trainingSession.update({
            where: { id: sessionId },
            data: dto,
        });
    }
    async removeTrainingSession(personalId, protocolId, sessionId) {
        await this.ensureProtocol(personalId, protocolId);
        const session = await this.prisma.trainingSession.findFirst({
            where: { id: sessionId, protocolId },
        });
        if (!session) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Treino não encontrado' });
        }
        await this.prisma.trainingSession.delete({ where: { id: sessionId } });
        await this.syncTrainingCount(protocolId);
        return { ok: true };
    }
    async addExerciseToSession(personalId, trainingSessionId, dto) {
        const session = await this.prisma.trainingSession.findUnique({
            where: { id: trainingSessionId },
            include: { protocol: true },
        });
        if (!session || session.protocol.personalId !== personalId) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Sessão não encontrada' });
        }
        await this.prisma.exercise.findFirstOrThrow({
            where: { id: dto.exerciseId, personalId },
        });
        return this.prisma.trainingExercise.create({
            data: {
                trainingSessionId,
                exerciseId: dto.exerciseId,
                order: dto.order,
                sets: dto.sets,
                repetitions: dto.repetitions,
                durationSeconds: dto.durationSeconds,
                distanceMeters: dto.distanceMeters,
                restSeconds: dto.restSeconds,
                rounds: dto.rounds,
                executionType: dto.executionType,
                notes: dto.notes,
            },
        });
    }
    async updateSessionExercise(personalId, trainingSessionId, trainingExerciseId, dto) {
        const te = await this.prisma.trainingExercise.findFirst({
            where: { id: trainingExerciseId, trainingSessionId },
            include: { trainingSession: { include: { protocol: true } } },
        });
        if (!te || te.trainingSession.protocol.personalId !== personalId) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Exercício da sessão não encontrado' });
        }
        const { exerciseId, order, ...rest } = dto;
        return this.prisma.trainingExercise.update({
            where: { id: trainingExerciseId },
            data: {
                ...rest,
                ...(exerciseId ? { exerciseId } : {}),
                ...(order !== undefined ? { order } : {}),
            },
        });
    }
    async removeSessionExercise(personalId, trainingSessionId, trainingExerciseId) {
        const te = await this.prisma.trainingExercise.findFirst({
            where: { id: trainingExerciseId, trainingSessionId },
            include: { trainingSession: { include: { protocol: true } } },
        });
        if (!te || te.trainingSession.protocol.personalId !== personalId) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Exercício da sessão não encontrado' });
        }
        await this.prisma.trainingExercise.delete({ where: { id: trainingExerciseId } });
        return { ok: true };
    }
};
exports.ProtocolsService = ProtocolsService;
exports.ProtocolsService = ProtocolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProtocolsService);
//# sourceMappingURL=protocols.service.js.map