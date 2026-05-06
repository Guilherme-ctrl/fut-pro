import { Injectable } from '@nestjs/common';
import {
  AlertType,
  Difficulty,
  ExecutionStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AdherenceLabel } from './adherence.service';

@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}

  async createAlert(data: Prisma.AlertCreateInput) {
    return this.prisma.alert.create({ data });
  }

  async onTrainingCompleted(params: {
    athleteId: string;
    prescriptionId: string;
    executionId: string;
    feltPain: boolean;
    painLocation?: string | null;
    perceivedDifficulty?: Difficulty | null;
  }) {
    const alerts: Prisma.AlertCreateManyInput[] = [];

    if (params.feltPain) {
      alerts.push({
        athleteId: params.athleteId,
        prescriptionId: params.prescriptionId,
        trainingExecutionId: params.executionId,
        type: AlertType.PAIN,
        message: params.painLocation
          ? `Atleta reportou dor: ${params.painLocation}`
          : 'Atleta reportou dor no treino',
      });
    }

    if (params.perceivedDifficulty === Difficulty.VERY_HARD) {
      alerts.push({
        athleteId: params.athleteId,
        prescriptionId: params.prescriptionId,
        trainingExecutionId: params.executionId,
        type: AlertType.VERY_HARD,
        message: 'Atleta marcou treino como muito difícil',
      });

      const recent = await this.prisma.trainingExecution.findMany({
        where: {
          athleteId: params.athleteId,
          status: ExecutionStatus.COMPLETED,
          perceivedDifficulty: Difficulty.VERY_HARD,
        },
        orderBy: { finishedAt: 'desc' },
        take: 3,
      });
      if (recent.length >= 2) {
        alerts.push({
          athleteId: params.athleteId,
          prescriptionId: params.prescriptionId,
          trainingExecutionId: params.executionId,
          type: AlertType.OVERLOAD,
          message: 'Múltiplos treinos recentes como muito difícil',
        });
      }
    }

    if (alerts.length) {
      await this.prisma.alert.createMany({ data: alerts });
    }
  }

  async syncScheduleAlerts(
    athleteId: string,
    prescriptionId: string,
    status: AdherenceLabel,
  ) {
    if (status === 'ATRASADO') {
      await this.prisma.alert.create({
        data: {
          athleteId,
          prescriptionId,
          type: AlertType.BEHIND_SCHEDULE,
          message: 'Atleta está atrasado em relação à frequência',
        },
      });
    } else if (status === 'PARADO') {
      await this.prisma.alert.create({
        data: {
          athleteId,
          prescriptionId,
          type: AlertType.STOPPED,
          message: 'Atleta parado há vários dias ou com baixa aderência',
        },
      });
    }
  }
}
