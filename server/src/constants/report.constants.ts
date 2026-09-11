export const WASTE_TYPES = [
  'ORGANIC',
  'PLASTIC',
  'PAPER',
  'GLASS',
  'METAL',
  'CONSTRUCTION',
  'HAZARDOUS',
  'MIXED',
  'OTHER',
] as const;

export const QUANTITY_UNITS = [
  'KG',
  'BAGS',
  'LITERS',
  'CUBIC_METERS',
  'OTHER',
] as const;

export const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const REPORT_STATUSES = [
  'PENDING',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED',
  'DUPLICATE',
  'CANCELLED',
  'RESOLVED',
] as const;

export const CITIZEN_CANCELABLE_STATUSES = ['PENDING'] as const;

export type WasteType = (typeof WASTE_TYPES)[number];
export type QuantityUnit = (typeof QUANTITY_UNITS)[number];
export type ReportSeverity = (typeof SEVERITY_LEVELS)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_ADDRESS_LENGTH = 500;
export const MAX_ESTIMATED_QUANTITY = 100000;
