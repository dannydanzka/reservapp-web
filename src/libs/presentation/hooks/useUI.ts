/**
 * Custom UI hook using Redux selectors.
 * Based on Jafra's UI hook patterns with selector integration.
 */

import { useCallback } from 'react';

import {
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
} from '@/libs/core/state/slices/ui.slice';
import {
  selectActiveNotifications,
  selectBreadcrumbs,
  selectDrawerContent,
  selectIsComponentLoading,
  selectIsDrawerOpen,
  selectIsGlobalLoading,
  selectIsModalOpen,
  selectIsSidebarOpen,
  selectLanguage,
  selectModalData,
  selectModalType,
  selectNotificationCount,
  selectNotifications,
  selectOverlayState,
  selectSidebarActiveSection,
  selectTheme,
  selectUISettings,
} from '@/libs/core/state/selectors';

import { useAppDispatch, useAppSelector } from './useRedux';

/**
 * Custom hook for UI state and actions.
 * Provides both state selectors and action dispatchers.
 */
export const useUI = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const theme = useAppSelector(selectTheme);
  const language = useAppSelector(selectLanguage);
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);
  const sidebarActiveSection = useAppSelector(selectSidebarActiveSection);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const modalType = useAppSelector(selectModalType);
  const modalData = useAppSelector(selectModalData);
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const drawerContent = useAppSelector(selectDrawerContent);
  const isGlobalLoading = useAppSelector(selectIsGlobalLoading);
  const notifications = useAppSelector(selectNotifications);
  const activeNotifications = useAppSelector(selectActiveNotifications);
  const notificationCount = useAppSelector(selectNotificationCount);
  const breadcrumbs = useAppSelector(selectBreadcrumbs);
  const uiSettings = useAppSelector(selectUISettings);
  const overlayState = useAppSelector(selectOverlayState);

  // Action dispatchers
  const updateTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      dispatch(setTheme(newTheme));
    },
    [dispatch]
  );

  const updateLanguage = useCallback(
    (newLanguage: 'es' | 'en') => {
      dispatch(setLanguage(newLanguage));
    },
    [dispatch]
  );

  const toggleSidebarState = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const setSidebarState = useCallback(
    (isOpen: boolean) => {
      dispatch(setSidebarOpen(isOpen));
    },
    [dispatch]
  );

  const setActiveSection = useCallback(
    (section: string | null) => {
      dispatch(setSidebarActiveSection(section));
    },
    [dispatch]
  );

  const showModal = useCallback(
    (type: string, data?: Record<string, unknown>) => {
      dispatch(openModal({ data, type }));
    },
    [dispatch]
  );

  const hideModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const showDrawer = useCallback(
    (content: string) => {
      dispatch(openDrawer(content));
    },
    [dispatch]
  );

  const hideDrawer = useCallback(() => {
    dispatch(closeDrawer());
  }, [dispatch]);

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setGlobalLoading(loading));
    },
    [dispatch]
  );

  const setComponentLoadingState = useCallback(
    (component: string, loading: boolean) => {
      dispatch(setComponentLoading({ component, loading }));
    },
    [dispatch]
  );

  const clearComponentLoadingState = useCallback(
    (component: string) => {
      dispatch(clearComponentLoading(component));
    },
    [dispatch]
  );

  const isComponentLoading = useCallback((component: string) => {
    return useAppSelector(selectIsComponentLoading(component));
  }, []);

  const showNotification = useCallback(
    (notification: {
      type: 'success' | 'error' | 'warning' | 'info';
      title: string;
      message?: string;
      duration?: number;
    }) => {
      dispatch(addNotification(notification));
    },
    [dispatch]
  );

  const hideNotification = useCallback(
    (notificationId: string) => {
      dispatch(removeNotification(notificationId));
    },
    [dispatch]
  );

  const clearNotifications = useCallback(() => {
    dispatch(clearAllNotifications());
  }, [dispatch]);

  const updateBreadcrumbs = useCallback(
    (breadcrumbList: Array<{ label: string; href?: string; isActive: boolean }>) => {
      dispatch(setBreadcrumbs(breadcrumbList));
    },
    [dispatch]
  );

  const pushBreadcrumb = useCallback(
    (breadcrumb: { label: string; href?: string }) => {
      dispatch(addBreadcrumb(breadcrumb));
    },
    [dispatch]
  );

  const resetBreadcrumbs = useCallback(() => {
    dispatch(clearBreadcrumbs());
  }, [dispatch]);

  // Convenience methods
  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      showNotification({ duration, message, title, type: 'success' });
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      showNotification({ duration, message, title, type: 'error' });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showNotification({ duration, message, title, type: 'warning' });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      showNotification({ duration, message, title, type: 'info' });
    },
    [showNotification]
  );

  return {
    activeNotifications,

    breadcrumbs,

    clearComponentLoadingState,

    clearNotifications,

    drawerContent,

    hideDrawer,

    hideModal,

    hideNotification,

    isComponentLoading,

    isDrawerOpen,

    isGlobalLoading,

    isModalOpen,

    isSidebarOpen,

    language,

    modalData,

    modalType,

    notificationCount,

    notifications,

    overlayState,

    pushBreadcrumb,

    resetBreadcrumbs,

    setActiveSection,

    setComponentLoadingState,

    setLoading,

    setSidebarState,

    showDrawer,

    showError,

    showInfo,

    showModal,

    showNotification,

    // Convenience methods
    showSuccess,

    showWarning,

    sidebarActiveSection,

    // State
    theme,

    toggleSidebarState,

    uiSettings,

    updateBreadcrumbs,

    updateLanguage,
    // Actions
    updateTheme,
  };
};
