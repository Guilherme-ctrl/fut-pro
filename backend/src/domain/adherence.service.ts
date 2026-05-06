import { Injectable } from '@nestjs/common';
import {
  ExecutionStatus,
  PrescriptionStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type AdherenceLabel = 'EM_DIA' | 'ATENCAO' | 'ATRASADO' | 'PARADO';

export type AdherenceMetrics = {
  prescribed: number;
  completed: number;
  adherencePercent: number;
  daysSinceLastTraining: number | null;
  currentStreakWeek: number;
  currentCycle: number;
  currentTrainingOrder: number;
  missedOrLate: number;
  status: AdherenceLabel;
};

@Injectable()
export class AdherenceService {
  constructor(private readonly prisma: PrismaService) {}

  labelFromMetrics(m: {
    daysSinceLastTraining: number | null;
    adherencePercent: number;
    weeklyFrequency: number;
  }): AdherenceLabel {
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

  async getMetricsForAthlete(
    athleteId: string,
    prescriptionId?: string,
  ): Promise<AdherenceMetrics | null> {
    const where: Prisma.PrescriptionWhereInput = {
      athleteId,
      status: PrescriptionStatus.ACTIVE,
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
        status: ExecutionStatus.COMPLETED,
      },
    });

    const lastDone = await this.prisma.trainingExecution.findFirst({
      where: {
        athleteId,
        prescriptionId: prescription.id,
        status: ExecutionStatus.COMPLETED,
      },
      orderBy: { finishedAt: 'desc' },
    });

    const start = prescription.startDate;
    const now = new Date();
    const daysSinceStart = Math.max(
      0,
      Math.floor((now.getTime() - start.getTime()) / (86400 * 1000)),
    );
    const weeksElapsed = Math.floor(daysSinceStart / 7);
    const totalProgramSessions =
      prescription.protocol.trainingCount * prescription.protocol.cycleCount;
    const prescribed = Math.min(
      weeksElapsed * prescription.weeklyFrequency,
      totalProgramSessions,
    );
    const prescribedSafe = Math.max(prescribed, weeksElapsed > 0 ? 1 : 0);

    const adherencePercent =
      prescribedSafe === 0
        ? 100
        : Math.min(100, Math.round((completed / prescribedSafe) * 100));

    let daysSinceLastTraining: number | null = null;
    if (lastDone?.finishedAt) {
      daysSinceLastTraining = Math.floor(
        (now.getTime() - lastDone.finishedAt.getTime()) / (86400 * 1000),
      );
    }

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const currentStreakWeek = await this.prisma.trainingExecution.count({
      where: {
        athleteId,
        prescriptionId: prescription.id,
        status: ExecutionStatus.COMPLETED,
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
}
