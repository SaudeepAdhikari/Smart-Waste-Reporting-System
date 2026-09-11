import { Schema, Types, type HydratedDocument } from 'mongoose';
import {
  QUANTITY_UNITS,
  REPORT_STATUSES,
  SEVERITY_LEVELS,
  WASTE_TYPES,
  type QuantityUnit,
  type ReportSeverity,
  type ReportStatus,
  type WasteType,
} from '../constants/report.constants';

export const REPORT_MODEL = 'Report';

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface Report {
  _id: Types.ObjectId;
  citizenId: Types.ObjectId;
  wasteType: WasteType;
  description: string;
  estimatedQuantity: number;
  quantityUnit: QuantityUnit;
  severity: ReportSeverity;
  location: GeoJSONPoint;
  address: string;
  images: string[];
  status: ReportStatus;
  incidentId: Types.ObjectId | null;
  duplicateOf: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  resolvedAt: Date | null;
}

export type ReportDocument = HydratedDocument<Report>;

export const ReportSchema = new Schema<Report>(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    wasteType: { type: String, enum: [...WASTE_TYPES], required: true },
    description: { type: String, required: true, maxlength: 1000 },
    estimatedQuantity: {
      type: Number,
      required: true,
      min: 0.01,
      max: 100000,
    },
    quantityUnit: {
      type: String,
      enum: [...QUANTITY_UNITS],
      required: true,
    },
    severity: {
      type: String,
      enum: [...SEVERITY_LEVELS],
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, maxlength: 500, default: '' },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: [...REPORT_STATUSES],
      default: 'PENDING',
      required: true,
    },
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', default: null },
    duplicateOf: { type: Schema.Types.ObjectId, ref: 'Report', default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'waste_reports' }
);

ReportSchema.index({ location: '2dsphere' });
ReportSchema.index({ citizenId: 1, createdAt: -1 });
ReportSchema.index({ status: 1 });
