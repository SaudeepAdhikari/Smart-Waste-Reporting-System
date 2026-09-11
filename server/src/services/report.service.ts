import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ReportRepository } from '../repositories/report.repository';
import { CreateReportDto } from '../dto/report.dto';
import { CITIZEN_CANCELABLE_STATUSES, type ReportStatus } from '../constants/report.constants';
import type { AuthenticatedUser } from '../middleware/jwt.strategy';
import type { ReportDocument } from '../models/report.schema';

export interface ReportSummary {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
}

export interface PaginatedReports {
  items: ReportDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function toReportDto(doc: ReportDocument) {
  return {
    id: doc._id.toString(),
    citizenId: doc.citizenId.toString(),
    wasteType: doc.wasteType,
    description: doc.description,
    estimatedQuantity: doc.estimatedQuantity,
    quantityUnit: doc.quantityUnit,
    severity: doc.severity,
    location: {
      type: 'Point' as const,
      coordinates: [
        doc.location.coordinates[0],
        doc.location.coordinates[1],
      ] as [number, number],
    },
    address: doc.address ?? '',
    images: doc.images ?? [],
    status: doc.status,
    submittedAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    resolvedAt: doc.resolvedAt ?? null,
  };
}

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async create(
    dto: CreateReportDto,
    user: AuthenticatedUser
  ): Promise<ReturnType<typeof toReportDto>> {
    const created = await this.reportRepository.create({
      citizenId: new Types.ObjectId(user.userId),
      wasteType: dto.wasteType,
      description: dto.description,
      estimatedQuantity: dto.estimatedQuantity,
      quantityUnit: dto.quantityUnit,
      severity: dto.severity,
      address: dto.address ?? '',
      location: { type: 'Point', coordinates: dto.location.coordinates },
    });

    return toReportDto(created);
  }

  async findMyReports(
    user: AuthenticatedUser,
    page: number,
    limit: number
  ): Promise<PaginatedReports> {
    return this.reportRepository.findByCitizen(
      new Types.ObjectId(user.userId),
      { page, limit }
    );
  }

  async getSummary(user: AuthenticatedUser): Promise<ReportSummary> {
    const { items } = await this.reportRepository.findByCitizen(
      new Types.ObjectId(user.userId),
      { page: 1, limit: 1 }
    );
    // items is a subset; compute counts via a dedicated aggregation for accuracy.
    return this.reportRepository.getSummary(new Types.ObjectId(user.userId));
  }

  async findOne(
    id: string,
    user: AuthenticatedUser
  ): Promise<ReturnType<typeof toReportDto>> {
    const report = await this.reportRepository.findByIdAndCitizen(
      id,
      new Types.ObjectId(user.userId)
    );
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return toReportDto(report);
  }

  async cancel(
    id: string,
    user: AuthenticatedUser
  ): Promise<ReturnType<typeof toReportDto>> {
    const report = await this.reportRepository.findByIdAndCitizen(
      id,
      new Types.ObjectId(user.userId)
    );
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const canCancel = (CITIZEN_CANCELABLE_STATUSES as readonly string[]).includes(
      report.status
    );
    if (!canCancel) {
      throw new ConflictException(
        'This report can no longer be cancelled because it has already been reviewed.'
      );
    }

    const updated = await this.reportRepository.updateStatus(
      report._id.toString(),
      'CANCELLED'
    );
    if (!updated) {
      throw new ConflictException('Unable to cancel this report');
    }
    return toReportDto(updated);
  }
}

export type ReportDto = ReturnType<typeof toReportDto>;
