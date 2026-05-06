import {
  Body,
  Controller,
  Delete,
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
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { ProtocolsService } from './protocols.service';

@Controller('protocols')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PERSONAL)
export class ProtocolsController {
  constructor(private readonly protocols: ProtocolsService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.protocols.list(user.sub);
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateProtocolDto) {
    return this.protocols.create(user.sub, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.protocols.getOne(user.sub, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProtocolDto,
  ) {
    return this.protocols.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.protocols.remove(user.sub, id);
  }

  @Post(':id/training-sessions')
  addSession(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: CreateTrainingSessionDto,
  ) {
    return this.protocols.addTrainingSession(user.sub, id, dto);
  }

  @Patch(':id/training-sessions/:trainingSessionId')
  updateSession(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Param('trainingSessionId') sessionId: string,
    @Body() dto: UpdateTrainingSessionDto,
  ) {
    return this.protocols.updateTrainingSession(user.sub, id, sessionId, dto);
  }

  @Delete(':id/training-sessions/:trainingSessionId')
  removeSession(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Param('trainingSessionId') sessionId: string,
  ) {
    return this.protocols.removeTrainingSession(user.sub, id, sessionId);
  }
}
