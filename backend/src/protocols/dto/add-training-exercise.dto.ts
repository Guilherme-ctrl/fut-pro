import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ExecutionType } from '@prisma/client';

export class AddTrainingExerciseDto {
  @IsString()
  exerciseId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sets?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  repetitions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  durationSeconds?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  distanceMeters?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restSeconds?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rounds?: number;

  @IsOptional()
  @IsEnum(ExecutionType)
  executionType?: ExecutionType;

  @IsOptional()
  @IsString()
  notes?: string;
}
