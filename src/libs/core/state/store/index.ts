/**
 * Redux store configuration based on Jafra's proven architecture.
 * Adapted for ReservaApp monolith structure with Redux Toolkit and persistence.
 */

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authSlice } from '../slices/auth.slice';
import { reservationSlice } from '../slices/reservation.slice';
import { uiSlice } from '../slices/ui.slice';
import { userSlice } from '../slices/user.slice';
import { venueSlice } from '../slices/venue.slice';

// Root reducer configuration
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  reservation: reservationSlice.reducer,
  ui: uiSlice.reducer,
  users: userSlice.reducer,
  venues: venueSlice.reducer,
});

// Persist configuration - selective persistence for security
const persistConfig = {
  // Only persist auth and UI preferences
  blacklist: ['reservation', 'users', 'venues'],
  key: 'reservapp_root',
  storage,
  whitelist: ['auth', 'ui'], // Never persist sensitive reservation/user/venue/service data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware
export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  reducer: persistedReducer,
});

// Create persistor
export const persistor = persistStore(store);

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Reset store function for logout
export const resetStore = () => {
  persistor.purge();
};
