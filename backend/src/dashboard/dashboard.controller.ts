import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { JwtPayload } from '../auth/jwt.strategy';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PERSONAL)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  summary(@CurrentUser() user: JwtPayload) {
    return this.dashboard.summary(user.sub);
  }

  @Get('athletes-status')
  athletesStatus(@CurrentUser() user: JwtPayload) {
    return this.dashboard.athletesStatus(user.sub);
  }

  @Get('alerts')
  alerts(@CurrentUser() user: JwtPayload) {
    return this.dashboard.alerts(user.sub);
  }
}
