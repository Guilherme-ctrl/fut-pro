import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { TrainingType } from '@prisma/client';

export class CreateTrainingSessionDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order: number;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(TrainingType)
  type: TrainingType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  estimatedDurationMinutes?: number;

  @IsOptional()
  @IsString()
  generalInstructions?: string;
}
