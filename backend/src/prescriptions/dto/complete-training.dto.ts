import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Difficulty } from '@prisma/client';

export class CompleteTrainingDto {
  @IsEnum(Difficulty)
  perceivedDifficulty: Difficulty;

  @IsBoolean()
  feltPain: boolean;

  @IsOptional()
  @IsString()
  painLocation?: string;

  @IsOptional()
  @IsString()
  athleteNotes?: string;
}
