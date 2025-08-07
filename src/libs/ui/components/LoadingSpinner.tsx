'use client';

import React from 'react';

import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<{ $size: string; $color: string }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '16px';
      case 'large':
        return '48px';
      default:
        return '24px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '16px';
      case 'large':
        return '48px';
      default:
        return '24px';
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.secondary[200]};
  border-top: 2px solid ${({ $color }) => $color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
`;

/**
 * Loading spinner component with different sizes.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ color, size = 'medium' }) => {
  return (
    <Container>
      <Spinner $color={color || '#3b82f6'} $size={size} aria-label='Loading' role='status' />
    </Container>
  );
};
