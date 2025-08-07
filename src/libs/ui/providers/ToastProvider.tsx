'use client';

import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import styled, { keyframes } from 'styled-components';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  id?: string;
  variant: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
  isClosing?: boolean;
}

interface ToastContextValue {
  showToast: (config: Omit<ToastConfig, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  z-index: 9999;
  pointer-events: none;
`;

const ToastWrapper = styled.div<{ $isClosing?: boolean }>`
  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.3s ease-in-out;
  pointer-events: auto;
`;

const ToastItem = styled.div<{ variant: ToastVariant }>`
  background: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return theme.colors.success[500];
      case 'error':
        return theme.colors.error[500];
      case 'warning':
        return theme.colors.warning[500];
      case 'info':
        return theme.colors.info[500];
      default:
        return theme.colors.secondary[500];
    }
  }};
  color: ${({ theme }) => theme.colors.white};
  padding: 16px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-width: 400px;
  min-width: 320px;
  position: relative;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const ToastDescription = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

interface ToastProps extends Omit<ToastConfig, 'id'> {
  onClose: () => void;
}

const Toast = ({ description, onClose, title, variant }: ToastProps) => (
  <ToastItem variant={variant}>
    <CloseButton onClick={onClose}>&times;</CloseButton>
    {title && <ToastTitle>{title}</ToastTitle>}
    {description && <ToastDescription>{description}</ToastDescription>}
  </ToastItem>
);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast provider for global notification management.
 * Based on Jafra's stable toast architecture with animations.
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, isClosing: true } : toast))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (config: Omit<ToastConfig, 'id'>) => {
      const id = generateId();
      const duration = config.duration ?? 5000;

      const newToast: ToastConfig = {
        ...config,
        id,
        isClosing: false,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }

      return id;
    },
    [generateId, hideToast]
  );

  const clearAllToasts = useCallback(() => {
    setToasts((prev) => prev.map((toast) => ({ ...toast, isClosing: true })));

    setTimeout(() => {
      setToasts([]);
    }, 300);
  }, []);

  const contextValue: ToastContextValue = {
    clearAllToasts,
    hideToast,
    showToast,
  };

  const handleCloseToast = useCallback(
    (id: string) => () => {
      hideToast(id);
    },
    [hideToast]
  );

  const RenderToasts = useMemo(() => {
    return (
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastWrapper $isClosing={toast.isClosing || false} key={toast.id}>
            <Toast
              description={toast.description}
              title={toast.title}
              variant={toast.variant}
              onClose={handleCloseToast(toast?.id || '')}
            />
          </ToastWrapper>
        ))}
      </ToastContainer>
    );
  }, [toasts, handleCloseToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {RenderToasts}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export const useToastHelpers = () => {
  const { showToast } = useToast();

  const showSuccess = useCallback(
    (config: Omit<ToastConfig, 'variant'>) => {
      return showToast({ ...config, variant: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (config: Omit<ToastConfig, 'variant'>) => {
      return showToast({ ...config, variant: 'error' });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (config: Omit<ToastConfig, 'variant'>) => {
      return showToast({ ...config, variant: 'warning' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (config: Omit<ToastConfig, 'variant'>) => {
      return showToast({ ...config, variant: 'info' });
    },
    [showToast]
  );

  return {
    showError,
    showInfo,
    showSuccess,
    showToast,
    showWarning,
  };
};
