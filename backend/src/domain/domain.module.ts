import { Global, Module } from '@nestjs/common';
import { AdherenceService } from './adherence.service';
import { AlertService } from './alert.service';
import { ProgressionService } from './progression.service';

@Global()
@Module({
  providers: [ProgressionService, AdherenceService, AlertService],
  exports: [ProgressionService, AdherenceService, AlertService],
})
export class DomainModule {}
