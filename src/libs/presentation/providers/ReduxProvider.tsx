'use client';

/**
 * Simple Redux Provider - Temporary implementation
 * Just provides a basic context without actual Redux store
 */

import React from 'react';

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Simplified ReduxProvider that just wraps children
 * TODO: Replace with actual Redux store once slices are working
 */
export const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return <>{children}</>;
};
