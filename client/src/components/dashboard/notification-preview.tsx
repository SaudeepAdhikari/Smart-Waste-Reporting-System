'use client';

import { useNotifications } from '@/services/queries/notifications';

const notificationTypeLabels: Record<string, string> = {
  REPORT_VERIFIED: 'Report Verified',
  REPORT_REJECTED: 'Report Rejected',
  COLLECTION_SCHEDULED: 'Collection Scheduled',
  COLLECTION_COMPLETED: 'Collection Completed',
  SYSTEM_UPDATE: 'System Update',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' }).format(
    Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
}

function NotificationsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

function NotificationsEmpty() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No notifications yet. You will receive updates about your reports here.
      </p>
    </div>
  );
}

function NotificationsError() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Unable to load notifications. Please try again later.
      </p>
    </div>
  );
}

export function NotificationPreview() {
  const { data, isLoading, isError } = useNotifications(5);

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  if (isError || !data) {
    return <NotificationsError />;
  }

  if (data.length === 0) {
    return <NotificationsEmpty />;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((notification) => (
        <div
          key={notification.id}
          className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                {notification.title}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-2">
                {notification.message}
              </p>
            </div>
            {!notification.read && (
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-600" aria-label="Unread" />
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
              {notificationTypeLabels[notification.type] || notification.type}
            </span>
            {formatDate(notification.createdAt) && (
              <span>{formatDate(notification.createdAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
