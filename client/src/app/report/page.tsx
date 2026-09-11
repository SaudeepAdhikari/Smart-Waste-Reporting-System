import { ProtectedRoute } from '@/components/auth/protected-route';
import { ReportForm } from '@/components/reports/report-form';

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Report Waste
          </h1>
          <p className="mt-2 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
            Submit a citizen waste report with type, quantity, severity, location,
            and optional photo evidence. Municipal processing (incidents, priority,
            and routes) happens after submission on the server.
          </p>
        </header>

        <ReportForm />
      </div>
    </ProtectedRoute>
  );
}
