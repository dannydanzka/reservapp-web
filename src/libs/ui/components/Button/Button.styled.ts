/**
 * Button styled components based on Jafra's design system.
 * Following .styled.ts naming convention.
 */

import styled, { css } from 'styled-components';

export interface ButtonStyledProps {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const getVariantStyles = (variant: string, color: string, theme: any) => {
  const colorPalette = theme.colors[color] || theme.colors.primary;

  switch (variant) {
    case 'contained':
      return css`
        background-color: ${colorPalette[600]};
        border: 1px solid ${colorPalette[600]};
        color: ${theme.colors.white};

        &:hover:not(:disabled) {
          background-color: ${colorPalette[700]};
          border-color: ${colorPalette[700]};
        }

        &:active:not(:disabled) {
          background-color: ${colorPalette[800]};
          border-color: ${colorPalette[800]};
        }
      `;

    case 'outlined':
      return css`
        background-color: transparent;
        border: 1px solid ${colorPalette[600]};
        color: ${colorPalette[600]};

        &:hover:not(:disabled) {
          background-color: ${colorPalette[50]};
          border-color: ${colorPalette[700]};
          color: ${colorPalette[700]};
        }

        &:active:not(:disabled) {
          background-color: ${colorPalette[100]};
        }
      `;

    case 'text':
    default:
      return css`
        background-color: transparent;
        border: 1px solid transparent;
        color: ${colorPalette[600]};

        &:hover:not(:disabled) {
          background-color: ${colorPalette[50]};
          color: ${colorPalette[700]};
        }

        &:active:not(:disabled) {
          background-color: ${colorPalette[100]};
        }
      `;
  }
};

const getSizeStyles = (size: string, theme: any) => {
  switch (size) {
    case 'small':
      return css`
        font-size: ${theme.typography.fontSize.sm};
        min-height: 32px;
        padding: ${theme.spacing[1]} ${theme.spacing[3]};
      `;

    case 'large':
      return css`
        font-size: ${theme.typography.fontSize.lg};
        min-height: 48px;
        padding: ${theme.spacing[3]} ${theme.spacing[6]};
      `;

    case 'medium':
    default:
      return css`
        font-size: ${theme.typography.fontSize.base};
        min-height: 40px;
        padding: ${theme.spacing[2]} ${theme.spacing[4]};
      `;
  }
};

export const StyledButton = styled.button<ButtonStyledProps>`
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  display: inline-flex;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  ${({ color = 'primary', theme, variant = 'contained' }) =>
    getVariantStyles(variant, color, theme)}

  ${({ size = 'medium', theme }) => getSizeStyles(size, theme)}
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  
  &:focus {
    outline: 2px solid ${({ color = 'primary', theme }) => theme.colors[color][500]};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }

  ${({ loading }) =>
    loading &&
    css`
      opacity: 0.8;
      pointer-events: none;
    `}
`;

export const ButtonIcon = styled.span<{ position?: 'start' | 'end' }>`
  align-items: center;
  display: inline-flex;
  justify-content: center;

  ${({ position }) =>
    position === 'end' &&
    css`
      order: 1;
    `}
`;

export const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  border: 2px solid currentcolor;
  border-radius: 50%;
  border-top-color: transparent;
  height: 16px;
  width: 16px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
