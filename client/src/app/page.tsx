'use client';

import { useAuth } from '@/providers/auth-provider';
import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ReportSummary } from '@/components/dashboard/report-summary';
import { RecentReports } from '@/components/dashboard/recent-reports';
import { NotificationPreview } from '@/components/dashboard/notification-preview';
import { HelpSection } from '@/components/dashboard/help-section';
import Link from 'next/link';

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Loading...
        </p>
      </div>
    </div>
  );
}

function PrimaryReportCTA() {
  return (
    <div className="mb-8">
      <Link
        href="/report"
        className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Report Waste
      </Link>
    </div>
  );
}

function PublicLanding() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Smart Waste Management
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
          Report waste incidents in your community. Help improve municipal waste collection
          with location-based reporting and evidence submission.
        </p>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-8 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            href="/report"
          >
            Report Waste
          </Link>
          <Link
            className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            href="/reports"
          >
            View My Reports
          </Link>
        </div>
      </div>

      <div className="mt-16 w-full max-w-4xl grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-6 w-6 text-zinc-900 dark:text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Location-Based</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Automatically capture GPS location or manually adjust waste incident locations
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-6 w-6 text-zinc-900 dark:text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Photo Evidence</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload photos to document waste incidents and help authorities respond effectively
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-6 w-6 text-zinc-900 dark:text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Track Progress</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Monitor your report status and view nearby waste incidents in your area
          </p>
        </div>
      </div>

      <div className="mt-16 w-full max-w-4xl">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Ready to make a difference?
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-xl mx-auto">
            Create an account or sign in to start reporting waste incidents in your community and track their resolution.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-green-600 px-8 text-base font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CitizenDashboard() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <WelcomeSection />
      <PrimaryReportCTA />
      <QuickActions />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section aria-labelledby="report-summary-heading">
            <h2 id="report-summary-heading" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Report Summary
            </h2>
            <ReportSummary />
          </section>

          <section aria-labelledby="recent-reports-heading">
            <h2 id="recent-reports-heading" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Recent Reports
            </h2>
            <RecentReports />
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section aria-labelledby="notifications-heading">
            <h2 id="notifications-heading" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Notifications
            </h2>
            <NotificationPreview />
          </section>

          <HelpSection />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated) {
    return <CitizenDashboard />;
  }

  return <PublicLanding />;
}
