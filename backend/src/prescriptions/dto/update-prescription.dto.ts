import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { PrescriptionStatus } from '@prisma/client';

export class UpdatePrescriptionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  currentCycle?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  currentTrainingOrder?: number;

  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;
}
