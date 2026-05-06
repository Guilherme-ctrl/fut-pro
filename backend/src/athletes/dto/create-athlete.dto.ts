import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { AthleteStatus } from '@prisma/client';

export class CreateAthleteDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  /** Senha para o atleta entrar em “Sou atleta” (mín. 6 caracteres). */
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  age?: number;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AthleteStatus)
  status?: AthleteStatus;
}
