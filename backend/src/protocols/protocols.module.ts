import { Module } from '@nestjs/common';
import { ProtocolsController } from './protocols.controller';
import { ProtocolsService } from './protocols.service';
import { TrainingSessionExercisesController } from './training-session-exercises.controller';

@Module({
  controllers: [ProtocolsController, TrainingSessionExercisesController],
  providers: [ProtocolsService],
  exports: [ProtocolsService],
})
export class ProtocolsModule {}
