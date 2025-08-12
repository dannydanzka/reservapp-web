/**
 * UI Components barrel export.
 * Based on Jafra's component architecture.
 */

// Core components
export { Button } from './Button';
export { TextField } from './TextField';
export { Card } from './Card';
export { DatePicker } from './DatePicker';
export { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';

// Loading components
export { ScreenLoader } from './ScreenLoader';

// Payment components
export { StripePaymentForm } from './StripePaymentForm';

// UI Enhancement components
export { ErrorBoundary } from './ErrorBoundary';
export { ErrorMessage } from './ErrorMessage';
export { ConfirmDialog } from './ConfirmDialog';
export { Breadcrumbs } from './Breadcrumbs';
export { ProgressBar } from './ProgressBar';
export { Toast, ToastContainer, useToast, createToastHelpers } from './Toast';

// Icon components
export * from './Icons';

// Individual components (no conflicting styled exports)
export { LoadingSpinner } from './LoadingSpinner';
// Logo component removed - replaced with styled text in components
export { PublicHeader } from './PublicHeader';
export { PublicFooter } from './PublicFooter';
export { AdminHeader } from './AdminHeader';
export { AdminSidebar } from './AdminSidebar';
