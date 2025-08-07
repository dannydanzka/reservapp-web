'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { BusinessPlan, SubscriptionStatus } from '@/libs/types/api.types';
import { UpgradeUserData, UserSubscription } from '@/libs/services/api/types/user.types';
import { useSubscription } from '@/libs/presentation/hooks/useSubscription';

import { useAuth } from './AuthProvider';

interface UserContextValue {
  // Subscription data
  subscription: UserSubscription | null;
  isLoadingSubscription: boolean;
  subscriptionError: string | null;

  // Subscription status helpers
  isFreeTier: boolean;
  isPremiumTier: boolean;
  isTrialTier: boolean;

  // User capabilities based on subscription
  canMakeReservations: boolean;
  maxFavorites: number;
  planFeatures: string[];

  // Subscription management
  getSubscriptionStatus: () => Promise<void>;
  upgradeUser: (upgradeData: UpgradeUserData) => Promise<boolean>;

  // Expiration checks
  isSubscriptionExpired: boolean;
  isTrialExpired: boolean;
  daysUntilExpiration: number | null;

  // Helper methods for UI
  shouldShowUpgradePrompt: () => boolean;
  getUpgradeReasons: () => string[];
  canAccessFeature: (feature: 'reservations' | 'favorites' | 'premium-content') => boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * UserContext provider that manages user subscription state and capabilities.
 * Works alongside AuthProvider to provide complete user context.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { status: authStatus, user } = useAuth();
  const [favoriteCount, setFavoriteCount] = useState(0);

  const {
    canMakeReservations,
    daysUntilExpiration,
    error: subscriptionError,
    getSubscriptionStatus,
    isFreeTier,
    isLoading: isLoadingSubscription,
    isPremiumTier,
    isSubscriptionExpired,
    isTrialExpired,
    isTrialTier,
    maxFavorites,
    planFeatures,
    subscription,
    upgradeUser,
  } = useSubscription();

  // Load subscription when user changes
  useEffect(() => {
    if (user && authStatus === 'authenticated') {
      getSubscriptionStatus();
    }
  }, [user, authStatus, getSubscriptionStatus]);

  /**
   * Determines if upgrade prompt should be shown to user
   */
  const shouldShowUpgradePrompt = (): boolean => {
    if (!user) return false;

    // Show for free users who have used some features
    if (isFreeTier && favoriteCount >= 2) return true;

    // Show for trial users approaching expiration
    if (isTrialTier && daysUntilExpiration !== null && daysUntilExpiration <= 7) return true;

    // Show for expired subscriptions
    if (isSubscriptionExpired || isTrialExpired) return true;

    return false;
  };

  /**
   * Gets list of reasons to upgrade (for UI messaging)
   */
  const getUpgradeReasons = (): string[] => {
    const reasons: string[] = [];

    if (isFreeTier) {
      reasons.push('Realizar reservas de servicios');
      reasons.push('Acceso a información completa de venues');
      reasons.push('Servicios favoritos ilimitados');
      reasons.push('Soporte prioritario');
    }

    if (isTrialTier && daysUntilExpiration !== null) {
      if (daysUntilExpiration <= 0) {
        reasons.push('Tu período de prueba ha expirado');
      } else if (daysUntilExpiration <= 7) {
        reasons.push(`Tu período de prueba expira en ${daysUntilExpiration} días`);
      }
    }

    if (isSubscriptionExpired) {
      reasons.push('Tu suscripción ha expirado');
      reasons.push('Reactiva tu acceso premium');
    }

    return reasons;
  };

  /**
   * Checks if user can access specific features
   */
  const canAccessFeature = (feature: 'reservations' | 'favorites' | 'premium-content'): boolean => {
    if (!user) return false;

    switch (feature) {
      case 'reservations':
        return canMakeReservations && !isSubscriptionExpired && !isTrialExpired;

      case 'favorites':
        if (isFreeTier) return favoriteCount < maxFavorites;
        return !isSubscriptionExpired && !isTrialExpired;

      case 'premium-content':
        return (isPremiumTier || isTrialTier) && !isSubscriptionExpired && !isTrialExpired;

      default:
        return false;
    }
  };

  const contextValue: UserContextValue = {
    canAccessFeature,

    // User capabilities
    canMakeReservations: canAccessFeature('reservations'),

    daysUntilExpiration,

    // Subscription management
    getSubscriptionStatus,

    getUpgradeReasons,

    // Subscription status helpers
    isFreeTier,

    isLoadingSubscription,

    isPremiumTier,

    // Expiration checks
    isSubscriptionExpired,

    isTrialExpired,

    isTrialTier,

    maxFavorites,

    planFeatures,

    // Helper methods
    shouldShowUpgradePrompt,

    // Subscription data
    subscription,

    subscriptionError,

    upgradeUser,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

/**
 * Hook to use user context.
 * Must be used within UserProvider.
 */
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
