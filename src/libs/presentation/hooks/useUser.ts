/**
 * Simple useUser hook - Temporary implementation
 */

export const useUser = () => {
  return {
    canMakeReservations: true,
    error: null,
    getUpgradeReasons: () => [],
    loading: false,
    shouldShowUpgradePrompt: () => false,
    user: null, // Don't show upgrade prompts in simplified version
  };
};
