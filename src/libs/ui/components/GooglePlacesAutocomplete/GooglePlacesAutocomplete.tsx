import React, { useEffect, useRef, useState } from 'react';

import { MapPin } from 'lucide-react';
import styled from 'styled-components';

import { useGooglePlaces } from '@/libs/presentation/hooks/useGooglePlaces';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.secondary[500]};
  z-index: 1;
`;

const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ErrorText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const SuccessText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.success[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

interface PlaceResult {
  address: string;
  placeId: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: PlaceResult) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
}

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  disabled = false,
  id,
  name,
  onChange,
  onPlaceSelected,
  placeholder = 'Buscar dirección...',
  required = false,
  value,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { cleanup, error, initializeAutocomplete, isLoaded } = useGooglePlaces();
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  useEffect(() => {
    if (isLoaded && inputRef.current && !disabled) {
      initializeAutocomplete(inputRef.current, (place) => {
        onChange(place.address);
        onPlaceSelected(place);
        setIsAddressSelected(true);
      });
    }

    return () => {
      cleanup();
    };
  }, [isLoaded, disabled, initializeAutocomplete, cleanup, onChange, onPlaceSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Reset address selection state when user types manually
    if (isAddressSelected) {
      setIsAddressSelected(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission when Enter is pressed on autocomplete
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Show loading state while Google Places API is loading
  if (!isLoaded && !error) {
    return (
      <Container>
        <IconWrapper>
          <MapPin size={20} />
        </IconWrapper>
        <Input disabled placeholder='Cargando mapa...' value='' onChange={() => {}} />
        <LoadingText>Cargando Google Places...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <IconWrapper>
        <MapPin size={20} />
      </IconWrapper>
      <Input
        disabled={disabled || !isLoaded}
        id={id}
        name={name}
        placeholder={isLoaded ? placeholder : 'Error cargando Google Places'}
        ref={inputRef}
        required={required}
        type='text'
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {error && <ErrorText>{error}. Verifica tu conexión e intenta nuevamente.</ErrorText>}

      {isLoaded && !error && isAddressSelected && (
        <SuccessText>
          <MapPin size={16} />
          Dirección verificada con Google Maps
        </SuccessText>
      )}

      {isLoaded && !error && !isAddressSelected && value && (
        <LoadingText>Escriba para buscar direcciones en México...</LoadingText>
      )}
    </Container>
  );
};
