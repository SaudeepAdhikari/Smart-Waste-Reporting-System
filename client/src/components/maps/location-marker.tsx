'use client';

import { useEffect, useMemo } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

export type SelectedLatLng = {
  latitude: number;
  longitude: number;
};

interface LocationMarkerProps {
  position: SelectedLatLng | null;
  onPositionChange: (position: SelectedLatLng) => void;
}

function createSelectedMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: 'waste-location-marker',
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

/** Recenter the map when a location is selected or cleared. */
export function MapViewController({
  position,
  defaultCenter,
  defaultZoom,
  selectedZoom,
}: {
  position: SelectedLatLng | null;
  defaultCenter: [number, number];
  defaultZoom: number;
  selectedZoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], selectedZoom, {
        duration: 0.6,
      });
      return;
    }
    map.flyTo(defaultCenter, defaultZoom, { duration: 0.5 });
  }, [position, map, defaultCenter, defaultZoom, selectedZoom]);

  return null;
}

export function MapClickHandler({
  onPositionChange,
}: {
  onPositionChange: (position: SelectedLatLng) => void;
}) {
  useMapEvents({
    click(event) {
      onPositionChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

export function LocationMarker({
  position,
  onPositionChange,
}: LocationMarkerProps) {
  const icon = useMemo(() => createSelectedMarkerIcon(), []);

  if (!position) {
    return null;
  }

  return (
    <Marker
      position={[position.latitude, position.longitude]}
      draggable
      icon={icon}
      eventHandlers={{
        dragend: (event) => {
          const marker = event.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          onPositionChange({
            latitude: lat,
            longitude: lng,
          });
        },
      }}
    />
  );
}
