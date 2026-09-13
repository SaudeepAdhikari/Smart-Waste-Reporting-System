import Link from 'next/link';
import { StatusBadge } from './status-badge';
import {
  type WasteReport,
  wasteTypeLabels,
  severityLabels,
} from '@/types/reports';

interface ReportCardProps {
  report: WasteReport;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatLocation(report: WasteReport): string {
  const { address, location } = report;
  if (address) {
    return address;
  }

  if (location?.coordinates?.length === 2) {
    const [longitude, latitude] = location.coordinates;
    return `${longitude.toFixed(5)}°, ${latitude.toFixed(5)}°`;
  }

  return 'Location not set';
}

export function ReportCard({ report }: ReportCardProps) {
  const locationLabel = report.location?.coordinates?.length === 2 ? 'Coordinates' : 'Location';

  return (
    <Link
      href={`/reports/${report.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-green-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {wasteTypeLabels[report.wasteType] ?? report.wasteType}
            </span>
            <StatusBadge status={report.status} />
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 line-clamp-2">
            {report.description}
          </p>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {severityLabels[report.severity] ?? report.severity} severity
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {locationLabel}: {formatLocation(report)}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
            Submitted {formatDate(report.submittedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
