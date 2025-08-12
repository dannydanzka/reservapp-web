import styled from 'styled-components';

export const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const DatePickerLabel = styled.label`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

export const DatePickerInputContainer = styled.div<{
  $hasError?: boolean;
  $disabled?: boolean;
  $size?: 'small' | 'medium' | 'large';
}>`
  position: relative;
  display: flex;
  align-items: center;
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return 'height: 2.5rem;';
      case 'large':
        return 'height: 3.5rem;';
      default:
        return 'height: 3rem;';
    }
  }}
  border: 1px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error[500] : theme.colors.secondary[300]};
  border-radius: 0.5rem;
  background-color: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.secondary[100] : theme.colors.white};

  &:focus-within {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px
      ${({ $hasError, theme }) => ($hasError ? theme.colors.error[100] : theme.colors.primary[100])};
  }

  &:hover:not(:focus-within) {
    border-color: ${({ $disabled, $hasError, theme }) => {
      if ($disabled) return theme.colors.secondary[300];
      if ($hasError) return theme.colors.error[600];
      return theme.colors.secondary[400];
    }};
  }
`;

export const DatePickerInput = styled.input<{ $size?: 'small' | 'medium' | 'large' }>`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return '0.875rem';
      case 'large':
        return '1.125rem';
      default:
        return '1rem';
    }
  }};
  height: 100%;
  outline: none;
  padding: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '0.5rem 0.75rem';
      case 'large':
        return '1rem 1.25rem';
      default:
        return '0.75rem 1rem';
    }
  }};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[500]};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.secondary[500]};
    cursor: not-allowed;
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-calendar-picker-indicator {
    background: transparent;
    color: transparent;
    cursor: pointer;
    height: auto;
    inset: 0;
    position: absolute;
    width: auto;
  }
`;

export const DatePickerIcon = styled.div<{ $disabled?: boolean }>`
  align-items: center;
  color: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.secondary[400] : theme.colors.secondary[600]};
  display: flex;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  right: 0.75rem;
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error[700]};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const HelperText = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;
