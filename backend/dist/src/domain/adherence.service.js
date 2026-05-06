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
exports.AdherenceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AdherenceService = class AdherenceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    labelFromMetrics(m) {
        const days = m.daysSinceLastTraining ?? 999;
        const freq = Math.max(1, m.weeklyFrequency);
        const expectedGap = Math.max(1, Math.ceil(7 / freq));
        if (days >= 10 || (m.adherencePercent < 40 && days > 14)) {
            return 'PARADO';
        }
        if (days >= 5 || m.adherencePercent < 60) {
            return 'ATRASADO';
        }
        if (days > expectedGap + 1 || (m.adherencePercent < 85 && days > 2)) {
            return 'ATENCAO';
        }
        return 'EM_DIA';
    }
    async getMetricsForAthlete(athleteId, prescriptionId) {
        const where = {
            athleteId,
            status: client_1.PrescriptionStatus.ACTIVE,
        };
        if (prescriptionId) {
            where.id = prescriptionId;
        }
        const prescription = await this.prisma.prescription.findFirst({
            where,
            include: { protocol: true },
        });
        if (!prescription) {
            return null;
        }
        const completed = await this.prisma.trainingExecution.count({
            where: {
                athleteId,
                prescriptionId: prescription.id,
                status: client_1.ExecutionStatus.COMPLETED,
            },
        });
        const lastDone = await this.prisma.trainingExecution.findFirst({
            where: {
                athleteId,
                prescriptionId: prescription.id,
                status: client_1.ExecutionStatus.COMPLETED,
            },
            orderBy: { finishedAt: 'desc' },
        });
        const start = prescription.startDate;
        const now = new Date();
        const daysSinceStart = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (86400 * 1000)));
        const weeksElapsed = Math.floor(daysSinceStart / 7);
        const totalProgramSessions = prescription.protocol.trainingCount * prescription.protocol.cycleCount;
        const prescribed = Math.min(weeksElapsed * prescription.weeklyFrequency, totalProgramSessions);
        const prescribedSafe = Math.max(prescribed, weeksElapsed > 0 ? 1 : 0);
        const adherencePercent = prescribedSafe === 0
            ? 100
            : Math.min(100, Math.round((completed / prescribedSafe) * 100));
        let daysSinceLastTraining = null;
        if (lastDone?.finishedAt) {
            daysSinceLastTraining = Math.floor((now.getTime() - lastDone.finishedAt.getTime()) / (86400 * 1000));
        }
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const currentStreakWeek = await this.prisma.trainingExecution.count({
            where: {
                athleteId,
                prescriptionId: prescription.id,
                status: client_1.ExecutionStatus.COMPLETED,
                finishedAt: { gte: weekStart },
            },
        });
        const status = this.labelFromMetrics({
            daysSinceLastTraining,
            adherencePercent,
            weeklyFrequency: prescription.weeklyFrequency,
        });
        return {
            prescribed: prescribedSafe,
            completed,
            adherencePercent,
            daysSinceLastTraining,
            currentStreakWeek,
            currentCycle: prescription.currentCycle,
            currentTrainingOrder: prescription.currentTrainingOrder,
            missedOrLate: Math.max(0, prescribedSafe - completed),
            status,
        };
    }
};
exports.AdherenceService = AdherenceService;
exports.AdherenceService = AdherenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdherenceService);
//# sourceMappingURL=adherence.service.js.map