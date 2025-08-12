import React, { useState } from 'react';

import { MapPin } from 'lucide-react';
import styled from 'styled-components';

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
  font-size: 1rem;
  transition: all 0.15s ease;

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
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ErrorText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.error[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const SuccessText = styled.div`
  font-size: 0.875rem;
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
  onChange = () => {},
  onPlaceSelected = () => {},
  placeholder = 'Buscar dirección...',
  required = false,
  value = '',
}) => {
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Simulate place selection when user types an address
    if (newValue.length > 20 && !isAddressSelected) {
      const mockPlace: PlaceResult = {
        address: newValue,
        coordinates: {
          lat: 20.6597,
          lng: -103.3496,
        },
        placeId: 'mock-place-' + Date.now(),
      };
      onPlaceSelected(mockPlace);
      setIsAddressSelected(true);
    } else if (newValue.length <= 20) {
      setIsAddressSelected(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission when Enter is pressed
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Container>
      <IconWrapper>
        <MapPin size={20} />
      </IconWrapper>
      <Input
        disabled={disabled}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        type='text'
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {isAddressSelected && value && (
        <SuccessText>
          <MapPin size={16} />
          Dirección ingresada (modo simplificado)
        </SuccessText>
      )}

      {!isAddressSelected && value && value.length > 0 && (
        <LoadingText>Ingrese la dirección completa del negocio...</LoadingText>
      )}
    </Container>
  );
};
