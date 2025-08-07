/**
 * Card styled components based on Jafra's design system.
 * Following .styled.ts naming convention.
 */

import styled, { css } from 'styled-components';

export interface CardStyledProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  disabled?: boolean;
}

const getVariantStyles = (variant: string, theme: any) => {
  switch (variant) {
    case 'elevated':
      return css`
        background-color: ${theme.colors.white};
        border: none;
        box-shadow: ${theme.shadows.md};
      `;

    case 'filled':
      return css`
        background-color: ${theme.colors.secondary[50]};
        border: none;
        box-shadow: none;
      `;

    case 'outlined':
    default:
      return css`
        background-color: ${theme.colors.white};
        border: 1px solid ${theme.colors.secondary[200]};
        box-shadow: none;
      `;
  }
};

const getPaddingStyles = (padding: string, theme: any) => {
  switch (padding) {
    case 'none':
      return css`
        padding: 0;
      `;

    case 'small':
      return css`
        padding: ${theme.spacing[3]};
      `;

    case 'large':
      return css`
        padding: ${theme.spacing[6]};
      `;

    case 'medium':
    default:
      return css`
        padding: ${theme.spacing[4]};
      `;
  }
};

export const StyledCard = styled.div<CardStyledProps>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ theme, variant = 'outlined' }) => getVariantStyles(variant, theme)}
  ${({ padding = 'medium', theme }) => getPaddingStyles(padding, theme)}
  
  ${({ interactive, theme }) =>
    interactive &&
    css`
      cursor: pointer;

      &:hover {
        box-shadow: ${theme.shadows.lg};
        transform: translateY(-2px);
      }

      &:active {
        box-shadow: ${theme.shadows.md};
        transform: translateY(0);
      }
    `}
  
  ${({ disabled, theme }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      pointer-events: none;
    `}
`;

export const CardHeader = styled.div<{ padding?: 'none' | 'small' | 'medium' | 'large' }>`
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ padding = 'none', theme }) => {
    if (padding === 'none') return '';
    return getPaddingStyles(padding, theme);
  }}

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    padding-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

export const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin: 0;
`;

export const CardSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  margin: ${({ theme }) => theme.spacing[1]} 0 0 0;
`;

export const CardContent = styled.div<{ padding?: 'none' | 'small' | 'medium' | 'large' }>`
  flex: 1;

  ${({ padding = 'none', theme }) => {
    if (padding === 'none') return '';
    return getPaddingStyles(padding, theme);
  }}
`;

export const CardActions = styled.div<{
  padding?: 'none' | 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right' | 'space-between';
}>`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};

  ${({ alignment = 'right' }) => {
    switch (alignment) {
      case 'left':
        return css`
          justify-content: flex-start;
        `;
      case 'center':
        return css`
          justify-content: center;
        `;
      case 'space-between':
        return css`
          justify-content: space-between;
        `;
      default:
        return css`
          justify-content: flex-end;
        `;
    }
  }}

  ${({ padding = 'none', theme }) => {
    if (padding === 'none') return '';
    return getPaddingStyles(padding, theme);
  }}
  
  &:not(:first-child) {
    border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
    margin-top: ${({ theme }) => theme.spacing[4]};
    padding-top: ${({ theme }) => theme.spacing[4]};
  }
`;

export const CardMedia = styled.div<{
  height?: string;
  aspectRatio?: string;
}>`
  overflow: hidden;
  position: relative;

  ${({ height }) =>
    height &&
    css`
      height: ${height};
    `}

  ${({ aspectRatio }) =>
    aspectRatio &&
    css`
      aspect-ratio: ${aspectRatio};
    `}
  
  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;

export const CardBadge = styled.div<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>`
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.5px;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  position: absolute;
  text-transform: uppercase;

  ${({ theme, variant = 'primary' }) => {
    const colorPalette = theme.colors[variant] || theme.colors.primary;
    return css`
      background-color: ${colorPalette[600]};
      color: ${theme.colors.white};
    `;
  }}

  ${({ position = 'top-right', theme }) => {
    const offset = theme.spacing[3];
    switch (position) {
      case 'top-left':
        return css`
          left: ${offset};
          top: ${offset};
        `;
      case 'bottom-left':
        return css`
          bottom: ${offset};
          left: ${offset};
        `;
      case 'bottom-right':
        return css`
          bottom: ${offset};
          right: ${offset};
        `;
      default:
        return css`
          right: ${offset};
          top: ${offset};
        `;
    }
  }}
`;
