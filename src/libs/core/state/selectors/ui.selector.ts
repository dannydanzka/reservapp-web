/**
 * UI selectors with optimized memoization.
 * Following .selector.ts naming convention from Jafra project.
 */

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

// Base selectors
const selectUIState = (state: RootState) => state.ui;

// Theme selectors
export const selectTheme = createSelector([selectUIState], (ui) => ui.theme);

export const selectLanguage = createSelector([selectUIState], (ui) => ui.language);

// Layout selectors
export const selectSidebar = createSelector([selectUIState], (ui) => ui.sidebar);

export const selectIsSidebarOpen = createSelector([selectSidebar], (sidebar) => sidebar.isOpen);

export const selectSidebarActiveSection = createSelector(
  [selectSidebar],
  (sidebar) => sidebar.activeSection
);

// Modal selectors
export const selectModal = createSelector([selectUIState], (ui) => ui.modal);

export const selectIsModalOpen = createSelector([selectModal], (modal) => modal.isOpen);

export const selectModalType = createSelector([selectModal], (modal) => modal.type);

export const selectModalData = createSelector([selectModal], (modal) => modal.data);

// Drawer selectors
export const selectDrawer = createSelector([selectUIState], (ui) => ui.drawer);

export const selectIsDrawerOpen = createSelector([selectDrawer], (drawer) => drawer.isOpen);

export const selectDrawerContent = createSelector([selectDrawer], (drawer) => drawer.content);

// Loading selectors
export const selectLoading = createSelector([selectUIState], (ui) => ui.loading);

export const selectIsGlobalLoading = createSelector([selectLoading], (loading) => loading.global);

export const selectComponentLoading = createSelector(
  [selectLoading],
  (loading) => loading.components
);

export const selectIsComponentLoading = (component: string) =>
  createSelector([selectComponentLoading], (componentLoading) =>
    Boolean(componentLoading[component])
  );

// Notification selectors
export const selectNotifications = createSelector([selectUIState], (ui) => ui.notifications);

export const selectActiveNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.slice(0, 5) // Show only first 5 notifications
);

export const selectNotificationCount = createSelector(
  [selectNotifications],
  (notifications) => notifications.length
);

export const selectHasNotifications = createSelector(
  [selectNotificationCount],
  (count) => count > 0
);

export const selectNotificationsByType = (type: 'success' | 'error' | 'warning' | 'info') =>
  createSelector([selectNotifications], (notifications) =>
    notifications.filter((notification) => notification.type === type)
  );

// Breadcrumb selectors
export const selectBreadcrumbs = createSelector([selectUIState], (ui) => ui.breadcrumbs);

export const selectActiveBreadcrumb = createSelector([selectBreadcrumbs], (breadcrumbs) =>
  breadcrumbs.find((crumb) => crumb.isActive)
);

export const selectBreadcrumbPath = createSelector([selectBreadcrumbs], (breadcrumbs) =>
  breadcrumbs.map((crumb) => crumb.label).join(' > ')
);

// Combined UI state selectors
export const selectUISettings = createSelector(
  [selectTheme, selectLanguage, selectIsSidebarOpen],
  (theme, language, isSidebarOpen) => ({
    isSidebarOpen,
    language,
    theme,
  })
);

export const selectOverlayState = createSelector(
  [selectIsModalOpen, selectIsDrawerOpen, selectIsGlobalLoading],
  (isModalOpen, isDrawerOpen, isGlobalLoading) => ({
    hasOverlay: isModalOpen || isDrawerOpen || isGlobalLoading,
    isDrawerOpen,
    isGlobalLoading,
    isModalOpen,
  })
);

// Layout helpers
export const selectLayoutClasses = createSelector(
  [selectIsSidebarOpen, selectTheme],
  (isSidebarOpen, theme) => {
    const classes = ['layout'];

    if (isSidebarOpen) classes.push('layout--sidebar-open');
    classes.push(`layout--theme-${theme}`);

    return classes.join(' ');
  }
);

// Responsive helpers (for future use with media query integration)
export const selectResponsiveState = createSelector([selectUIState], (_ui) => ({
  isDesktop: true,
  // These would be populated by media query hooks
  isMobile: false,
  isTablet: false,
}));
