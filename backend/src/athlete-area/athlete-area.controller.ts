import {
  Body,
  Controller,
  Get,
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
import { CompleteTrainingDto } from '../prescriptions/dto/complete-training.dto';
import { AthleteTrainingService } from './athlete-training.service';
import { StartTrainingDto } from './dto/start-training.dto';

@Controller('athlete')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ATHLETE)
export class AthleteAreaController {
  constructor(private readonly training: AthleteTrainingService) {}

  @Get('current-training')
  current(@CurrentUser() user: JwtPayload) {
    return this.training.currentTraining(user.athleteId!);
  }

  @Post('training-executions/start')
  start(@CurrentUser() user: JwtPayload, @Body() dto: StartTrainingDto) {
    return this.training.start(user.athleteId!, dto);
  }

  @Patch('training-executions/:id/steps/:stepId/complete')
  completeStep(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Param('stepId') stepId: string,
  ) {
    return this.training.completeStep(user.athleteId!, id, stepId);
  }

  @Post('training-executions/:id/complete')
  complete(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: CompleteTrainingDto,
  ) {
    return this.training.completeTraining(user.athleteId!, id, dto);
  }

  @Get('history')
  history(@CurrentUser() user: JwtPayload) {
    return this.training.history(user.athleteId!);
  }
}
