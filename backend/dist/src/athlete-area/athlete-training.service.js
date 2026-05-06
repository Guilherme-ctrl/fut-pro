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
exports.AthleteTrainingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adherence_service_1 = require("../domain/adherence.service");
const alert_service_1 = require("../domain/alert.service");
const progression_service_1 = require("../domain/progression.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AthleteTrainingService = class AthleteTrainingService {
    constructor(prisma, progression, adherence, alerts) {
        this.prisma = prisma;
        this.progression = progression;
        this.adherence = adherence;
        this.alerts = alerts;
    }
    async getActivePrescription(athleteId) {
        return this.prisma.prescription.findFirst({
            where: { athleteId, status: client_1.PrescriptionStatus.ACTIVE },
            include: { protocol: true, athlete: true },
        });
    }
    async currentTraining(athleteId) {
        const prescription = await this.getActivePrescription(athleteId);
        if (!prescription) {
            return null;
        }
        const session = await this.prisma.trainingSession.findFirst({
            where: {
                protocolId: prescription.protocolId,
                order: prescription.currentTrainingOrder,
            },
            include: {
                trainingExercises: {
                    orderBy: { order: 'asc' },
                    include: { exercise: true },
                },
            },
        });
        return { prescription, trainingSession: session };
    }
    async start(athleteId, dto) {
        let prescription = await this.getActivePrescription(athleteId);
        if (dto.prescriptionId) {
            prescription = await this.prisma.prescription.findFirst({
                where: {
                    id: dto.prescriptionId,
                    athleteId,
                    status: client_1.PrescriptionStatus.ACTIVE,
                },
                include: { protocol: true, athlete: true },
            });
        }
        if (!prescription) {
            throw new common_1.NotFoundException({
                code: 'NOT_FOUND',
                message: 'Nenhuma prescrição ativa',
            });
        }
        const session = await this.prisma.trainingSession.findFirst({
            where: {
                protocolId: prescription.protocolId,
                order: prescription.currentTrainingOrder,
            },
            include: {
                trainingExercises: { orderBy: { order: 'asc' } },
            },
        });
        if (!session) {
            throw new common_1.BadRequestException({
                code: 'BUSINESS_RULE',
                message: 'Sessão atual não encontrada',
            });
        }
        const open = await this.prisma.trainingExecution.findFirst({
            where: { athleteId, status: client_1.ExecutionStatus.IN_PROGRESS },
        });
        if (open) {
            throw new common_1.ConflictException({
                code: 'CONFLICT',
                message: 'Já existe um treino em andamento',
            });
        }
        return this.prisma.$transaction(async (tx) => {
            const execution = await tx.trainingExecution.create({
                data: {
                    prescriptionId: prescription.id,
                    trainingSessionId: session.id,
                    athleteId,
                    status: client_1.ExecutionStatus.IN_PROGRESS,
                },
            });
            for (const te of session.trainingExercises) {
                await tx.trainingExecutionStep.create({
                    data: {
                        trainingExecutionId: execution.id,
                        trainingExerciseId: te.id,
                        status: client_1.ExecutionStatus.NOT_STARTED,
                    },
                });
            }
            return tx.trainingExecution.findUnique({
                where: { id: execution.id },
                include: {
                    trainingSession: {
                        include: {
                            trainingExercises: {
                                orderBy: { order: 'asc' },
                                include: { exercise: true },
                            },
                        },
                    },
                    steps: { orderBy: { createdAt: 'asc' } },
                },
            });
        });
    }
    async completeStep(athleteId, executionId, stepId) {
        const execution = await this.prisma.trainingExecution.findFirst({
            where: { id: executionId, athleteId },
            include: { steps: true },
        });
        if (!execution) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Execução não encontrada' });
        }
        if (execution.status !== client_1.ExecutionStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException({
                code: 'BUSINESS_RULE',
                message: 'Treino não está em andamento',
            });
        }
        const step = execution.steps.find((s) => s.id === stepId);
        if (!step) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Etapa não encontrada' });
        }
        return this.prisma.trainingExecutionStep.update({
            where: { id: stepId },
            data: {
                status: client_1.ExecutionStatus.COMPLETED,
                finishedAt: new Date(),
            },
        });
    }
    async completeTraining(athleteId, executionId, dto) {
        const execution = await this.prisma.trainingExecution.findFirst({
            where: { id: executionId, athleteId },
            include: {
                steps: true,
                prescription: { include: { protocol: true } },
            },
        });
        if (!execution) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Execução não encontrada' });
        }
        if (execution.status !== client_1.ExecutionStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException({
                code: 'BUSINESS_RULE',
                message: 'Treino não está em andamento',
            });
        }
        const pending = execution.steps.filter((s) => s.status !== client_1.ExecutionStatus.COMPLETED);
        if (pending.length) {
            throw new common_1.BadRequestException({
                code: 'BUSINESS_RULE',
                message: 'Conclua todas as etapas antes de finalizar o treino',
            });
        }
        const sessionMatches = await this.prisma.trainingSession.findFirst({
            where: {
                id: execution.trainingSessionId,
                protocolId: execution.prescription.protocolId,
                order: execution.prescription.currentTrainingOrder,
            },
        });
        if (!sessionMatches) {
            throw new common_1.BadRequestException({
                code: 'BUSINESS_RULE',
                message: 'Este treino não corresponde ao treino atual da prescrição',
            });
        }
        const protocol = execution.prescription.protocol;
        const prog = this.progression.computeAfterCompletion(protocol.trainingCount, protocol.cycleCount, execution.prescription.currentCycle, execution.prescription.currentTrainingOrder);
        await this.prisma.$transaction(async (tx) => {
            await tx.trainingExecution.update({
                where: { id: executionId },
                data: {
                    status: client_1.ExecutionStatus.COMPLETED,
                    finishedAt: new Date(),
                    perceivedDifficulty: dto.perceivedDifficulty,
                    feltPain: dto.feltPain,
                    painLocation: dto.painLocation,
                    athleteNotes: dto.athleteNotes,
                },
            });
            await tx.prescription.update({
                where: { id: execution.prescriptionId },
                data: {
                    currentCycle: prog.currentCycle,
                    currentTrainingOrder: prog.currentTrainingOrder,
                    status: prog.status,
                },
            });
        });
        const updatedExecution = await this.prisma.trainingExecution.findUnique({
            where: { id: executionId },
        });
        await this.alerts.onTrainingCompleted({
            athleteId,
            prescriptionId: execution.prescriptionId,
            executionId,
            feltPain: dto.feltPain,
            painLocation: dto.painLocation,
            perceivedDifficulty: dto.perceivedDifficulty,
        });
        const metrics = await this.adherence.getMetricsForAthlete(athleteId);
        if (metrics?.status === 'ATRASADO' || metrics?.status === 'PARADO') {
            await this.alerts.syncScheduleAlerts(athleteId, execution.prescriptionId, metrics.status);
        }
        return {
            execution: updatedExecution,
            prescriptionProgress: prog,
        };
    }
    async history(athleteId) {
        return this.prisma.trainingExecution.findMany({
            where: { athleteId, status: client_1.ExecutionStatus.COMPLETED },
            orderBy: { finishedAt: 'desc' },
            include: { trainingSession: true },
            take: 50,
        });
    }
};
exports.AthleteTrainingService = AthleteTrainingService;
exports.AthleteTrainingService = AthleteTrainingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        progression_service_1.ProgressionService,
        adherence_service_1.AdherenceService,
        alert_service_1.AlertService])
], AthleteTrainingService);
//# sourceMappingURL=athlete-training.service.js.map