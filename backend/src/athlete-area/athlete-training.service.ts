import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ExecutionStatus,
  PrescriptionStatus,
} from '@prisma/client';
import { AdherenceService } from '../domain/adherence.service';
import { AlertService } from '../domain/alert.service';
import { ProgressionService } from '../domain/progression.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteTrainingDto } from '../prescriptions/dto/complete-training.dto';
import { StartTrainingDto } from './dto/start-training.dto';

@Injectable()
export class AthleteTrainingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progression: ProgressionService,
    private readonly adherence: AdherenceService,
    private readonly alerts: AlertService,
  ) {}

  async getActivePrescription(athleteId: string) {
    return this.prisma.prescription.findFirst({
      where: { athleteId, status: PrescriptionStatus.ACTIVE },
      include: { protocol: true, athlete: true },
    });
  }

  async currentTraining(athleteId: string) {
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

  async start(athleteId: string, dto: StartTrainingDto) {
    let prescription = await this.getActivePrescription(athleteId);
    if (dto.prescriptionId) {
      prescription = await this.prisma.prescription.findFirst({
        where: {
          id: dto.prescriptionId,
          athleteId,
          status: PrescriptionStatus.ACTIVE,
        },
        include: { protocol: true, athlete: true },
      });
    }
    if (!prescription) {
      throw new NotFoundException({
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
      throw new BadRequestException({
        code: 'BUSINESS_RULE',
        message: 'Sessão atual não encontrada',
      });
    }
    const open = await this.prisma.trainingExecution.findFirst({
      where: { athleteId, status: ExecutionStatus.IN_PROGRESS },
    });
    if (open) {
      throw new ConflictException({
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
          status: ExecutionStatus.IN_PROGRESS,
        },
      });
      for (const te of session.trainingExercises) {
        await tx.trainingExecutionStep.create({
          data: {
            trainingExecutionId: execution.id,
            trainingExerciseId: te.id,
            status: ExecutionStatus.NOT_STARTED,
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

  async completeStep(
    athleteId: string,
    executionId: string,
    stepId: string,
  ) {
    const execution = await this.prisma.trainingExecution.findFirst({
      where: { id: executionId, athleteId },
      include: { steps: true },
    });
    if (!execution) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Execução não encontrada' });
    }
    if (execution.status !== ExecutionStatus.IN_PROGRESS) {
      throw new BadRequestException({
        code: 'BUSINESS_RULE',
        message: 'Treino não está em andamento',
      });
    }
    const step = execution.steps.find((s) => s.id === stepId);
    if (!step) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Etapa não encontrada' });
    }
    return this.prisma.trainingExecutionStep.update({
      where: { id: stepId },
      data: {
        status: ExecutionStatus.COMPLETED,
        finishedAt: new Date(),
      },
    });
  }

  async completeTraining(
    athleteId: string,
    executionId: string,
    dto: CompleteTrainingDto,
  ) {
    const execution = await this.prisma.trainingExecution.findFirst({
      where: { id: executionId, athleteId },
      include: {
        steps: true,
        prescription: { include: { protocol: true } },
      },
    });
    if (!execution) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Execução não encontrada' });
    }
    if (execution.status !== ExecutionStatus.IN_PROGRESS) {
      throw new BadRequestException({
        code: 'BUSINESS_RULE',
        message: 'Treino não está em andamento',
      });
    }
    const pending = execution.steps.filter(
      (s) => s.status !== ExecutionStatus.COMPLETED,
    );
    if (pending.length) {
      throw new BadRequestException({
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
      throw new BadRequestException({
        code: 'BUSINESS_RULE',
        message: 'Este treino não corresponde ao treino atual da prescrição',
      });
    }

    const protocol = execution.prescription.protocol;
    const prog = this.progression.computeAfterCompletion(
      protocol.trainingCount,
      protocol.cycleCount,
      execution.prescription.currentCycle,
      execution.prescription.currentTrainingOrder,
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.trainingExecution.update({
        where: { id: executionId },
        data: {
          status: ExecutionStatus.COMPLETED,
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
      await this.alerts.syncScheduleAlerts(
        athleteId,
        execution.prescriptionId,
        metrics.status,
      );
    }

    return {
      execution: updatedExecution,
      prescriptionProgress: prog,
    };
  }

  async history(athleteId: string) {
    return this.prisma.trainingExecution.findMany({
      where: { athleteId, status: ExecutionStatus.COMPLETED },
      orderBy: { finishedAt: 'desc' },
      include: { trainingSession: true },
      take: 50,
    });
  }
}
