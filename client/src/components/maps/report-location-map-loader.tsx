'use client';

import dynamic from 'next/dynamic';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { GeoJsonPoint } from '@/types/reports';

interface ReportLocationMapDynamicProps {
  location: GeoJsonPoint | null;
  disabled?: boolean;
}

const ReportLocationMap = dynamic(
  () =>
    import('./report-location-map').then((mod) => mod.ReportLocationMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[320px] w-full items-center justify-center rounded-md border border-zinc-300 bg-zinc-50 text-sm text-zinc-500 sm:h-[420px] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
        role="status"
      >
        Loading map...
      </div>
    ),
  }
);

interface MapErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends Component<
  { children: ReactNode },
  MapErrorBoundaryState
> {
  state: MapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Map failed to initialize', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex h-[320px] w-full flex-col items-center justify-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 text-center text-sm text-amber-900 sm:h-[420px] dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200"
          role="alert"
        >
          <p>The map could not be loaded right now.</p>
          <p>Location coordinates are displayed below.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ReportLocationMapLoader(props: ReportLocationMapDynamicProps) {
  return (
    <MapErrorBoundary>
      <ReportLocationMap {...props} />
    </MapErrorBoundary>
  );
}