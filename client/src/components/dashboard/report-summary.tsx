import { useReportSummary } from '@/services/queries/reports';
import type { ReportSummary } from '@/types/reports';

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-2 h-8 w-8 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  );
}

function SummaryError() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Unable to load report summary. Please try again later.
      </p>
    </div>
  );
}

function SummaryContent({ summary }: { summary: ReportSummary }) {
  const items: { label: string; value: number; className: string }[] = [
    { label: 'Total', value: summary.total, className: 'text-zinc-900 dark:text-zinc-50' },
    { label: 'Pending', value: summary.pending, className: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Under Review', value: summary.underReview, className: 'text-blue-600 dark:text-blue-400' },
    { label: 'Resolved', value: summary.resolved, className: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{item.label}</p>
          <p className={`mt-2 text-2xl font-bold ${item.className}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function ReportSummary() {
  const { data, isLoading, isError } = useReportSummary();

  if (isLoading) {
    return <SummarySkeleton />;
  }

  if (isError || !data) {
    return <SummaryError />;
  }

  return <SummaryContent summary={data} />;
}
