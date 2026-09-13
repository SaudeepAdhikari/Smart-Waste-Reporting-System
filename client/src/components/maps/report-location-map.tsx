'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
  SELECTED_LOCATION_ZOOM,
} from '@/lib/maps/config';
import type { GeoJsonPoint } from '@/types/reports';

interface ReportLocationMapProps {
  location: GeoJsonPoint | null;
  disabled?: boolean;
}

function createReportMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: 'waste-report-marker',
    html: `<span style="
      display:block;
      width:18px;
      height:18px;
      border-radius:9999px;
      background:#16a34a;
      border:3px solid #ffffff;
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export function ReportLocationMap({ location, disabled = false }: ReportLocationMapProps) {
  const icon = createReportMarkerIcon();

  if (!location?.coordinates?.length) {
    return (
      <div
        className="flex h-[320px] w-full items-center justify-center rounded-md border border-zinc-300 bg-zinc-50 text-sm text-zinc-500 sm:h-[420px] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
        role="status"
      >
        <p>Location not available</p>
      </div>
    );
  }

  const [longitude, latitude] = location.coordinates;

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-md border border-zinc-300 sm:h-[420px] dark:border-zinc-700">
      <MapContainer
        center={[latitude, longitude]}
        zoom={SELECTED_LOCATION_ZOOM}
        scrollWheelZoom={!disabled}
        dragging={!disabled}
        doubleClickZoom={!disabled}
        className="h-full w-full z-0"
        aria-label="Report location map"
      >
        <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
        <Marker position={[latitude, longitude]} icon={icon} />
      </MapContainer>
      {disabled && (
        <p className="pointer-events-none absolute left-2 top-2 z-[1000] max-w-[calc(100%-1rem)] rounded bg-white/90 px-2 py-1 text-xs text-zinc-700 shadow dark:bg-zinc-900/90 dark:text-zinc-200">
          Report location (view only)
        </p>
      )}
    </div>
  );
}