/**
 * Reservation management slice for ReservaApp.
 * Manages booking process, guest information, and payment flow.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApiError, BaseState } from '../interfaces/base.interfaces';

// Types for reservation domain
export interface Guest {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: 'DNI' | 'passport' | 'license';
  documentNumber: string;
  nationality: string;
  birthDate: string;
}

export interface Reservation {
  id: string;
  venueId: string;
  serviceId: string;
  primaryGuest: Guest;
  additionalGuests: Guest[];
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  serviceRate: number;
  taxes: number;
  serviceFees: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'cash' | 'transfer';
  stripePaymentIntentId?: string;
  clientSecret?: string;
}

export interface ReservationState extends BaseState {
  currentReservation: Partial<Reservation> | null;
  reservations: Reservation[];
  selectedDates: {
    checkIn: string | null;
    checkOut: string | null;
  };
  guestInfo: {
    primaryGuest: Partial<Guest>;
    additionalGuests: Partial<Guest>[];
  };
  paymentDetails: PaymentDetails | null;
  bookingStep: 'dates' | 'services' | 'guests' | 'payment' | 'confirmation';
}

const initialState: ReservationState = {
  bookingStep: 'dates',
  currentReservation: null,
  error: null,
  guestInfo: {
    additionalGuests: [],
    primaryGuest: {},
  },
  isError: false,
  isLoading: false,
  lastUpdated: undefined,
  paymentDetails: null,
  reservations: [],
  selectedDates: {
    checkIn: null,
    checkOut: null,
  },
};

// Async thunks
export const createReservationAsync = createAsyncThunk(
  'reservation/create',
  async (reservationData: Partial<Reservation>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/reservations', {
        body: JSON.stringify(reservationData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      const data = await response.json();
      return data as Reservation;
    } catch (error: any) {
      return rejectWithValue({
        code: 'CREATE_RESERVATION_ERROR',
        message: error.message || 'Failed to create reservation',
      } as ApiError);
    }
  }
);

export const fetchUserReservationsAsync = createAsyncThunk(
  'reservation/fetchUserReservations',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users/${userId}/reservations`);
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      return data as Reservation[];
    } catch (error: any) {
      return rejectWithValue({
        code: 'FETCH_RESERVATIONS_ERROR',
        message: error.message || 'Failed to fetch reservations',
      } as ApiError);
    }
  }
);

export const cancelReservationAsync = createAsyncThunk(
  'reservation/cancel',
  async (reservationId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      const data = await response.json();
      return data as Reservation;
    } catch (error: any) {
      return rejectWithValue({
        code: 'CANCEL_RESERVATION_ERROR',
        message: error.message || 'Failed to cancel reservation',
      } as ApiError);
    }
  }
);

export const processPaymentAsync = createAsyncThunk(
  'reservation/processPayment',
  async (
    params: { reservationId: string; paymentDetails: PaymentDetails },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with actual API call to Stripe
      const response = await fetch(`/api/reservations/${params.reservationId}/payment`, {
        body: JSON.stringify(params.paymentDetails),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const data = await response.json();
      return data as { reservation: Reservation; paymentDetails: PaymentDetails };
    } catch (error: any) {
      return rejectWithValue({
        code: 'PAYMENT_ERROR',
        message: error.message || 'Payment processing failed',
      } as ApiError);
    }
  }
);

const reservationSlice = createSlice({
  extraReducers: (builder) => {
    // Create reservation cases
    builder
      .addCase(createReservationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(createReservationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReservation = action.payload;
        state.reservations.unshift(action.payload);
        state.bookingStep = 'confirmation';
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createReservationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to create reservation';
      })

      // Fetch user reservations cases
      .addCase(fetchUserReservationsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(fetchUserReservationsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reservations = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserReservationsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch reservations';
      })

      // Cancel reservation cases
      .addCase(cancelReservationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(cancelReservationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.reservations.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(cancelReservationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to cancel reservation';
      })

      // Process payment cases
      .addCase(processPaymentAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(processPaymentAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReservation = action.payload.reservation;
        state.paymentDetails = action.payload.paymentDetails;

        // Update reservation in list
        const index = state.reservations.findIndex((r) => r.id === action.payload.reservation.id);
        if (index !== -1) {
          state.reservations[index] = action.payload.reservation;
        }

        state.lastUpdated = new Date().toISOString();
      })
      .addCase(processPaymentAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Payment processing failed';
      });
  },
  initialState,
  name: 'reservation',
  reducers: {
    addAdditionalGuest: (state) => {
      state.guestInfo.additionalGuests.push({});
    },

    clearCurrentReservation: (state) => {
      state.currentReservation = null;
      state.selectedDates = { checkIn: null, checkOut: null };
      state.guestInfo = { additionalGuests: [], primaryGuest: {} };
      state.paymentDetails = null;
      state.bookingStep = 'dates';
    },

    clearSelectedDates: (state) => {
      state.selectedDates = { checkIn: null, checkOut: null };
    },

    removeAdditionalGuest: (state, action: PayloadAction<number>) => {
      state.guestInfo.additionalGuests.splice(action.payload, 1);
    },

    reservationErrorReset: (state) => {
      state.error = null;
      state.isError = false;
    },
    // Synchronous actions
    reservationReset: (state) => {
      Object.assign(state, initialState);
    },
    setBookingStep: (state, action: PayloadAction<ReservationState['bookingStep']>) => {
      state.bookingStep = action.payload;
    },
    setCurrentReservation: (state, action: PayloadAction<Partial<Reservation>>) => {
      state.currentReservation = { ...state.currentReservation, ...action.payload };
    },
    setSelectedDates: (state, action: PayloadAction<{ checkIn: string; checkOut: string }>) => {
      state.selectedDates = action.payload;
      state.bookingStep = 'services';
    },
    updateGuestInfo: (
      state,
      action: PayloadAction<{
        primaryGuest?: Partial<Guest>;
        additionalGuests?: Partial<Guest>[];
      }>
    ) => {
      if (action.payload.primaryGuest) {
        state.guestInfo.primaryGuest = {
          ...state.guestInfo.primaryGuest,
          ...action.payload.primaryGuest,
        };
      }
      if (action.payload.additionalGuests) {
        state.guestInfo.additionalGuests = action.payload.additionalGuests;
      }
    },
  },
});

export const {
  addAdditionalGuest,
  clearCurrentReservation,
  clearSelectedDates,
  removeAdditionalGuest,
  reservationErrorReset,
  reservationReset,
  setBookingStep,
  setCurrentReservation,
  setSelectedDates,
  updateGuestInfo,
} = reservationSlice.actions;

export { reservationSlice };
