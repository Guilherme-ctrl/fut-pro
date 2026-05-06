import { IsOptional, IsString } from 'class-validator';

export class StartTrainingDto {
  @IsOptional()
  @IsString()
  prescriptionId?: string;
}
