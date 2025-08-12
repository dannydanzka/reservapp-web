/**
 * Simple User Context - Temporary implementation
 */
'use client';

import React, { createContext, useContext } from 'react';

interface UserContextValue {
  user: any;
  loading: boolean;
  error: any;
  canMakeReservations: boolean;
  getUpgradeReasons: () => string[];
  shouldShowUpgradePrompt: () => boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const value: UserContextValue = {
    canMakeReservations: true,
    error: null,
    getUpgradeReasons: () => [],
    loading: false,
    shouldShowUpgradePrompt: () => false,
    user: null,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
