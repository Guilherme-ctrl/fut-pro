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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let PrescriptionsService = class PrescriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureOwnedByPersonal(personalId, prescriptionId) {
        const p = await this.prisma.prescription.findFirst({
            where: { id: prescriptionId, athlete: { personalId } },
            include: { athlete: true, protocol: true },
        });
        if (!p) {
            throw new common_1.NotFoundException({
                code: 'NOT_FOUND',
                message: 'Prescrição não encontrada',
            });
        }
        return p;
    }
    list(personalId) {
        return this.prisma.prescription.findMany({
            where: { athlete: { personalId } },
            include: {
                athlete: true,
                protocol: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async create(personalId, dto) {
        const athlete = await this.prisma.athlete.findFirst({
            where: { id: dto.athleteId, personalId },
        });
        if (!athlete) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Atleta não encontrado' });
        }
        const protocol = await this.prisma.protocol.findFirst({
            where: { id: dto.protocolId, personalId },
        });
        if (!protocol) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Protocolo não encontrado' });
        }
        const existing = await this.prisma.prescription.findFirst({
            where: { athleteId: dto.athleteId, status: client_1.PrescriptionStatus.ACTIVE },
        });
        if (existing) {
            throw new common_1.ConflictException({
                code: 'CONFLICT',
                message: 'Atleta já possui prescrição ativa',
            });
        }
        if (protocol.trainingCount < 1) {
            throw new common_1.BadRequestException({
                code: 'VALIDATION_ERROR',
                message: 'Protocolo precisa ter ao menos um treino',
            });
        }
        return this.prisma.prescription.create({
            data: {
                athleteId: dto.athleteId,
                protocolId: dto.protocolId,
                startDate: new Date(dto.startDate),
                weeklyFrequency: dto.weeklyFrequency,
                currentCycle: dto.currentCycle ?? 1,
                currentTrainingOrder: dto.currentTrainingOrder ?? 1,
                status: client_1.PrescriptionStatus.ACTIVE,
            },
            include: { athlete: true, protocol: true },
        });
    }
    async getOne(personalId, id) {
        return this.ensureOwnedByPersonal(personalId, id);
    }
    async update(personalId, id, dto) {
        const current = await this.ensureOwnedByPersonal(personalId, id);
        if (dto.currentTrainingOrder != null || dto.currentCycle != null) {
            const maxOrder = current.protocol.trainingCount;
            const maxCycle = current.protocol.cycleCount;
            const order = dto.currentTrainingOrder ?? current.currentTrainingOrder;
            const cycle = dto.currentCycle ?? current.currentCycle;
            if (order < 1 || order > maxOrder) {
                throw new common_1.BadRequestException({
                    code: 'VALIDATION_ERROR',
                    message: 'Ordem de treino fora do intervalo do protocolo',
                });
            }
            if (cycle < 1 || cycle > maxCycle) {
                throw new common_1.BadRequestException({
                    code: 'VALIDATION_ERROR',
                    message: 'Ciclo fora do intervalo do protocolo',
                });
            }
        }
        return this.prisma.prescription.update({
            where: { id },
            data: dto,
            include: { athlete: true, protocol: true },
        });
    }
    async pause(personalId, id) {
        await this.ensureOwnedByPersonal(personalId, id);
        return this.prisma.prescription.update({
            where: { id },
            data: { status: client_1.PrescriptionStatus.PAUSED },
        });
    }
    async resume(personalId, id) {
        const p = await this.ensureOwnedByPersonal(personalId, id);
        const other = await this.prisma.prescription.findFirst({
            where: {
                athleteId: p.athleteId,
                status: client_1.PrescriptionStatus.ACTIVE,
                NOT: { id: p.id },
            },
        });
        if (other) {
            throw new common_1.ConflictException({
                code: 'CONFLICT',
                message: 'Outra prescrição já está ativa para este atleta',
            });
        }
        return this.prisma.prescription.update({
            where: { id },
            data: { status: client_1.PrescriptionStatus.ACTIVE },
        });
    }
    async completeManual(personalId, id) {
        await this.ensureOwnedByPersonal(personalId, id);
        return this.prisma.prescription.update({
            where: { id },
            data: { status: client_1.PrescriptionStatus.COMPLETED },
        });
    }
    async currentTraining(personalId, prescriptionId) {
        const p = await this.ensureOwnedByPersonal(personalId, prescriptionId);
        if (p.status !== client_1.PrescriptionStatus.ACTIVE) {
            throw new common_1.BadRequestException({
                code: 'BUSINESS_RULE',
                message: 'Prescrição não está ativa',
            });
        }
        const session = await this.prisma.trainingSession.findFirst({
            where: {
                protocolId: p.protocolId,
                order: p.currentTrainingOrder,
            },
            include: {
                trainingExercises: {
                    orderBy: { order: 'asc' },
                    include: { exercise: true },
                },
            },
        });
        if (!session) {
            throw new common_1.BadRequestException({
                code: 'BUSINESS_RULE',
                message: 'Treino atual não encontrado para a ordem da prescrição',
            });
        }
        return { prescription: p, trainingSession: session };
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map