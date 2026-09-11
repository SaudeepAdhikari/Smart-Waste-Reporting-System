'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
  SELECTED_LOCATION_ZOOM,
} from '@/lib/maps/config';
import {
  LocationMarker,
  MapClickHandler,
  MapViewController,
  type SelectedLatLng,
} from './location-marker';

interface LocationPickerMapProps {
  position: SelectedLatLng | null;
  onPositionChange: (position: SelectedLatLng) => void;
  disabled?: boolean;
}

export function LocationPickerMap({
  position,
  onPositionChange,
  disabled = false,
}: LocationPickerMapProps) {
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-md border border-zinc-300 sm:h-[420px] dark:border-zinc-700">
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={!disabled}
        dragging={!disabled}
        doubleClickZoom={!disabled}
        className="h-full w-full z-0"
        aria-label="Waste report location map"
      >
        <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
        <MapViewController
          position={position}
          defaultCenter={DEFAULT_MAP_CENTER}
          defaultZoom={DEFAULT_MAP_ZOOM}
          selectedZoom={SELECTED_LOCATION_ZOOM}
        />
        {!disabled && <MapClickHandler onPositionChange={onPositionChange} />}
        <LocationMarker
          position={position}
          onPositionChange={(next) => {
            if (!disabled) {
              onPositionChange(next);
            }
          }}
        />
      </MapContainer>
      <p className="pointer-events-none absolute left-2 top-2 z-[1000] max-w-[calc(100%-1rem)] rounded bg-white/90 px-2 py-1 text-xs text-zinc-700 shadow dark:bg-zinc-900/90 dark:text-zinc-200">
        Click the map to choose a location. Drag the marker to adjust.
      </p>
    </div>
  );
}
