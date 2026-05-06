import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AthleteAreaModule } from './athlete-area/athlete-area.module';
import { AthletesModule } from './athletes/athletes.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DomainModule } from './domain/domain.module';
import { ExercisesModule } from './exercises/exercises.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProtocolsModule } from './protocols/protocols.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DomainModule,
    AuthModule,
    AthletesModule,
    ExercisesModule,
    ProtocolsModule,
    PrescriptionsModule,
    AthleteAreaModule,
    DashboardModule,
  ],
})
export class AppModule {}
