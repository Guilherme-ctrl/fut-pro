import { PartialType } from '@nestjs/mapped-types';
import { AddTrainingExerciseDto } from './add-training-exercise.dto';

export class UpdateTrainingExerciseDto extends PartialType(
  AddTrainingExerciseDto,
) {}
