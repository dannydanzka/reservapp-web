/**
 * User management slice for ReservaApp.
 * Manages users list, CRUD operations, and admin functionality.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@prisma/client';

import { ApiError, BaseState } from '../interfaces/base.interfaces';

// Types for user domain
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithReservations extends User {
  reservations: Array<{
    id: string;
    status: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    service: {
      name: string;
      venue: {
        name: string;
      };
    };
  }>;
  _count: {
    reservations: number;
  };
}

export interface UserFilters {
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserData {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserState extends BaseState {
  users: User[];
  currentUser: User | null;
  selectedUser: UserWithReservations | null;
  filters: UserFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  filters: {},
  isError: false,
  isLoading: false,
  lastUpdated: undefined,
  pagination: {
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  },
  selectedUser: null,
  users: [],
};

// Async thunks for user management
export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async (
    params: { filters?: UserFilters; pagination?: { page?: number; limit?: number } } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();

      // Add filters
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      // Add pagination
      if (params.pagination?.page) {
        queryParams.append('page', params.pagination.page.toString());
      }
      if (params.pagination?.limit) {
        queryParams.append('limit', params.pagination.limit.toString());
      }

      const url = queryParams.toString() ? `/api/users?${queryParams.toString()}` : '/api/users';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();
      return data.data as PaginatedUsersResponse;
    } catch (error: any) {
      return rejectWithValue({
        code: 'FETCH_USERS_ERROR',
        message: error.message || 'Failed to fetch users',
      } as ApiError);
    }
  }
);

export const fetchUserByIdAsync = createAsyncThunk(
  'users/fetchUserById',
  async (params: { id: string; includeReservations?: boolean }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.includeReservations) {
        queryParams.append('includeReservations', 'true');
      }

      const url = queryParams.toString()
        ? `/api/users/${params.id}?${queryParams.toString()}`
        : `/api/users/${params.id}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }

      const data = await response.json();
      return data.data as User | UserWithReservations;
    } catch (error: any) {
      return rejectWithValue({
        code: 'FETCH_USER_ERROR',
        message: error.message || 'Failed to fetch user',
      } as ApiError);
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users', {
        body: JSON.stringify(userData),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const data = await response.json();
      return data.data as User;
    } catch (error: any) {
      return rejectWithValue({
        code: 'CREATE_USER_ERROR',
        message: error.message || 'Failed to create user',
      } as ApiError);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async (userData: UpdateUserData, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = userData;
      const response = await fetch(`/api/users/${id}`, {
        body: JSON.stringify(updateData),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const data = await response.json();
      return data.data as User;
    } catch (error: any) {
      return rejectWithValue({
        code: 'UPDATE_USER_ERROR',
        message: error.message || 'Failed to update user',
      } as ApiError);
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      return userId;
    } catch (error: any) {
      return rejectWithValue({
        code: 'DELETE_USER_ERROR',
        message: error.message || 'Failed to delete user',
      } as ApiError);
    }
  }
);

const userSlice = createSlice({
  extraReducers: (builder) => {
    // Fetch users cases
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = {
          limit: action.payload.limit,
          page: action.payload.page,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch users';
      })

      // Fetch user by ID cases
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Check if it has reservations to determine the type
        if ('reservations' in action.payload) {
          state.selectedUser = action.payload as UserWithReservations;
        } else {
          state.currentUser = action.payload as User;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch user';
      })

      // Create user cases
      .addCase(createUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.unshift(action.payload);
        state.pagination.total += 1;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to create user';
      })

      // Update user cases
      .addCase(updateUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to update user';
      })

      // Delete user cases
      .addCase(deleteUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isError = false;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = (action.payload as ApiError)?.message || 'Failed to delete user';
      });
  },
  initialState,
  name: 'users',
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.isError = false;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    resetUserState: (state) => {
      Object.assign(state, initialState);
    },
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<UserState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const { clearError, clearSelectedUser, resetUserState, setFilters, setPagination } =
  userSlice.actions;

export { userSlice };
