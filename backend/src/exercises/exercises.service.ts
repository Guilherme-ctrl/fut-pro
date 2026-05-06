import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  list(personalId: string) {
    return this.prisma.exercise.findMany({
      where: { personalId },
      orderBy: { name: 'asc' },
    });
  }

  async getOne(personalId: string, id: string) {
    const row = await this.prisma.exercise.findFirst({
      where: { id, personalId },
    });
    if (!row) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Exercício não encontrado' });
    }
    return row;
  }

  create(personalId: string, dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        personalId,
        ...dto,
      },
    });
  }

  async update(personalId: string, id: string, dto: UpdateExerciseDto) {
    await this.getOne(personalId, id);
    return this.prisma.exercise.update({
      where: { id },
      data: dto,
    });
  }

  async remove(personalId: string, id: string) {
    await this.getOne(personalId, id);
    await this.prisma.exercise.delete({ where: { id } });
    return { ok: true };
  }
}
