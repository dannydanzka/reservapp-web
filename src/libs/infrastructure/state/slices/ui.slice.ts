/**
 * UI state management slice for ReservaApp.
 * Manages global UI state like modals, sidebars, themes, and notifications.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BaseState } from '../interfaces/base.interfaces';

export interface UIState extends BaseState {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
  sidebar: {
    isOpen: boolean;
    activeSection: string | null;
  };
  modal: {
    isOpen: boolean;
    type: string | null;
    data: Record<string, unknown> | null;
  };
  drawer: {
    isOpen: boolean;
    content: string | null;
  };
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    timestamp: string;
  }>;
  breadcrumbs: Array<{
    label: string;
    href?: string;
    isActive: boolean;
  }>;
}

const initialState: UIState = {
  breadcrumbs: [],
  drawer: {
    content: null,
    isOpen: false,
  },
  error: null,
  isError: false,
  isLoading: false,
  language: 'es',
  lastUpdated: undefined,
  loading: {
    components: {},
    global: false,
  },
  modal: {
    data: null,
    isOpen: false,
    type: null,
  },
  notifications: [],
  sidebar: {
    activeSection: null,
    isOpen: false,
  },
  theme: 'system',
};

const uiSlice = createSlice({
  initialState,
  name: 'ui',
  reducers: {
    addBreadcrumb: (
      state,
      action: PayloadAction<{
        label: string;
        href?: string;
      }>
    ) => {
      // Mark all existing breadcrumbs as inactive
      state.breadcrumbs.forEach((crumb) => {
        crumb.isActive = false;
      });

      // Add new active breadcrumb
      state.breadcrumbs.push({
        ...action.payload,
        isActive: true,
      });
    },

    // Notification management
    addNotification: (
      state,
      action: PayloadAction<{
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
        duration?: number;
      }>
    ) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);

      // Keep only last 50 notifications to prevent memory issues
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },

    clearComponentLoading: (state, action: PayloadAction<string>) => {
      delete state.loading.components[action.payload];
    },

    closeDrawer: (state) => {
      state.drawer.isOpen = false;
      state.drawer.content = null;
    },

    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.data = null;
    },

    // Drawer management
    openDrawer: (state, action: PayloadAction<string>) => {
      state.drawer.isOpen = true;
      state.drawer.content = action.payload;
    },

    // Modal management
    openModal: (state, action: PayloadAction<{ type: string; data?: Record<string, unknown> }>) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.data = action.payload.data || null;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // Breadcrumb management
    setBreadcrumbs: (
      state,
      action: PayloadAction<
        Array<{
          label: string;
          href?: string;
          isActive: boolean;
        }>
      >
    ) => {
      state.breadcrumbs = action.payload;
    },

    setComponentLoading: (
      state,
      action: PayloadAction<{ component: string; loading: boolean }>
    ) => {
      state.loading.components[action.payload.component] = action.payload.loading;
    },

    // Loading management
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },

    // Language management
    setLanguage: (state, action: PayloadAction<'es' | 'en'>) => {
      state.language = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    setSidebarActiveSection: (state, action: PayloadAction<string | null>) => {
      state.sidebar.activeSection = action.payload;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isOpen = action.payload;
    },

    // Theme management
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    // Sidebar management
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },

    // Reset UI state
    uiReset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  addBreadcrumb,
  addNotification,
  clearAllNotifications,
  clearBreadcrumbs,
  clearComponentLoading,
  closeDrawer,
  closeModal,
  openDrawer,
  openModal,
  removeNotification,
  setBreadcrumbs,
  setComponentLoading,
  setGlobalLoading,
  setLanguage,
  setSidebarActiveSection,
  setSidebarOpen,
  setTheme,
  toggleSidebar,
  uiReset,
} = uiSlice.actions;

export { uiSlice };
