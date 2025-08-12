'use client';

import React from 'react';

import { createPortal } from 'react-dom';

import { Toast } from './Toast';
import { ToastContainerProps, ToastProps } from './Toast.types';

import { ToastContainer as StyledToastContainer } from './Toast.styled';

interface ToastContainerComponentProps extends ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerComponentProps> = ({
  className,
  onDismiss,
  position = 'top-right',
  toasts,
}) => {
  if (typeof window === 'undefined' || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <StyledToastContainer $position={position} className={className}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} position={position} onClose={onDismiss} />
      ))}
    </StyledToastContainer>,
    document.body
  );
};
