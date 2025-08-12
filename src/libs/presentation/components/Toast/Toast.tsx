'use client';

import React, { useEffect, useState } from 'react';

import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';

import { ToastProps } from './Toast.types';

import {
  ToastCloseButton,
  ToastContent,
  ToastIcon,
  ToastItem,
  ToastMessage,
  ToastTitle,
} from './Toast.styled';

const getToastIcon = (type: ToastProps['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <XCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
      return <Info size={20} />;
    default:
      return <Info size={20} />;
  }
};

export const Toast: React.FC<ToastProps> = ({
  className,
  duration = 5000,
  id,
  message,
  onClick,
  onClose,
  position = 'top-right',
  showCloseButton = true,
  title,
  type,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id]);

  const handleClose = () => {
    setIsExiting(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <ToastItem
      $isExiting={isExiting}
      $position={position}
      $type={type}
      className={className}
      onClick={handleClick}
    >
      <ToastIcon $type={type}>{getToastIcon(type)}</ToastIcon>

      <ToastContent>
        <ToastTitle $type={type}>{title}</ToastTitle>
        {message && <ToastMessage $type={type}>{message}</ToastMessage>}
      </ToastContent>

      {showCloseButton && (
        <ToastCloseButton
          $type={type}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <X size={16} />
        </ToastCloseButton>
      )}
    </ToastItem>
  );
};
