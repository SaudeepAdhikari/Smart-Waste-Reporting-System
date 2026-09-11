'use client';

import dynamic from 'next/dynamic';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { SelectedLatLng } from './location-marker';

interface LocationPickerMapDynamicProps {
  position: SelectedLatLng | null;
  onPositionChange: (position: SelectedLatLng) => void;
  disabled?: boolean;
}

const LocationPickerMap = dynamic(
  () =>
    import('./location-picker-map').then((mod) => mod.LocationPickerMap),
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
          <p>
            You can still set a location with &quot;Use My Current Location&quot;
            or by entering coordinates below.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function LocationPickerMapLoader(props: LocationPickerMapDynamicProps) {
  return (
    <MapErrorBoundary>
      <LocationPickerMap {...props} />
    </MapErrorBoundary>
  );
}
