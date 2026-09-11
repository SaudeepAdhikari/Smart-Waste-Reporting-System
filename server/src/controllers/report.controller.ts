import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService, toReportDto } from '../services/report.service';
import { CreateReportDto } from '../dto/report.dto';
import { JwtAuthGuard } from '../middleware/jwt.strategy';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../middleware/jwt.strategy';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(
    @Body() dto: CreateReportDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.reportService.create(dto, user);
  }

  @Get('my')
  async findMyReports(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page = '1',
    @Query('limit') limit = '20'
  ) {
    const result = await this.reportService.findMyReports(
      user,
      Number(page),
      Number(limit)
    );
    return {
      items: result.items.map((item) => toReportDto(item)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get('my/summary')
  async getMySummary(@CurrentUser() user: AuthenticatedUser) {
    return this.reportService.getSummary(user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.reportService.findOne(id, user);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.reportService.cancel(id, user);
  }
}
