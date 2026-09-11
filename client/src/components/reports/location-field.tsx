'use client';

import type { LocationCaptureStatus } from '@/types/reports';
import { useEffect } from 'react';
import { LocationPickerMapLoader } from '@/components/maps/location-picker-map-loader';
import { type SelectedLatLng } from '@/components/maps/location-marker';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationFieldProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  locationStatus: LocationCaptureStatus;
  onAddressChange: (value: string) => void;
  onAddressBlur: () => void;
  onLocationChange: (lat: number | null, lng: number | null) => void;
  addressError?: string;
  locationStatusError?: string;
  latitudeError?: string;
  longitudeError?: string;
  disabled?: boolean;
}

function formatCoordinate(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return 'Not captured';
  }
  return value.toFixed(6);
}

function formatAccuracy(accuracy: number | null): string {
  if (accuracy === null || !Number.isFinite(accuracy)) {
    return '';
  }
  if (accuracy < 1000) {
    return `approximately ${Math.round(accuracy)} m`;
  }
  return `approximately ${(accuracy / 1000).toFixed(1)} km`;
}

export function LocationField({
  address,
  latitude,
  longitude,
  locationStatus,
  onAddressChange,
  onAddressBlur,
  onLocationChange,
  addressError,
  locationStatusError,
  latitudeError,
  longitudeError,
  disabled = false,
}: LocationFieldProps) {
  const {
    status: geoStatus,
    result: geoResult,
    errorMessage: geoError,
    requestLocation,
    clearLocation,
    isRequesting,
  } = useGeolocation();

  const hasCoordinates =
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const currentPosition: SelectedLatLng | null =
    hasCoordinates ? { latitude, longitude } : null;

  useEffect(() => {
    if (geoStatus === 'success' && geoResult) {
      onLocationChange(geoResult.latitude, geoResult.longitude);
    }
  }, [geoStatus, geoResult, onLocationChange]);

  const handleMapPositionChange = (position: SelectedLatLng) => {
    onLocationChange(position.latitude, position.longitude);
  };

  const handleClearLocation = () => {
    clearLocation();
    onLocationChange(null, null);
  };

  const handleUseCurrentLocation = () => {
    requestLocation();
  };

  const statusLabel =
    locationStatus === 'coordinates_ready'
      ? 'Location selected'
      : locationStatus === 'address_only'
        ? 'Address provided (coordinates not set)'
        : 'No location selected';

  const geoStatusMessage = (() => {
    if (isRequesting) {
      return 'Getting your location...';
    }
    if (geoStatus === 'success' && geoResult) {
      return geoResult.accuracy !== null
        ? `Location accuracy: ${formatAccuracy(geoResult.accuracy)}`
        : 'Location obtained';
    }
    return null;
  })();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Location options
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select the waste location using your device GPS or by clicking on the map.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={disabled || isRequesting}
            className="min-h-11 rounded-md border border-green-600 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800 transition-colors hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
            aria-busy={isRequesting}
          >
            {isRequesting ? 'Getting location...' : 'Use My Current Location'}
          </button>
          <button
            type="button"
            onClick={handleClearLocation}
            disabled={disabled || (!hasCoordinates && !isRequesting)}
            className="min-h-11 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Clear Location
          </button>
        </div>
        {geoError && (
          <p
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {geoError}
          </p>
        )}
        {geoStatusMessage && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {geoStatusMessage}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Address / location description
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <p id="address-hint" className="text-sm text-zinc-500 dark:text-zinc-400">
          Include street or area, nearby landmark, ward, or other details that help
          a collector find the waste.
        </p>
        <textarea
          id="address"
          name="address"
          rows={3}
          value={address}
          disabled={disabled}
          onChange={(event) => onAddressChange(event.target.value)}
          onBlur={onAddressBlur}
          aria-invalid={addressError ? 'true' : 'false'}
          aria-describedby={
            addressError ? 'address-hint address-error' : 'address-hint'
          }
          required
          placeholder="e.g. Near the community water tap, Ward 5, opposite the school gate"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 sm:text-sm"
        />
        {addressError && (
          <p
            id="address-error"
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {addressError}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Select location on map
        </label>
        <LocationPickerMapLoader
          position={currentPosition}
          onPositionChange={handleMapPositionChange}
          disabled={disabled}
        />
      </div>

      <div
        className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
        aria-live="polite"
      >
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Location status
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Status</dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
              {statusLabel}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">
              Coordinates (longitude, latitude)
            </dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
              {hasCoordinates
                ? `${formatCoordinate(longitude)}, ${formatCoordinate(latitude)}`
                : 'Not set'}
            </dd>
          </div>
        </dl>
        {address && (
          <div className="mt-3">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Address</dt>
            <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {address}
            </dd>
          </div>
        )}
        {(locationStatusError || latitudeError || longitudeError) && (
          <div className="mt-3 space-y-1" role="alert">
            {locationStatusError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {locationStatusError}
              </p>
            )}
            {latitudeError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {latitudeError}
              </p>
            )}
            {longitudeError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {longitudeError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
