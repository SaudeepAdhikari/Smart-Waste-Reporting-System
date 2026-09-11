/**
 * Isolated map configuration for Leaflet + OpenStreetMap.
 * Default viewport is for map display only — never treated as a selected report location.
 */

export type LatLngTuple = [number, number];

/** Approximate center of Nepal — viewport only, not a report location. */
export const DEFAULT_MAP_CENTER: LatLngTuple = [28.3949, 84.124];

export const DEFAULT_MAP_ZOOM = 7;

export const SELECTED_LOCATION_ZOOM = 16;

export const OSM_TILE_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};
