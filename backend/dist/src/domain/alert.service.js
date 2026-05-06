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
exports.AlertService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AlertService = class AlertService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAlert(data) {
        return this.prisma.alert.create({ data });
    }
    async onTrainingCompleted(params) {
        const alerts = [];
        if (params.feltPain) {
            alerts.push({
                athleteId: params.athleteId,
                prescriptionId: params.prescriptionId,
                trainingExecutionId: params.executionId,
                type: client_1.AlertType.PAIN,
                message: params.painLocation
                    ? `Atleta reportou dor: ${params.painLocation}`
                    : 'Atleta reportou dor no treino',
            });
        }
        if (params.perceivedDifficulty === client_1.Difficulty.VERY_HARD) {
            alerts.push({
                athleteId: params.athleteId,
                prescriptionId: params.prescriptionId,
                trainingExecutionId: params.executionId,
                type: client_1.AlertType.VERY_HARD,
                message: 'Atleta marcou treino como muito difícil',
            });
            const recent = await this.prisma.trainingExecution.findMany({
                where: {
                    athleteId: params.athleteId,
                    status: client_1.ExecutionStatus.COMPLETED,
                    perceivedDifficulty: client_1.Difficulty.VERY_HARD,
                },
                orderBy: { finishedAt: 'desc' },
                take: 3,
            });
            if (recent.length >= 2) {
                alerts.push({
                    athleteId: params.athleteId,
                    prescriptionId: params.prescriptionId,
                    trainingExecutionId: params.executionId,
                    type: client_1.AlertType.OVERLOAD,
                    message: 'Múltiplos treinos recentes como muito difícil',
                });
            }
        }
        if (alerts.length) {
            await this.prisma.alert.createMany({ data: alerts });
        }
    }
    async syncScheduleAlerts(athleteId, prescriptionId, status) {
        if (status === 'ATRASADO') {
            await this.prisma.alert.create({
                data: {
                    athleteId,
                    prescriptionId,
                    type: client_1.AlertType.BEHIND_SCHEDULE,
                    message: 'Atleta está atrasado em relação à frequência',
                },
            });
        }
        else if (status === 'PARADO') {
            await this.prisma.alert.create({
                data: {
                    athleteId,
                    prescriptionId,
                    type: client_1.AlertType.STOPPED,
                    message: 'Atleta parado há vários dias ou com baixa aderência',
                },
            });
        }
    }
};
exports.AlertService = AlertService;
exports.AlertService = AlertService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertService);
//# sourceMappingURL=alert.service.js.map