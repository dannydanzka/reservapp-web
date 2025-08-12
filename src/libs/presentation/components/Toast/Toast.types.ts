export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // in milliseconds, 0 means no auto-dismiss
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  showCloseButton?: boolean;
  onClose?: (id: string) => void;
  onClick?: () => void;
  className?: string;
}

export interface ToastContainerProps {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  className?: string;
}

export interface UseToastReturn {
  toast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  toasts: ToastProps[];
}
