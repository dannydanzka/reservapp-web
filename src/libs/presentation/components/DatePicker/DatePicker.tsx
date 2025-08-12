'use client';

import React, { useRef, useState } from 'react';

import { Calendar } from 'lucide-react';

import { DatePickerProps } from './DatePicker.types';

import {
  DatePickerContainer,
  DatePickerIcon,
  DatePickerInput,
  DatePickerInputContainer,
  DatePickerLabel,
  ErrorText,
  HelperText,
} from './DatePicker.styled';

export const DatePicker: React.FC<DatePickerProps> = ({
  className = undefined,
  disabled = false,
  error = undefined,
  format = 'YYYY-MM-DD',
  helperText = undefined,
  id = undefined,
  label = undefined,
  maxDate = undefined,
  minDate = undefined,
  name = undefined,
  onBlur = undefined,
  onChange = () => {},
  placeholder = 'Seleccionar fecha',
  required = false,
  size = 'medium',
  value = undefined,
  variant = 'outlined',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<string>('');

  const formatDate = (date: Date | string): string => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '';

    // Format as YYYY-MM-DD for input[type="date"]
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    setInternalValue(dateString);

    const parsedDate = parseDate(dateString);
    onChange(parsedDate);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const getDisplayValue = (): string => {
    if (value) {
      return formatDate(value);
    }
    return internalValue;
  };

  const getMinDate = (): string | undefined => {
    return minDate ? formatDate(minDate) : undefined;
  };

  const getMaxDate = (): string | undefined => {
    return maxDate ? formatDate(maxDate) : undefined;
  };

  return (
    <DatePickerContainer className={className}>
      {label && (
        <DatePickerLabel htmlFor={id}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </DatePickerLabel>
      )}

      <DatePickerInputContainer $disabled={disabled} $hasError={Boolean(error)} $size={size}>
        <DatePickerInput
          $size={size}
          disabled={disabled}
          id={id}
          max={getMaxDate()}
          min={getMinDate()}
          name={name}
          placeholder={placeholder}
          ref={inputRef}
          required={required}
          type='date'
          value={getDisplayValue()}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <DatePickerIcon $disabled={disabled}>
          <Calendar size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
        </DatePickerIcon>
      </DatePickerInputContainer>

      {error && <ErrorText>{error}</ErrorText>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </DatePickerContainer>
  );
};
