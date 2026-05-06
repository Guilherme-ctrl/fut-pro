import { Module } from '@nestjs/common';
import { AthleteAreaController } from './athlete-area.controller';
import { AthleteTrainingService } from './athlete-training.service';

@Module({
  controllers: [AthleteAreaController],
  providers: [AthleteTrainingService],
})
export class AthleteAreaModule {}
