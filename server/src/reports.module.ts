import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { ReportRepository } from './repositories/report.repository';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ReportsController],
  providers: [ReportService, ReportRepository],
})
export class ReportsModule {}
