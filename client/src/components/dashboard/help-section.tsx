import Link from 'next/link';

export function HelpSection() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900" aria-labelledby="how-it-works">
      <h2 id="how-it-works" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        How It Works
      </h2>
      <ol className="flex flex-col gap-4">
        <li className="flex gap-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold text-sm">
            1
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">Identify the problem</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Find an uncollected, overflowing, or misplaced waste issue in your area.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold text-sm">
            2
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">Submit a report</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Provide the location, waste type, and optional evidence to help authorities respond.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold text-sm">
            3
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">Track progress</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Monitor your report status and receive updates as the municipality processes it.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold text-sm">
            4
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">Improve your community</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Your reports help the municipality plan collection routes and keep the city clean.
            </p>
          </div>
        </li>
      </ol>
      <div className="mt-6">
        <Link
          href="/reports"
          className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
          View your reports
        </Link>
      </div>
    </section>
  );
}
