'use client';

import React from 'react';

import type { LoadingSpinnerProps } from './LoadingSpinner.interfaces';

import { Container, Spinner } from './LoadingSpinner.styled';

/**
 * Loading spinner component with different sizes.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = '#3b82f6',
  size = 'medium',
}) => {
  return (
    <Container>
      <Spinner $color={color} $size={size} aria-label='Loading' role='status' />
    </Container>
  );
};
