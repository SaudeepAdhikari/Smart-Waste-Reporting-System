'use client';

import { useCallback, useState } from 'react';
import { GEOLOCATION_OPTIONS } from '@/lib/maps/config';

export type GeolocationStatus =
  | 'idle'
  | 'requesting'
  | 'success'
  | 'permission_denied'
  | 'position_unavailable'
  | 'timeout'
  | 'error';

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export interface UseGeolocationReturn {
  status: GeolocationStatus;
  result: GeolocationResult | null;
  errorMessage: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
  isRequesting: boolean;
}

function getStatusFromError(error: GeolocationPositionError): GeolocationStatus {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'permission_denied';
    case error.POSITION_UNAVAILABLE:
      return 'position_unavailable';
    case error.TIMEOUT:
      return 'timeout';
    default:
      return 'error';
  }
}

function getErrorMessage(status: GeolocationStatus): string {
  switch (status) {
    case 'permission_denied':
      return 'Location permission was denied. You can select your location manually on the map.';
    case 'position_unavailable':
      return 'Your current location could not be determined. Please select a location on the map.';
    case 'timeout':
      return 'Location request timed out. Please try again or select a location on the map.';
    case 'error':
      return 'An unknown error occurred while getting your location. Please select a location on the map.';
    default:
      return '';
  }
}

export function useGeolocation(): UseGeolocationReturn {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [result, setResult] = useState<GeolocationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearLocation = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setErrorMessage(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage(
        'Geolocation is not supported by your browser. Please select a location on the map.'
      );
      return;
    }

    setStatus('requesting');
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus('success');
        setResult({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        const newStatus = getStatusFromError(error);
        setStatus(newStatus);
        setErrorMessage(getErrorMessage(newStatus));
        setResult(null);
      },
      GEOLOCATION_OPTIONS
    );
  }, []);

  return {
    status,
    result,
    errorMessage,
    requestLocation,
    clearLocation,
    isRequesting: status === 'requesting',
  };
}
