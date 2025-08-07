// Presentation hooks - Based on Jafra's stable hook architecture

// Utility hooks
export { useMediaQuery } from './useMediaQuery';
export { useLocalStorage } from './useLocalStorage';
export { useCloudinary } from './useCloudinary';

// Service hooks
export { useUserService } from './useUserService';
export { useReservationService } from './useReservationService';
export { useSubscription } from './useSubscription';

// Payment hooks
export { useStripe } from './useStripe';
export { useStripePayment, useStripeSetupIntent } from './useStripePayment';

// Email hooks
export { useEmail } from './useEmail';

// UI Enhancement hooks
export { useLoadingState } from './useLoadingState';
export { useConfirm } from './useConfirm';

// Redux hooks
export * from './useRedux';
export * from './useAuth';
export * from './useReservation';
export * from './useUI';
export * from './useUser';
export * from './useVenue';
