import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ReportModel, type ReportDocument } from '../models';
import type {
  QuantityUnit,
  ReportSeverity,
  ReportStatus,
  WasteType,
} from '../constants/report.constants';

export interface CreateReportAttrs {
  citizenId: Types.ObjectId;
  wasteType: WasteType;
  description: string;
  estimatedQuantity: number;
  quantityUnit: QuantityUnit;
  severity: ReportSeverity;
  address: string;
  location: { type: 'Point'; coordinates: [number, number] };
}

export interface PaginatedReports {
  items: ReportDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ReportRepository {
  private readonly reportModel: Model<ReportDocument> = ReportModel;

  async create(data: CreateReportAttrs): Promise<ReportDocument> {
    const created = new this.reportModel({
      ...data,
      status: 'PENDING',
      images: [],
      incidentId: null,
      duplicateOf: null,
    });
    return created.save();
  }

  async findByCitizen(
    citizenId: Types.ObjectId,
    options: { page: number; limit: number }
  ): Promise<PaginatedReports> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(options.limit || 20, 100));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.reportModel.find({ citizenId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.reportModel.countDocuments({ citizenId }).exec(),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getSummary(citizenId: Types.ObjectId): Promise<{
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
  }> {
    const [total, pending, underReview, resolved] = await Promise.all([
      this.reportModel.countDocuments({ citizenId }).exec(),
      this.reportModel.countDocuments({ citizenId, status: 'PENDING' }).exec(),
      this.reportModel.countDocuments({ citizenId, status: 'UNDER_REVIEW' }).exec(),
      this.reportModel.countDocuments({ citizenId, status: 'RESOLVED' }).exec(),
    ]);

    return { total, pending, underReview, resolved };
  }

  async findById(id: string): Promise<ReportDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.reportModel.findById(id).exec();
  }

  async findByIdAndCitizen(
    id: string,
    citizenId: Types.ObjectId
  ): Promise<ReportDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.reportModel
      .findOne({ _id: new Types.ObjectId(id), citizenId })
      .exec();
  }

  async updateStatus(
    id: string,
    status: ReportStatus
  ): Promise<ReportDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.reportModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .exec();
  }

  async setResolvedAt(
    id: string,
    resolvedAt: Date | null
  ): Promise<ReportDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.reportModel
      .findByIdAndUpdate(
        id,
        { $set: { resolvedAt, updatedAt: new Date() } },
        { new: true }
      )
      .exec();
  }
}
