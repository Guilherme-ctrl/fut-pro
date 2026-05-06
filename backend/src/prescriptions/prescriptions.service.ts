import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrescriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureOwnedByPersonal(personalId: string, prescriptionId: string) {
    const p = await this.prisma.prescription.findFirst({
      where: { id: prescriptionId, athlete: { personalId } },
      include: { athlete: true, protocol: true },
    });
    if (!p) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Prescrição não encontrada',
      });
    }
    return p;
  }

  list(personalId: string) {
    return this.prisma.prescription.findMany({
      where: { athlete: { personalId } },
      include: {
        athlete: true,
        protocol: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(personalId: string, dto: CreatePrescriptionDto) {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id: dto.athleteId, personalId },
    });
    if (!athlete) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Atleta não encontrado' });
    }
    const protocol = await this.prisma.protocol.findFirst({
      where: { id: dto.protocolId, personalId },
    });
    if (!protocol) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Protocolo não encontrado' });
    }
    const existing = await this.prisma.prescription.findFirst({
      where: { athleteId: dto.athleteId, status: PrescriptionStatus.ACTIVE },
    });
    if (existing) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Atleta já possui prescrição ativa',
      });
    }
    if (protocol.trainingCount < 1) {
      throw new BadRequestException({
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
        status: PrescriptionStatus.ACTIVE,
      },
      include: { athlete: true, protocol: true },
    });
  }

  async getOne(personalId: string, id: string) {
    return this.ensureOwnedByPersonal(personalId, id);
  }

  async update(
    personalId: string,
    id: string,
    dto: UpdatePrescriptionDto,
  ) {
    const current = await this.ensureOwnedByPersonal(personalId, id);
    if (dto.currentTrainingOrder != null || dto.currentCycle != null) {
      const maxOrder = current.protocol.trainingCount;
      const maxCycle = current.protocol.cycleCount;
      const order = dto.currentTrainingOrder ?? current.currentTrainingOrder;
      const cycle = dto.currentCycle ?? current.currentCycle;
      if (order < 1 || order > maxOrder) {
        throw new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Ordem de treino fora do intervalo do protocolo',
        });
      }
      if (cycle < 1 || cycle > maxCycle) {
        throw new BadRequestException({
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

  async pause(personalId: string, id: string) {
    await this.ensureOwnedByPersonal(personalId, id);
    return this.prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.PAUSED },
    });
  }

  async resume(personalId: string, id: string) {
    const p = await this.ensureOwnedByPersonal(personalId, id);
    const other = await this.prisma.prescription.findFirst({
      where: {
        athleteId: p.athleteId,
        status: PrescriptionStatus.ACTIVE,
        NOT: { id: p.id },
      },
    });
    if (other) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Outra prescrição já está ativa para este atleta',
      });
    }
    return this.prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.ACTIVE },
    });
  }

  async completeManual(personalId: string, id: string) {
    await this.ensureOwnedByPersonal(personalId, id);
    return this.prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.COMPLETED },
    });
  }

  async currentTraining(personalId: string, prescriptionId: string) {
    const p = await this.ensureOwnedByPersonal(personalId, prescriptionId);
    if (p.status !== PrescriptionStatus.ACTIVE) {
      throw new BadRequestException({
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
      throw new BadRequestException({
        code: 'BUSINESS_RULE',
        message: 'Treino atual não encontrado para a ordem da prescrição',
      });
    }
    return { prescription: p, trainingSession: session };
  }
}
