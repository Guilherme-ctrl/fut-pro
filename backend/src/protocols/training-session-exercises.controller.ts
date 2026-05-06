import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { JwtPayload } from '../auth/jwt.strategy';
import { AddTrainingExerciseDto } from './dto/add-training-exercise.dto';
import { UpdateTrainingExerciseDto } from './dto/update-training-exercise.dto';
import { ProtocolsService } from './protocols.service';

@Controller('training-sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PERSONAL)
export class TrainingSessionExercisesController {
  constructor(private readonly protocols: ProtocolsService) {}

  @Post(':id/exercises')
  add(
    @CurrentUser() user: JwtPayload,
    @Param('id') sessionId: string,
    @Body() dto: AddTrainingExerciseDto,
  ) {
    return this.protocols.addExerciseToSession(user.sub, sessionId, dto);
  }

  @Patch(':id/exercises/:trainingExerciseId')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') sessionId: string,
    @Param('trainingExerciseId') teId: string,
    @Body() dto: UpdateTrainingExerciseDto,
  ) {
    return this.protocols.updateSessionExercise(user.sub, sessionId, teId, dto);
  }

  @Delete(':id/exercises/:trainingExerciseId')
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') sessionId: string,
    @Param('trainingExerciseId') teId: string,
  ) {
    return this.protocols.removeSessionExercise(user.sub, sessionId, teId);
  }
}
