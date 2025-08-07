/// <reference types="@types/google.maps" />
import { useCallback, useEffect, useState } from 'react';

import { Loader } from '@googlemaps/js-api-loader';

interface PlaceResult {
  address: string;
  placeId: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface UseGooglePlacesReturn {
  isLoaded: boolean;
  error: string | null;
  initializeAutocomplete: (
    inputElement: HTMLInputElement,
    onPlaceSelected: (place: PlaceResult) => void
  ) => void;
  cleanup: () => void;
}

/**
 * Hook for Google Places Autocomplete functionality
 */
export const useGooglePlaces = (): UseGooglePlacesReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autocompleteInstance, setAutocompleteInstance] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps JavaScript API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      setError('Google Maps API key no configurada. Contacta al administrador.');
      console.warn('Google Maps API key is not properly configured');
      return;
    }

    const loader = new Loader({
      apiKey,
      language: 'es',
      libraries: ['places'],
      region: 'MX',
      version: 'weekly',
    });

    loader
      .load()
      .then(() => {
        setIsLoaded(true);
        setError(null);
      })
      .catch((err) => {
        setError(`Error al cargar Google Maps: ${err.message}`);
        console.error('Google Maps loading error:', err);
      });

    return () => {
      // Cleanup is handled by the loader
    };
  }, []);

  const initializeAutocomplete = useCallback(
    (inputElement: HTMLInputElement, onPlaceSelected: (place: PlaceResult) => void) => {
      if (!isLoaded || !window.google) {
        console.warn('Google Maps API not loaded yet');
        return;
      }

      try {
        // Cleanup previous instance
        if (autocompleteInstance) {
          google.maps.event.clearInstanceListeners(autocompleteInstance);
        }

        // Create new autocomplete instance with Mexico focus
        const autocomplete = new google.maps.places.Autocomplete(inputElement, {
          componentRestrictions: { country: 'MX' },
          fields: ['formatted_address', 'place_id', 'geometry.location'],
          types: ['address'],
        });

        // Set bias to Guadalajara, Mexico
        const guadalajaraBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(20.5198, -103.439), // Southwest
          new google.maps.LatLng(20.7516, -103.2576) // Northeast
        );
        autocomplete.setBounds(guadalajaraBounds);

        // Add place selection listener
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.formatted_address) {
            setError('Por favor selecciona una dirección válida de las opciones');
            return;
          }

          const placeResult: PlaceResult = {
            address: place.formatted_address,
            coordinates: place.geometry?.location
              ? {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }
              : undefined,
            placeId: place.place_id || '',
          };

          onPlaceSelected(placeResult);
          setError(null);
        });

        setAutocompleteInstance(autocomplete);
      } catch (err) {
        setError(`Error al inicializar autocompletado: ${(err as Error).message}`);
        console.error('Autocomplete initialization error:', err);
      }
    },
    [isLoaded, autocompleteInstance]
  );

  const cleanup = useCallback(() => {
    if (autocompleteInstance) {
      google.maps.event.clearInstanceListeners(autocompleteInstance);
      setAutocompleteInstance(null);
    }
  }, [autocompleteInstance]);

  return {
    cleanup,
    error,
    initializeAutocomplete,
    isLoaded,
  };
};
