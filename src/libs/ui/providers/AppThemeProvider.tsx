'use client';

import React from 'react';

import { ThemeProvider } from 'styled-components';

import { GlobalStyles } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider that wraps the entire application with styled-components theme.
 * Includes global styles and design system tokens.
 *
 * Based on Jafra's AppThemeProvider architecture.
 */
export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};
