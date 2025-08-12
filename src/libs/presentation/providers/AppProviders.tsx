'use client';

import React from 'react';

import { AppThemeProvider } from './AppThemeProvider';
import { AuthProvider } from './AuthProvider';
import { ModalAlertProvider } from './ModalAlertProvider';
import { ReduxProvider } from './ReduxProvider';
import { ScreenLoaderProvider } from './ScreenLoaderProvider';
import { ToastProvider } from './ToastProvider';
import { UserProvider } from './UserContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Main providers wrapper for the entire application.
 * Includes Redux, theme, toast, modal, screen loader, auth, and user subscription providers.
 *
 * Based on Jafra's stable provider architecture with Redux integration.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <AppThemeProvider>
        <AuthProvider>
          <UserProvider>
            <ScreenLoaderProvider>
              <ModalAlertProvider>
                <ToastProvider>{children}</ToastProvider>
              </ModalAlertProvider>
            </ScreenLoaderProvider>
          </UserProvider>
        </AuthProvider>
      </AppThemeProvider>
    </ReduxProvider>
  );
};
