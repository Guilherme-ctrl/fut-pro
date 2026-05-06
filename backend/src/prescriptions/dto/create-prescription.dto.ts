import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString()
  athleteId: string;

  @IsString()
  protocolId: string;

  @IsDateString()
  startDate: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  weeklyFrequency: number;

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
}
