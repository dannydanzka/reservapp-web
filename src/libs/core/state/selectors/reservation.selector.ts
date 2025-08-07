/**
 * Reservation selectors with optimized memoization.
 * Following .selector.ts naming convention from Jafra project.
 */

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

// Base selectors
const selectReservationState = (state: RootState) => state.reservation;

// Basic selectors
export const selectCurrentReservation = createSelector(
  [selectReservationState],
  (reservation) => reservation.currentReservation
);

export const selectReservations = createSelector(
  [selectReservationState],
  (reservation) => reservation.reservations
);

export const selectSelectedDates = createSelector(
  [selectReservationState],
  (reservation) => reservation.selectedDates
);

export const selectGuestInfo = createSelector(
  [selectReservationState],
  (reservation) => reservation.guestInfo
);

export const selectPrimaryGuest = createSelector(
  [selectGuestInfo],
  (guestInfo) => guestInfo.primaryGuest
);

export const selectAdditionalGuests = createSelector(
  [selectGuestInfo],
  (guestInfo) => guestInfo.additionalGuests
);

export const selectPaymentDetails = createSelector(
  [selectReservationState],
  (reservation) => reservation.paymentDetails
);

export const selectBookingStep = createSelector(
  [selectReservationState],
  (reservation) => reservation.bookingStep
);

export const selectReservationLoading = createSelector(
  [selectReservationState],
  (reservation) => reservation.isLoading
);

export const selectReservationError = createSelector(
  [selectReservationState],
  (reservation) => reservation.error
);

// Computed selectors
export const selectTotalGuests = createSelector([selectGuestInfo], (guestInfo) => {
  const primaryGuestCount = Object.keys(guestInfo.primaryGuest).length > 0 ? 1 : 0;
  const additionalGuestCount = guestInfo.additionalGuests.filter(
    (guest) => Object.keys(guest).length > 0
  ).length;

  return primaryGuestCount + additionalGuestCount;
});

export const selectHasValidDates = createSelector([selectSelectedDates], (dates) =>
  Boolean(dates.checkIn && dates.checkOut)
);

export const selectNumberOfNights = createSelector([selectSelectedDates], (dates) => {
  if (!dates.checkIn || !dates.checkOut) return 0;

  const checkIn = new Date(dates.checkIn);
  const checkOut = new Date(dates.checkOut);
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Primary guest validation
export const selectIsPrimaryGuestComplete = createSelector([selectPrimaryGuest], (primaryGuest) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'documentType',
    'documentNumber',
  ];
  return requiredFields.every((field) => Boolean(primaryGuest[field as keyof typeof primaryGuest]));
});

// Reservation filtering selectors
export const selectActiveReservations = createSelector([selectReservations], (reservations) =>
  reservations.filter((reservation) => ['confirmed', 'paid'].includes(reservation.status))
);

export const selectPendingReservations = createSelector([selectReservations], (reservations) =>
  reservations.filter((reservation) => reservation.status === 'pending')
);

export const selectCancelledReservations = createSelector([selectReservations], (reservations) =>
  reservations.filter((reservation) => reservation.status === 'cancelled')
);

export const selectCompletedReservations = createSelector([selectReservations], (reservations) =>
  reservations.filter((reservation) => reservation.status === 'completed')
);

// Reservation by status
export const selectReservationsByStatus = (status: string) =>
  createSelector([selectReservations], (reservations) =>
    reservations.filter((reservation) => reservation.status === status)
  );

// Reservation by ID
export const selectReservationById = (reservationId: string) =>
  createSelector([selectReservations], (reservations) =>
    reservations.find((reservation) => reservation.id === reservationId)
  );

// Upcoming reservations (check-in within next 30 days)
export const selectUpcomingReservations = createSelector(
  [selectActiveReservations],
  (reservations) => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return reservations.filter((reservation) => {
      const checkInDate = new Date(reservation.checkInDate);
      return checkInDate >= now && checkInDate <= thirtyDaysFromNow;
    });
  }
);

// Booking progress validation
export const selectCanProceedToNextStep = createSelector(
  [selectBookingStep, selectHasValidDates, selectCurrentReservation, selectIsPrimaryGuestComplete],
  (step, hasValidDates, currentReservation, isPrimaryGuestComplete) => {
    switch (step) {
      case 'dates':
        return hasValidDates;
      case 'services':
        return Boolean(currentReservation?.serviceId);
      case 'guests':
        return isPrimaryGuestComplete;
      case 'payment':
        return Boolean(currentReservation?.totalAmount);
      default:
        return false;
    }
  }
);

// Financial selectors
export const selectReservationTotals = createSelector([selectCurrentReservation], (reservation) => {
  if (!reservation) return null;

  return {
    serviceFees: reservation.serviceFees || 0,
    subtotal: reservation.serviceRate || 0,
    taxes: reservation.taxes || 0,
    total: reservation.totalAmount || 0,
  };
});

// Date validation selectors
export const selectIsCheckInDateValid = createSelector([selectSelectedDates], (dates) => {
  if (!dates.checkIn) return false;
  const checkInDate = new Date(dates.checkIn);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return checkInDate >= today;
});

export const selectIsCheckOutDateValid = createSelector([selectSelectedDates], (dates) => {
  if (!dates.checkIn || !dates.checkOut) return false;
  const checkInDate = new Date(dates.checkIn);
  const checkOutDate = new Date(dates.checkOut);

  return checkOutDate > checkInDate;
});
