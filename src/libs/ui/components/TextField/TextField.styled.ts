/**
 * TextField styled components based on Jafra's design system.
 * Following .styled.ts naming convention.
 */

import styled, { css } from 'styled-components';

export interface TextFieldStyledProps {
  variant?: 'filled' | 'outlined' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  error?: boolean;
  disabled?: boolean;
  focused?: boolean;
  hasStartIcon?: boolean;
  hasEndIcon?: boolean;
  multiline?: boolean;
}

const getVariantStyles = (variant: string, theme: any, error?: boolean, focused?: boolean) => {
  const borderColor = error
    ? theme.colors.error[500]
    : focused
      ? theme.colors.primary[500]
      : theme.colors.secondary[300];

  switch (variant) {
    case 'filled':
      return css`
        background-color: ${theme.colors.secondary[50]};
        border: none;
        border-bottom: 2px solid ${borderColor};
        border-radius: ${theme.borderRadius.base} ${theme.borderRadius.base} 0 0;

        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary[100]};
        }
      `;

    case 'standard':
      return css`
        background-color: transparent;
        border: none;
        border-bottom: 1px solid ${borderColor};
        border-radius: 0;

        &:hover:not(:disabled) {
          border-bottom-color: ${error ? theme.colors.error[600] : theme.colors.secondary[400]};
        }
      `;

    case 'outlined':
    default:
      return css`
        background-color: ${theme.colors.white};
        border: 1px solid ${borderColor};
        border-radius: ${theme.borderRadius.base};

        &:hover:not(:disabled) {
          border-color: ${error ? theme.colors.error[600] : theme.colors.secondary[400]};
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
      `;

    case 'large':
      return css`
        font-size: ${theme.typography.fontSize.lg};
        min-height: 48px;
      `;

    case 'medium':
    default:
      return css`
        font-size: ${theme.typography.fontSize.base};
        min-height: 40px;
      `;
  }
};

export const TextFieldContainer = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  position: relative;

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

export const TextFieldWrapper = styled.div<TextFieldStyledProps>`
  align-items: center;
  display: flex;
  position: relative;
  ${({ error, focused, theme, variant = 'outlined' }) =>
    getVariantStyles(variant, theme, error, focused)}
  ${({ size = 'medium', theme }) => getSizeStyles(size, theme)}
  ${({ disabled, theme }) =>
    disabled &&
    css`
      background-color: ${theme.colors.secondary[100]};
      cursor: not-allowed;
      opacity: 0.6;
    `}
  transition: all ${({ theme }) => theme.transitions.fast};
`;

export const StyledInput = styled.input<TextFieldStyledProps>`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary[900]};
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: inherit;
  outline: none;
  padding: ${({ hasEndIcon, hasStartIcon, theme }) => {
    const vertical = theme.spacing[2];
    const horizontal = theme.spacing[3];
    const leftPadding = hasStartIcon ? theme.spacing[10] : horizontal;
    const rightPadding = hasEndIcon ? theme.spacing[10] : horizontal;
    return `${vertical} ${rightPadding} ${vertical} ${leftPadding}`;
  }};

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:-webkit-autofill {
    box-shadow: 0 0 0 100px ${({ theme }) => theme.colors.white} inset;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.secondary[900]};
  }
`;

export const StyledTextArea = styled.textarea<TextFieldStyledProps>`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary[900]};
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: inherit;
  min-height: 80px;
  outline: none;
  padding: ${({ hasEndIcon, hasStartIcon, theme }) => {
    const vertical = theme.spacing[2];
    const horizontal = theme.spacing[3];
    const leftPadding = hasStartIcon ? theme.spacing[10] : horizontal;
    const rightPadding = hasEndIcon ? theme.spacing[10] : horizontal;
    return `${vertical} ${rightPadding} ${vertical} ${leftPadding}`;
  }};
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
    resize: none;
  }
`;

export const InputIcon = styled.div<{ position: 'start' | 'end' }>`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[500]};
  display: flex;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;

  ${({ position, theme }) =>
    position === 'start'
      ? css`
          left: ${theme.spacing[3]};
        `
      : css`
          right: ${theme.spacing[3]};
        `}
`;

export const ActionIcon = styled.button<{ position: 'start' | 'end' }>`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.secondary[500]};
  cursor: pointer;
  display: flex;
  height: 24px;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all ${({ theme }) => theme.transitions.fast};
  width: 24px;
  z-index: 2;

  ${({ position, theme }) =>
    position === 'start'
      ? css`
          left: ${theme.spacing[3]};
        `
      : css`
          right: ${theme.spacing[3]};
        `}

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[100]};
    color: ${({ theme }) => theme.colors.secondary[700]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 1px;
  }
`;

export const Label = styled.label<{
  floating?: boolean;
  focused?: boolean;
  hasValue?: boolean;
  error?: boolean;
  size?: 'small' | 'medium' | 'large';
}>`
  color: ${({ error, focused, theme }) =>
    error
      ? theme.colors.error[500]
      : focused
        ? theme.colors.primary[500]
        : theme.colors.secondary[600]};
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: ${({ size = 'medium', theme }) => {
    switch (size) {
      case 'small':
        return theme.typography.fontSize.xs;
      case 'large':
        return theme.typography.fontSize.base;
      default:
        return theme.typography.fontSize.sm;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  left: ${({ theme }) => theme.spacing[3]};
  pointer-events: none;
  position: absolute;
  transform-origin: left top;
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 1;

  ${({ floating, focused, hasValue, theme }) =>
    floating && (focused || hasValue)
      ? css`
          background-color: ${theme.colors.white};
          padding: 0 ${theme.spacing[1]};
          top: -8px;
          transform: scale(0.85);
        `
      : css`
          top: 50%;
          transform: translateY(-50%);
        `}
`;

export const HelperText = styled.div<{ error?: boolean }>`
  align-items: center;
  color: ${({ error, theme }) => (error ? theme.colors.error[600] : theme.colors.secondary[600])};
  display: flex;
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  min-height: 20px;
`;
