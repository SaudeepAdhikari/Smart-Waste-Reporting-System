import { ProtectedRoute } from '@/components/auth/protected-route';

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Waste Map
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            View waste incidents and collection routes on an interactive map.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 text-sm text-zinc-600 dark:text-zinc-400">
            <p>This feature will be implemented in the map integration phase.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
