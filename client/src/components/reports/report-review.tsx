'use client';

import {
  quantityUnitLabels,
  severityLabels,
  wasteTypeLabels,
  type EvidenceImageItem,
  type QuantityUnit,
  type ReportSeverity,
  type WasteType,
} from '@/types/reports';

interface ReportReviewProps {
  wasteType: WasteType | '';
  description: string;
  estimatedQuantity: number | '';
  quantityUnit: QuantityUnit | '';
  severity: ReportSeverity | '';
  address: string;
  latitude: number | null;
  longitude: number | null;
  images: EvidenceImageItem[];
}

export function ReportReview({
  wasteType,
  description,
  estimatedQuantity,
  quantityUnit,
  severity,
  address,
  latitude,
  longitude,
  images,
}: ReportReviewProps) {
  const hasCoordinates =
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const quantityLabel =
    estimatedQuantity === '' || quantityUnit === ''
      ? 'Not set'
      : `${estimatedQuantity} ${quantityUnitLabels[quantityUnit]}`;

  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Review before submitting
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Check that the details below match what you observed. You are submitting a
        citizen report — not creating an incident, collection task, or route.
      </p>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Waste type</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {wasteType ? wasteTypeLabels[wasteType] : 'Not selected'}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Description</dt>
          <dd className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-50">
            {description.trim() || 'Not provided'}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Quantity</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{quantityLabel}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">
            Initial severity
          </dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {severity ? severityLabels[severity] : 'Not selected'}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Address</dt>
          <dd className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-50">
            {address.trim() || 'Not provided'}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Coordinates</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {hasCoordinates
              ? `${longitude!.toFixed(6)}, ${latitude!.toFixed(6)} (lng, lat)`
              : 'Not captured yet'}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">
            Evidence photos
          </dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {images.length === 0
              ? 'None selected'
              : `${images.length} photo${images.length === 1 ? '' : 's'} selected (upload deferred)`}
          </dd>
        </div>
      </dl>
    </div>
  );
}
