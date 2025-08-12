'use client';

/**
 * Redux Provider component based on Jafra's architecture.
 * Integrates Redux store with persistence and SSR support.
 */

import React from 'react';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { persistor, store } from '@infrastructure/state/store';
import { ScreenLoader } from '@ui/ScreenLoader';

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Redux provider with persistence support.
 * Handles SSR hydration and loading states.
 */
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<ScreenLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
