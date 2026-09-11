import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      href: '/report',
      label: 'Report Waste',
      description: 'Submit a new waste incident',
      primary: true,
    },
    {
      href: '/reports',
      label: 'My Reports',
      description: 'View your submitted reports',
      primary: false,
    },
    {
      href: '/map',
      label: 'Waste Map',
      description: 'Explore nearby waste incidents',
      primary: false,
    },
    {
      href: '/notifications',
      label: 'Notifications',
      description: 'View updates and alerts',
      primary: false,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`rounded-lg border p-4 transition-colors hover:border-green-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
              action.primary
                ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex flex-col gap-2">
              <span
                className={`font-medium ${
                  action.primary
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-zinc-900 dark:text-zinc-50'
                }`}
              >
                {action.label}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {action.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
