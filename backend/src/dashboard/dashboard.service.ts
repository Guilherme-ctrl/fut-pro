import { Injectable } from '@nestjs/common';
import {
  AlertType,
  AthleteStatus,
  ExecutionStatus,
  PrescriptionStatus,
} from '@prisma/client';
import { AdherenceService } from '../domain/adherence.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adherence: AdherenceService,
  ) {}

  private weekStart(): Date {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async summary(personalId: string) {
    const athletes = await this.prisma.athlete.findMany({
      where: { personalId, status: AthleteStatus.ACTIVE },
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
        status: ExecutionStatus.COMPLETED,
        finishedAt: { gte: ws },
        athlete: { personalId },
      },
    });
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const painAlerts = await this.prisma.alert.count({
      where: {
        type: AlertType.PAIN,
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

  async athletesStatus(personalId: string) {
    const athletes = await this.prisma.athlete.findMany({
      where: { personalId },
      orderBy: { name: 'asc' },
    });
    const out = [];
    for (const a of athletes) {
      const prescription = await this.prisma.prescription.findFirst({
        where: { athleteId: a.id, status: PrescriptionStatus.ACTIVE },
        include: { protocol: true },
      });
      const last = await this.prisma.trainingExecution.findFirst({
        where: { athleteId: a.id, status: ExecutionStatus.COMPLETED },
        orderBy: { finishedAt: 'desc' },
        include: { trainingSession: true },
      });
      const metrics = await this.adherence.getMetricsForAthlete(a.id);
      let nextSessionName: string | null = null;
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

  async alerts(personalId: string) {
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
}
