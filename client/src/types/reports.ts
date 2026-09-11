export type ReportStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'CANCELLED'
  | 'RESOLVED';

export type WasteType =
  | 'ORGANIC'
  | 'PLASTIC'
  | 'PAPER'
  | 'GLASS'
  | 'METAL'
  | 'CONSTRUCTION'
  | 'HAZARDOUS'
  | 'MIXED'
  | 'OTHER';

export type QuantityUnit = 'KG' | 'BAGS' | 'LITERS' | 'CUBIC_METERS' | 'OTHER';

export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Location capture state for the report form (GPS/map come in a later phase). */
export type LocationCaptureStatus =
  | 'not_set'
  | 'address_only'
  | 'coordinates_ready';

/** GeoJSON Point — coordinates are [longitude, latitude]. */
export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface ReportSummary {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
}

export interface Report {
  id: string;
  wasteType: string;
  location: string;
  status: ReportStatus;
  submittedAt: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

/** Client-side evidence file before remote upload is implemented. */
export interface EvidenceImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Form model for citizen waste report submission.
 * Distinct from the eventual backend WasteReport / WasteIncident documents.
 */
export interface ReportFormValues {
  wasteType: WasteType | '';
  description: string;
  estimatedQuantity: number | '';
  quantityUnit: QuantityUnit | '';
  severity: ReportSeverity | '';
  address: string;
  latitude: number | null;
  longitude: number | null;
  locationStatus: LocationCaptureStatus;
  images: EvidenceImageItem[];
}

/**
 * API-ready payload for POST /api/v1/reports.
 * Does not include citizenId (derived from auth), priorityScore, or other system fields.
 * Image URLs are omitted until the image-upload workflow exists.
 */
export interface CreateReportPayload {
  wasteType: WasteType;
  description: string;
  estimatedQuantity: number;
  quantityUnit: QuantityUnit;
  severity: ReportSeverity;
  address: string;
  location: GeoJsonPoint | null;
  imageCount: number;
}

export const statusLabels: Record<ReportStatus, string> = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  DUPLICATE: 'Duplicate',
  CANCELLED: 'Cancelled',
  RESOLVED: 'Resolved',
};

export const wasteTypeLabels: Record<WasteType, string> = {
  ORGANIC: 'Organic Waste',
  PLASTIC: 'Plastic',
  PAPER: 'Paper',
  GLASS: 'Glass',
  METAL: 'Metal',
  CONSTRUCTION: 'Construction Waste',
  HAZARDOUS: 'Hazardous Waste',
  MIXED: 'Mixed Waste',
  OTHER: 'Other',
};

export const quantityUnitLabels: Record<QuantityUnit, string> = {
  KG: 'Kilograms (kg)',
  BAGS: 'Bags',
  LITERS: 'Liters',
  CUBIC_METERS: 'Cubic meters (m³)',
  OTHER: 'Other',
};

export const severityLabels: Record<ReportSeverity, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const severityDescriptions: Record<ReportSeverity, string> = {
  LOW: 'Small amount / limited impact',
  MEDIUM: 'Noticeable waste accumulation',
  HIGH: 'Large accumulation or significant obstruction',
  CRITICAL: 'Serious public-health, safety, or environmental concern',
};

export const WASTE_TYPES: WasteType[] = [
  'ORGANIC',
  'PLASTIC',
  'PAPER',
  'GLASS',
  'METAL',
  'CONSTRUCTION',
  'HAZARDOUS',
  'MIXED',
  'OTHER',
];

export const QUANTITY_UNITS: QuantityUnit[] = [
  'KG',
  'BAGS',
  'LITERS',
  'CUBIC_METERS',
  'OTHER',
];

export const SEVERITY_LEVELS: ReportSeverity[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
];

/** Accepted evidence image MIME types. */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ACCEPTED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png,.webp';

/** 10 MB — suitable for typical mobile photographs. */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const MAX_EVIDENCE_IMAGES = 5;
