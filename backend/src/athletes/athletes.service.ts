import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@Injectable()
export class AthletesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(personalId: string) {
    return this.prisma.athlete.findMany({
      where: { personalId },
      orderBy: { name: 'asc' },
    });
  }

  async getOne(personalId: string, id: string) {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id, personalId },
    });
    if (!athlete) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Atleta não encontrado' });
    }
    return athlete;
  }

  async create(personalId: string, dto: CreateAthleteDto) {
    const email = dto.email.toLowerCase();
    const existsUser = await this.prisma.user.findUnique({ where: { email } });
    if (existsUser) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Email já usado por outro usuário',
      });
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name: dto.name,
        role: UserRole.ATHLETE,
      },
    });
    const userId = user.id;
    try {
      return await this.prisma.athlete.create({
        data: {
          personalId,
          userId,
          name: dto.name,
          email,
          phone: dto.phone,
          age: dto.age,
          position: dto.position,
          objective: dto.objective,
          notes: dto.notes,
          status: dto.status,
        },
      });
    } catch {
      await this.prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Não foi possível criar o atleta (email duplicado para este personal?)',
      });
    }
  }

  async update(personalId: string, id: string, dto: UpdateAthleteDto) {
    await this.getOne(personalId, id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.email) {
      data.email = dto.email.toLowerCase();
    }
    if (dto.password) {
      const athlete = await this.prisma.athlete.findFirst({
        where: { id, personalId },
        include: { user: true },
      });
      if (!athlete) {
        throw new NotFoundException();
      }
      const passwordHash = await bcrypt.hash(dto.password, 10);
      if (athlete.userId) {
        await this.prisma.user.update({
          where: { id: athlete.userId },
          data: { passwordHash },
        });
      } else {
        const user = await this.prisma.user.create({
          data: {
            email: (data.email as string) ?? athlete.email,
            passwordHash,
            name: dto.name ?? athlete.name,
            role: UserRole.ATHLETE,
          },
        });
        data.userId = user.id;
      }
      delete data.password;
    }
    return this.prisma.athlete.update({
      where: { id },
      data: data as never,
    });
  }

  async remove(personalId: string, id: string) {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id, personalId },
      include: { user: true },
    });
    if (!athlete) {
      throw new NotFoundException();
    }
    await this.prisma.athlete.delete({ where: { id } });
    if (athlete.userId) {
      await this.prisma.user.delete({ where: { id: athlete.userId } }).catch(() => undefined);
    }
    return { ok: true };
  }

  async history(personalId: string, athleteId: string) {
    await this.getOne(personalId, athleteId);
    return this.prisma.trainingExecution.findMany({
      where: { athleteId },
      orderBy: { finishedAt: 'desc' },
      include: { trainingSession: true },
    });
  }
}
