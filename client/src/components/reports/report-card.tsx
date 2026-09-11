import Link from 'next/link';
import type { Report } from '@/types/reports';
import { StatusBadge } from './status-badge';

interface ReportCardProps {
  report: Report;
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

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link
      href={`/reports/${report.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-green-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {report.wasteType}
            </span>
            <StatusBadge status={report.status} />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
            {report.location}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
            Submitted {formatDate(report.submittedAt)}
          </p>
        </div>
        {report.priority && (
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:text-right">
            {report.priority} Priority
          </span>
        )}
      </div>
    </Link>
  );
}
