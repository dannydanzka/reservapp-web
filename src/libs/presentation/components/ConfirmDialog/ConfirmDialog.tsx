'use client';

import React from 'react';

import { Button } from '../Button';
import type { ConfirmDialogProps } from './ConfirmDialog.interfaces';

import {
  StyledActions,
  StyledContent,
  StyledDialog,
  StyledHeader,
  StyledIcon,
  StyledMessage,
  StyledOverlay,
  StyledTitle,
} from './ConfirmDialog.styled';

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  isLoading = false,
  isOpen = false,
  message = '',
  onClose = () => {},
  onConfirm = () => {},
  title = '',
  variant = 'warning',
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <StyledOverlay onClick={handleOverlayClick}>
      <StyledDialog variant={variant}>
        <StyledHeader>
          <StyledIcon variant={variant}>{getIcon()}</StyledIcon>
          <StyledTitle variant={variant}>{title}</StyledTitle>
        </StyledHeader>

        <StyledContent>
          <StyledMessage>{message}</StyledMessage>
        </StyledContent>

        <StyledActions>
          <Button disabled={isLoading} variant='outlined' onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            disabled={isLoading}
            style={{
              backgroundColor: variant === 'danger' ? '#dc2626' : undefined,
              borderColor: variant === 'danger' ? '#dc2626' : undefined,
            }}
            variant='contained'
            onClick={handleConfirm}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </StyledActions>
      </StyledDialog>
    </StyledOverlay>
  );
};

export { ConfirmDialog };
