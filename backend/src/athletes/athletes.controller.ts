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
import { AdherenceService } from '../domain/adherence.service';
import type { JwtPayload } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@Controller('athletes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PERSONAL)
export class AthletesController {
  constructor(
    private readonly athletes: AthletesService,
    private readonly adherence: AdherenceService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.athletes.list(user.sub);
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateAthleteDto) {
    return this.athletes.create(user.sub, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.athletes.getOne(user.sub, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAthleteDto,
  ) {
    return this.athletes.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.athletes.remove(user.sub, id);
  }

  @Get(':id/history')
  history(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.athletes.history(user.sub, id);
  }

  @Get(':id/adherence')
  async adherenceMetrics(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    await this.athletes.getOne(user.sub, id);
    return this.adherence.getMetricsForAthlete(id);
  }

  @Get(':id/alerts')
  async alerts(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.athletes.getOne(user.sub, id);
    return this.prisma.alert.findMany({
      where: { athleteId: id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
