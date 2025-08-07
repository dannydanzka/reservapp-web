/**
 * Custom reservation hook using Redux selectors.
 * Based on Jafra's domain hook patterns with selector integration.
 */

import { useCallback } from 'react';

import {
  addAdditionalGuest,
  cancelReservationAsync,
  clearCurrentReservation,
  clearSelectedDates,
  createReservationAsync,
  fetchUserReservationsAsync,
  Guest,
  PaymentDetails,
  processPaymentAsync,
  removeAdditionalGuest,
  Reservation,
  reservationErrorReset,
  ReservationState,
  setBookingStep,
  setCurrentReservation,
  setSelectedDates,
  updateGuestInfo,
} from '@/libs/core/state/slices/reservation.slice';
import {
  selectActiveReservations,
  selectAdditionalGuests,
  selectBookingStep,
  selectCanProceedToNextStep,
  selectCurrentReservation,
  selectGuestInfo,
  selectHasValidDates,
  selectIsPrimaryGuestComplete,
  selectNumberOfNights,
  selectPaymentDetails,
  selectPendingReservations,
  selectPrimaryGuest,
  selectReservationError,
  selectReservationLoading,
  selectReservations,
  selectReservationTotals,
  selectSelectedDates,
  selectTotalGuests,
  selectUpcomingReservations,
} from '@/libs/core/state/selectors';

import { useAppDispatch, useAppSelector } from './useRedux';

/**
 * Custom hook for reservation state and actions.
 * Provides both state selectors and action dispatchers.
 */
export const useReservation = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const currentReservation = useAppSelector(selectCurrentReservation);
  const reservations = useAppSelector(selectReservations);
  const selectedDates = useAppSelector(selectSelectedDates);
  const guestInfo = useAppSelector(selectGuestInfo);
  const primaryGuest = useAppSelector(selectPrimaryGuest);
  const additionalGuests = useAppSelector(selectAdditionalGuests);
  const paymentDetails = useAppSelector(selectPaymentDetails);
  const bookingStep = useAppSelector(selectBookingStep);
  const isLoading = useAppSelector(selectReservationLoading);
  const error = useAppSelector(selectReservationError);
  const totalGuests = useAppSelector(selectTotalGuests);
  const hasValidDates = useAppSelector(selectHasValidDates);
  const numberOfNights = useAppSelector(selectNumberOfNights);
  const isPrimaryGuestComplete = useAppSelector(selectIsPrimaryGuestComplete);
  const activeReservations = useAppSelector(selectActiveReservations);
  const pendingReservations = useAppSelector(selectPendingReservations);
  const upcomingReservations = useAppSelector(selectUpcomingReservations);
  const canProceedToNextStep = useAppSelector(selectCanProceedToNextStep);
  const reservationTotals = useAppSelector(selectReservationTotals);

  // Action dispatchers
  const createReservation = useCallback(
    async (reservationData: Partial<Reservation>) => {
      return dispatch(createReservationAsync(reservationData)).unwrap();
    },
    [dispatch]
  );

  const fetchUserReservations = useCallback(
    async (userId: string) => {
      return dispatch(fetchUserReservationsAsync(userId)).unwrap();
    },
    [dispatch]
  );

  const cancelReservation = useCallback(
    async (reservationId: string) => {
      return dispatch(cancelReservationAsync(reservationId)).unwrap();
    },
    [dispatch]
  );

  const processPayment = useCallback(
    async (params: { reservationId: string; paymentDetails: PaymentDetails }) => {
      return dispatch(processPaymentAsync(params)).unwrap();
    },
    [dispatch]
  );

  const setDates = useCallback(
    (dates: { checkIn: string; checkOut: string }) => {
      dispatch(setSelectedDates(dates));
    },
    [dispatch]
  );

  const clearDates = useCallback(() => {
    dispatch(clearSelectedDates());
  }, [dispatch]);

  const updateGuests = useCallback(
    (guestUpdates: { primaryGuest?: Partial<Guest>; additionalGuests?: Partial<Guest>[] }) => {
      dispatch(updateGuestInfo(guestUpdates));
    },
    [dispatch]
  );

  const addGuest = useCallback(() => {
    dispatch(addAdditionalGuest());
  }, [dispatch]);

  const removeGuest = useCallback(
    (index: number) => {
      dispatch(removeAdditionalGuest(index));
    },
    [dispatch]
  );

  const setStep = useCallback(
    (step: ReservationState['bookingStep']) => {
      dispatch(setBookingStep(step));
    },
    [dispatch]
  );

  const updateCurrentReservation = useCallback(
    (reservationData: Partial<Reservation>) => {
      dispatch(setCurrentReservation(reservationData));
    },
    [dispatch]
  );

  const clearReservation = useCallback(() => {
    dispatch(clearCurrentReservation());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(reservationErrorReset());
  }, [dispatch]);

  // Navigation helpers
  const goToNextStep = useCallback(() => {
    const stepOrder: ReservationState['bookingStep'][] = [
      'dates',
      'services',
      'guests',
      'payment',
      'confirmation',
    ];
    const currentIndex = stepOrder.indexOf(bookingStep);

    if (currentIndex < stepOrder.length - 1 && canProceedToNextStep) {
      setStep(stepOrder[currentIndex + 1]);
    }
  }, [bookingStep, canProceedToNextStep, setStep]);

  const goToPreviousStep = useCallback(() => {
    const stepOrder: ReservationState['bookingStep'][] = [
      'dates',
      'services',
      'guests',
      'payment',
      'confirmation',
    ];
    const currentIndex = stepOrder.indexOf(bookingStep);

    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  }, [bookingStep, setStep]);

  // Validation helpers
  const validateCurrentStep = useCallback(() => {
    return canProceedToNextStep;
  }, [canProceedToNextStep]);

  const getStepProgress = useCallback(() => {
    const stepOrder: ReservationState['bookingStep'][] = [
      'dates',
      'services',
      'guests',
      'payment',
      'confirmation',
    ];
    const currentIndex = stepOrder.indexOf(bookingStep);
    return {
      currentStep: currentIndex + 1,
      progress: ((currentIndex + 1) / stepOrder.length) * 100,
      totalSteps: stepOrder.length,
    };
  }, [bookingStep]);

  return {
    activeReservations,

    addGuest,

    additionalGuests,

    bookingStep,

    canProceedToNextStep,

    cancelReservation,

    clearDates,

    clearError,

    clearReservation,

    // Actions
    createReservation,

    // State
    currentReservation,

    error,

    fetchUserReservations,

    getStepProgress,

    // Helpers
    goToNextStep,

    goToPreviousStep,

    guestInfo,

    hasValidDates,

    isLoading,

    isPrimaryGuestComplete,

    numberOfNights,

    paymentDetails,

    pendingReservations,

    primaryGuest,

    processPayment,

    removeGuest,

    reservationTotals,

    reservations,

    selectedDates,

    setDates,

    setStep,

    totalGuests,

    upcomingReservations,
    updateCurrentReservation,
    updateGuests,
    validateCurrentStep,
  };
};
