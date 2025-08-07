'use client';

import { useCallback, useEffect, useState } from 'react';

import { BusinessPlan, SubscriptionStatus } from '@/libs/types/api.types';
import { handleRequest } from '@/libs/services/http';
import { UpgradeUserData, UserSubscription } from '@/libs/services/api/types/user.types';
import { useAuth } from '@/libs/ui/providers/AuthProvider';

interface UseSubscriptionReturn {
  subscription: UserSubscription | null;
  isLoading: boolean;
  error: string | null;
  isFreeTier: boolean;
  isPremiumTier: boolean;
  isTrialTier: boolean;
  canMakeReservations: boolean;
  maxFavorites: number;
  planFeatures: string[];
  getSubscriptionStatus: () => Promise<void>;
  upgradeUser: (upgradeData: UpgradeUserData) => Promise<boolean>;
  isSubscriptionExpired: boolean;
  isTrialExpired: boolean;
  daysUntilExpiration: number | null;
}

/**
 * Hook for managing user subscription state and operations.
 * Handles free/premium/trial tiers and their limitations.
 */
export const useSubscription = (): UseSubscriptionReturn => {
  const { status: authStatus, token, user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = authStatus === 'authenticated' && token;

  /**
   * Fetch user subscription status from API
   */
  const getSubscriptionStatus = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !token) {
      setSubscription(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await handleRequest({
        endpoint: '/api/users/subscription-status',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });

      if (response.success && response.data) {
        setSubscription(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch subscription status');
      }
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching subscription status:', fetchError);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  /**
   * Upgrade user subscription (typically after payment)
   */
  const upgradeUser = useCallback(
    async (upgradeData: UpgradeUserData): Promise<boolean> => {
      if (!isAuthenticated || !token) {
        setError('Authentication required for upgrade');
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await handleRequest({
          body: upgradeData,
          endpoint: '/api/users/upgrade',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'POST',
        });

        if (response.success) {
          // Refresh subscription status after successful upgrade
          await getSubscriptionStatus();
          return true;
        } else {
          throw new Error(response.error || 'Failed to upgrade user');
        }
      } catch (upgradeError) {
        const errorMessage =
          upgradeError instanceof Error ? upgradeError.message : 'Upgrade failed';
        setError(errorMessage);
        console.error('Error upgrading user:', upgradeError);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, token, getSubscriptionStatus]
  );

  // Load subscription status when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      getSubscriptionStatus();
    } else {
      setSubscription(null);
      setError(null);
    }
  }, [isAuthenticated, getSubscriptionStatus]);

  // Calculate derived values
  const isFreeTier = subscription?.subscriptionStatus === SubscriptionStatus.FREE;
  const isPremiumTier = subscription?.subscriptionStatus === SubscriptionStatus.PREMIUM;
  const isTrialTier = subscription?.subscriptionStatus === SubscriptionStatus.TRIAL;

  const canMakeReservations = subscription?.canMakeReservations || false;
  const maxFavorites = subscription?.maxFavorites || 3;
  const planFeatures = subscription?.planFeatures || [];

  // Check if subscriptions are expired
  const isSubscriptionExpired = subscription?.subscriptionEndsAt
    ? new Date(subscription.subscriptionEndsAt) < new Date()
    : false;

  const isTrialExpired = subscription?.trialEndsAt
    ? new Date(subscription.trialEndsAt) < new Date()
    : false;

  // Calculate days until expiration
  const daysUntilExpiration = subscription?.subscriptionEndsAt
    ? Math.ceil(
        (new Date(subscription.subscriptionEndsAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : subscription?.trialEndsAt
      ? Math.ceil(
          (new Date(subscription.trialEndsAt).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return {
    canMakeReservations,
    daysUntilExpiration,
    error,
    getSubscriptionStatus,
    isFreeTier,
    isLoading,
    isPremiumTier,
    isSubscriptionExpired,
    isTrialExpired,
    isTrialTier,
    maxFavorites,
    planFeatures,
    subscription,
    upgradeUser,
  };
};
