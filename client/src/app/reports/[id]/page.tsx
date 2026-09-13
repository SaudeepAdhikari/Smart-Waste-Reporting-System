'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ApiError } from '@/services/api/client';
import { useCancelReport, useReport } from '@/services/queries/reports';
import { StatusBadge } from '@/components/reports/status-badge';
import { ReportLocationMapLoader } from '@/components/maps/report-location-map-loader';
import {
  type ReportImage,
  severityLabels,
  wasteTypeLabels,
  quantityUnitLabels,
} from '@/types/reports';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data: report, isLoading, isError, error } = useReport(id);
  const cancelReport = useCancelReport();

  const isNotFound =
    isError && error instanceof ApiError && error.statusCode === 404;

  const handleCancel = () => {
    setCancelError(null);

    if (
      !window.confirm(
        'Cancel this report? It will be marked as cancelled and can no longer be edited.'
      )
    ) {
      return;
    }

    cancelReport.mutate(id, {
      onError: (err: unknown) => {
        if (err instanceof ApiError && err.statusCode === 409) {
          setCancelError(
            'This report can no longer be cancelled because it has already been reviewed.'
          );
        } else if (err instanceof ApiError) {
          setCancelError(err.message);
        } else {
          setCancelError('Could not cancel this report. Please try again.');
        }
      },
    });
  };

  if (!id || isLoading) {
    return <DetailSkeleton />;
  }

  if (isNotFound) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Report not found
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          This report does not exist or does not belong to you.
        </p>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Something went wrong
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Unable to load this report. Please try again later.
        </p>
      </div>
    );
  }

  const canCancel = report.status === 'PENDING';

  const evidenceImages: ReportImage[] = report.images.map((url, index) => ({
    id: url ?? `image-${index}`,
    url: url,
  }));

  return (
    <article className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Waste Report
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Report ID: <span className="font-mono">{report.id}</span>
          </p>
        </div>
        <StatusBadge status={report.status} />
      </header>

      <div className="space-y-6">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Reports
        </Link>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Waste type</dt>
          <dd className="mt-1 text-zinc-900 dark:text-zinc-50">
            {wasteTypeLabels[report.wasteType] ?? report.wasteType}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Severity</dt>
          <dd className="mt-1 text-zinc-900 dark:text-zinc-50">
            {severityLabels[report.severity] ?? report.severity}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Description</dt>
          <dd className="mt-1 whitespace-pre-wrap text-zinc-900 dark:text-zinc-50">
            {report.description}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Estimated quantity</dt>
          <dd className="mt-1 text-zinc-900 dark:text-zinc-50">
            {report.estimatedQuantity} {quantityUnitLabels[report.quantityUnit] ?? report.quantityUnit}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Address</dt>
          <dd className="mt-1 text-zinc-900 dark:text-zinc-50">
            {report.address || 'Not provided'}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Location (longitude, latitude)
          </dt>
          <dd className="mt-1 text-zinc-900 dark:text-zinc-50">
            {report.location?.coordinates?.length === 2
              ? `${report.location.coordinates[0].toFixed(6)}, ${report.location.coordinates[1].toFixed(6)}`
              : 'Not set'}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Submitted</dt>
          <dd className="mt-1 text-zinc-900 dark:text-zinc-50">
            {formatDate(report.submittedAt)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Last updated</dt>
          <dd className="mt-1 text-zinc-900 dark:text-zinc-50">
            {formatDate(report.updatedAt)}
          </dd>
        </div>
      </dl>
    </div>

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
          Location
        </h2>
        <ReportLocationMapLoader location={report.location} disabled={true} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
          Evidence photos
        </h2>
        {report.images.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No evidence photos were attached to this report.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {evidenceImages.map((image: ReportImage) => (
              <li
                key={image.id}
                className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={`Evidence for report ${report.id}`}
                  className="h-40 w-full object-cover"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {cancelError && (
        <p
          className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200"
          role="alert"
        >
          {cancelError}
        </p>
      )}

      {canCancel && (
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelReport.isPending}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {cancelReport.isPending ? 'Cancelling...' : 'Cancel Report'}
          </button>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Reports can only be cancelled before they are reviewed.
          </span>
        </div>
      )}
    </article>
  );
}
