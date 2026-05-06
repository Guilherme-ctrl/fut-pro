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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adherence_service_1 = require("../domain/adherence.service");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma, adherence) {
        this.prisma = prisma;
        this.adherence = adherence;
    }
    weekStart() {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay());
        d.setHours(0, 0, 0, 0);
        return d;
    }
    async summary(personalId) {
        const athletes = await this.prisma.athlete.findMany({
            where: { personalId, status: client_1.AthleteStatus.ACTIVE },
        });
        let adherenceSum = 0;
        let n = 0;
        const breakdown = {
            EM_DIA: 0,
            ATENCAO: 0,
            ATRASADO: 0,
            PARADO: 0,
        };
        for (const a of athletes) {
            const m = await this.adherence.getMetricsForAthlete(a.id);
            if (m) {
                adherenceSum += m.adherencePercent;
                n++;
                breakdown[m.status]++;
            }
        }
        const ws = this.weekStart();
        const trainingsCompletedThisWeek = await this.prisma.trainingExecution.count({
            where: {
                status: client_1.ExecutionStatus.COMPLETED,
                finishedAt: { gte: ws },
                athlete: { personalId },
            },
        });
        const since = new Date();
        since.setDate(since.getDate() - 7);
        const painAlerts = await this.prisma.alert.count({
            where: {
                type: client_1.AlertType.PAIN,
                createdAt: { gte: since },
                athlete: { personalId },
            },
        });
        return {
            activeAthletes: athletes.length,
            averageAdherencePercent: n ? Math.round(adherenceSum / n) : 0,
            athletesOnTrack: breakdown.EM_DIA,
            athletesAttention: breakdown.ATENCAO,
            athletesLate: breakdown.ATRASADO,
            athletesStopped: breakdown.PARADO,
            trainingsCompletedThisWeek,
            painAlertsLast7Days: painAlerts,
        };
    }
    async athletesStatus(personalId) {
        const athletes = await this.prisma.athlete.findMany({
            where: { personalId },
            orderBy: { name: 'asc' },
        });
        const out = [];
        for (const a of athletes) {
            const prescription = await this.prisma.prescription.findFirst({
                where: { athleteId: a.id, status: client_1.PrescriptionStatus.ACTIVE },
                include: { protocol: true },
            });
            const last = await this.prisma.trainingExecution.findFirst({
                where: { athleteId: a.id, status: client_1.ExecutionStatus.COMPLETED },
                orderBy: { finishedAt: 'desc' },
                include: { trainingSession: true },
            });
            const metrics = await this.adherence.getMetricsForAthlete(a.id);
            let nextSessionName = null;
            if (prescription) {
                const next = await this.prisma.trainingSession.findFirst({
                    where: {
                        protocolId: prescription.protocolId,
                        order: prescription.currentTrainingOrder,
                    },
                });
                nextSessionName = next?.name ?? null;
            }
            out.push({
                id: a.id,
                name: a.name,
                email: a.email,
                position: a.position,
                protocolName: prescription?.protocol.name ?? null,
                nextTraining: nextSessionName,
                lastTraining: last?.trainingSession.name ?? null,
                lastTrainingDate: last?.finishedAt ?? null,
                adherencePercent: metrics?.adherencePercent ?? null,
                daysSinceLastTraining: metrics?.daysSinceLastTraining ?? null,
                status: metrics?.status ?? null,
            });
        }
        return out;
    }
    async alerts(personalId) {
        const since = new Date();
        since.setDate(since.getDate() - 7);
        return this.prisma.alert.findMany({
            where: {
                createdAt: { gte: since },
                athlete: { personalId },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { athlete: { select: { id: true, name: true } } },
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        adherence_service_1.AdherenceService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map