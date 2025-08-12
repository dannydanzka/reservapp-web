'use client';

import { useCallback, useState } from 'react';

import { ToastProps, UseToastReturn } from './Toast.types';

let toastId = 0;

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback((toastOptions: Omit<ToastProps, 'id' | 'onClose'>): string => {
    const id = `toast-${++toastId}`;

    const newToast: ToastProps = {
      ...toastOptions,
      id,
      onClose: (toastId: string) => dismiss(toastId),
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    dismiss,
    dismissAll,
    toast,
    toasts,
  };
};

// Convenience methods for different toast types
export const createToastHelpers = (toast: UseToastReturn['toast']) => ({
  error: (title: string, message?: string, options?: Partial<ToastProps>) =>
    toast({ message, title, type: 'error', ...options }),

  info: (title: string, message?: string, options?: Partial<ToastProps>) =>
    toast({ message, title, type: 'info', ...options }),

  success: (title: string, message?: string, options?: Partial<ToastProps>) =>
    toast({ message, title, type: 'success', ...options }),

  warning: (title: string, message?: string, options?: Partial<ToastProps>) =>
    toast({ message, title, type: 'warning', ...options }),
});
