import React from 'react';

import styled from 'styled-components';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const StyledBadge = styled.span<{ $variant: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return 'padding: 0.125rem 0.375rem; font-size: 0.75rem;';
      case 'lg':
        return 'padding: 0.25rem 0.75rem; font-size: 0.875rem;';
      default:
        return 'padding: 0.1875rem 0.5625rem; font-size: 0.8125rem;';
    }
  }}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
        background-color: ${theme.colors.primary[100]};
        color: ${theme.colors.primary[800]};
      `;
      case 'error':
        return `
        background-color: ${theme.colors.error[100]};
        color: ${theme.colors.error[800]};
      `;
      case 'secondary':
        return `
        background-color: ${theme.colors.secondary[100]};
        color: ${theme.colors.secondary[800]};
      `;
      default:
        return `
        background-color: ${theme.colors.secondary[100]};
        color: ${theme.colors.secondary[800]};
      `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({ children, size = 'md', variant = 'secondary' }) => {
  return (
    <StyledBadge $size={size} $variant={variant}>
      {children}
    </StyledBadge>
  );
};
