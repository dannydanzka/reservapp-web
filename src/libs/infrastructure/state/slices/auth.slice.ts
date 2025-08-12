/**
 * Authentication slice following Jafra's patterns.
 * Manages user authentication state with async actions.
 */

import { AuthRepository } from '@mod-auth/data/repositories/AuthRepository';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRoleEnum } from '@prisma/client';

// Safe user type without password for frontend state
type SafeUser = Omit<User, 'password'>;

// Define types inline due to missing auth interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginSession {
  user: SafeUser;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

import { ApiError, BaseState } from '../interfaces/base.interfaces';

export interface AuthState extends BaseState {
  isAuthenticated: boolean;
  user: SafeUser | null;
  token: string | null;
  sessionExpires?: string | null;
  attempts: number;
  isBlocked: boolean;
}

const initialState: AuthState = {
  attempts: 0,
  error: null,
  isAuthenticated: false,
  isBlocked: false,
  isError: false,
  isLoading: false,
  lastUpdated: undefined,
  sessionExpires: null,
  token: null,
  user: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const authRepository = new AuthRepository();
      const response = await authRepository.authenticate(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error.code,
        message: error.message || 'Login failed',
        statusCode: error.statusCode,
      } as ApiError);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      const authRepository = new AuthRepository();
      const response = await authRepository.register(registerData);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error.code,
        message: error.message || 'Registration failed',
        statusCode: error.statusCode,
      } as ApiError);
    }
  }
);

export const validateTokenAsync = createAsyncThunk(
  'auth/validateToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const authRepository = new AuthRepository();
      const user = await authRepository.validateToken();
      return { token, user };
    } catch (error: any) {
      return rejectWithValue({
        code: error.code,
        message: error.message || 'Token validation failed',
        statusCode: error.statusCode,
      } as ApiError);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (token: string, { rejectWithValue }) => {
    try {
      const authRepository = new AuthRepository();
      await authRepository.logout();
      return true;
    } catch (error: any) {
      // Even if logout fails on server, we should clear local state
      console.warn('Logout API call failed:', error);
      return true;
    }
  }
);

// Helper functions
const resetHandler = (state: AuthState) => {
  Object.assign(state, initialState);
};

const authSlice = createSlice({
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user as unknown as SafeUser;
        state.token = action.payload.token;
        state.sessionExpires = action.payload.expiresAt;
        state.attempts = 0;
        state.isBlocked = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Login failed';
        state.attempts += 1;
        if (state.attempts >= 3) {
          state.isBlocked = true;
        }
      })

      // Register cases
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user as unknown as SafeUser;
        state.token = action.payload.token;
        state.sessionExpires = action.payload.expiresAt;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Registration failed';
      })

      // Token validation cases
      .addCase(validateTokenAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateTokenAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user as unknown as SafeUser;
        state.token = action.payload.token;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(validateTokenAsync.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.sessionExpires = null;
      })

      // Logout cases
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, resetHandler)
      .addCase(logoutAsync.rejected, resetHandler);
  },
  initialState,
  name: 'auth',
  reducers: {
    authErrorReset: (state) => {
      state.error = null;
      state.isError = false;
    },
    // Synchronous actions
    authReset: resetHandler,
    incrementLoginAttempts: (state) => {
      state.attempts += 1;
      if (state.attempts >= 3) {
        state.isBlocked = true;
      }
    },
    resetLoginAttempts: (state) => {
      state.attempts = 0;
      state.isBlocked = false;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },
  },
});

export const {
  authErrorReset,
  authReset,
  incrementLoginAttempts,
  resetLoginAttempts,
  updateUserProfile,
} = authSlice.actions;

export { authSlice };
