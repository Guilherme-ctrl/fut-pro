import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrescriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddTrainingExerciseDto } from './dto/add-training-exercise.dto';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { UpdateTrainingExerciseDto } from './dto/update-training-exercise.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';

@Injectable()
export class ProtocolsService {
  constructor(private readonly prisma: PrismaService) {}

  private async syncTrainingCount(protocolId: string) {
    const count = await this.prisma.trainingSession.count({
      where: { protocolId },
    });
    await this.prisma.protocol.update({
      where: { id: protocolId },
      data: { trainingCount: count },
    });
  }

  async ensureProtocol(personalId: string, protocolId: string) {
    const p = await this.prisma.protocol.findFirst({
      where: { id: protocolId, personalId },
    });
    if (!p) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Protocolo não encontrado',
      });
    }
    return p;
  }

  list(personalId: string) {
    return this.prisma.protocol.findMany({
      where: { personalId },
      orderBy: { name: 'asc' },
    });
  }

  async getOne(personalId: string, id: string) {
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

  create(personalId: string, dto: CreateProtocolDto) {
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

  async update(personalId: string, id: string, dto: UpdateProtocolDto) {
    await this.ensureProtocol(personalId, id);
    return this.prisma.protocol.update({
      where: { id },
      data: dto,
    });
  }

  async remove(personalId: string, id: string) {
    await this.ensureProtocol(personalId, id);
    const active = await this.prisma.prescription.findFirst({
      where: { protocolId: id, status: PrescriptionStatus.ACTIVE },
    });
    if (active) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Protocolo vinculado a prescrição ativa',
      });
    }
    await this.prisma.protocol.delete({ where: { id } });
    return { ok: true };
  }

  async addTrainingSession(
    personalId: string,
    protocolId: string,
    dto: CreateTrainingSessionDto,
  ) {
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

  async updateTrainingSession(
    personalId: string,
    protocolId: string,
    sessionId: string,
    dto: UpdateTrainingSessionDto,
  ) {
    await this.ensureProtocol(personalId, protocolId);
    const session = await this.prisma.trainingSession.findFirst({
      where: { id: sessionId, protocolId },
    });
    if (!session) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Treino não encontrado' });
    }
    return this.prisma.trainingSession.update({
      where: { id: sessionId },
      data: dto,
    });
  }

  async removeTrainingSession(
    personalId: string,
    protocolId: string,
    sessionId: string,
  ) {
    await this.ensureProtocol(personalId, protocolId);
    const session = await this.prisma.trainingSession.findFirst({
      where: { id: sessionId, protocolId },
    });
    if (!session) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Treino não encontrado' });
    }
    await this.prisma.trainingSession.delete({ where: { id: sessionId } });
    await this.syncTrainingCount(protocolId);
    return { ok: true };
  }

  async addExerciseToSession(
    personalId: string,
    trainingSessionId: string,
    dto: AddTrainingExerciseDto,
  ) {
    const session = await this.prisma.trainingSession.findUnique({
      where: { id: trainingSessionId },
      include: { protocol: true },
    });
    if (!session || session.protocol.personalId !== personalId) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Sessão não encontrada' });
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

  async updateSessionExercise(
    personalId: string,
    trainingSessionId: string,
    trainingExerciseId: string,
    dto: UpdateTrainingExerciseDto,
  ) {
    const te = await this.prisma.trainingExercise.findFirst({
      where: { id: trainingExerciseId, trainingSessionId },
      include: { trainingSession: { include: { protocol: true } } },
    });
    if (!te || te.trainingSession.protocol.personalId !== personalId) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Exercício da sessão não encontrado' });
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

  async removeSessionExercise(
    personalId: string,
    trainingSessionId: string,
    trainingExerciseId: string,
  ) {
    const te = await this.prisma.trainingExercise.findFirst({
      where: { id: trainingExerciseId, trainingSessionId },
      include: { trainingSession: { include: { protocol: true } } },
    });
    if (!te || te.trainingSession.protocol.personalId !== personalId) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Exercício da sessão não encontrado' });
    }
    await this.prisma.trainingExercise.delete({ where: { id: trainingExerciseId } });
    return { ok: true };
  }
}
