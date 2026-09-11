'use client';

import { useAuth } from '@/providers/auth-provider';

export function WelcomeSection() {
  const { user } = useAuth();

  const userName = user?.fullName || 'Citizen';

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Welcome back, {userName}
      </h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        Report waste incidents and help improve your community
      </p>
    </div>
  );
}
