import { ProtectedRoute } from '@/components/auth/protected-route';

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Notifications
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            View updates about your reports and waste collection activities.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 text-sm text-zinc-600 dark:text-zinc-400">
            <p>This feature will be implemented in the notifications phase.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
