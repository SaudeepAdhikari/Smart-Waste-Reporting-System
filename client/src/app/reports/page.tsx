'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ReportCard } from '@/components/reports/report-card';
import { useMyReports } from '@/services/queries/reports';

function ReportsListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

function ReportsEmpty() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <svg
        className="mx-auto h-12 w-12 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h.75m3 3h.375a.375.375 0 00.375-.375v-1.125a.375.375 0 00-.375-.375h-.375m-3 0H9m3.75 0h.375a.375.375 0 00.375-.375v-1.125a.375.375 0 00-.375-.375h-.375m-3 0H9m3.75 0h.375a.375.375 0 00.375-.375v-1.125a.375.375 0 00-.375-.375"
        />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        No reports submitted yet
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        When you submit waste reports, they will appear here so you can track their progress.
      </p>
      <Link
        href="/report"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Report Waste
      </Link>
    </div>
  );
}

function ReportsError() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Unable to load your reports. Please try again later.
      </p>
    </div>
  );
}

export default function ReportsPage() {
  const { data: reports, isLoading, isError } = useMyReports();

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Reports
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              View and track the status of your submitted waste reports.
            </p>
          </div>
          <Link
            href="/report"
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Report Waste
          </Link>
        </header>

        {isLoading ? (
          <ReportsListSkeleton />
        ) : isError ? (
          <ReportsError />
        ) : reports && reports.length > 0 ? (
          <div className="flex flex-col gap-4">{reports.map((report) => <ReportCard key={report.id} report={report} />)}</div>
        ) : (
          <ReportsEmpty />
        )}
      </div>
    </ProtectedRoute>
  );
}
