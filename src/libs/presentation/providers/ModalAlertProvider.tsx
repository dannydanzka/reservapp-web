'use client';

import React, { createContext, useContext, useState } from 'react';

import styled from 'styled-components';

export interface ModalConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  showCancel?: boolean;
}

export interface ModalAlertContextValue {
  showModalAlert: (config: ModalConfig) => void;
  closeModalAlert: () => void;
}

const ModalAlertContext = createContext<ModalAlertContextValue | undefined>(undefined);

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  min-width: 320px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary[900]};
`;

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary[700]};
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant = 'secondary', theme }) =>
    $variant === 'primary'
      ? `
    background: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    border-color: ${theme.colors.primary[600]};

    &:hover {
      background: ${theme.colors.primary[700]};
      border-color: ${theme.colors.primary[700]};
    }
  `
      : `
    background: ${theme.colors.white};
    color: ${theme.colors.secondary[700]};
    border-color: ${theme.colors.secondary[300]};

    &:hover {
      background: ${theme.colors.secondary[50]};
      border-color: ${theme.colors.secondary[400]};
    }
  `}
`;

interface ModalProps extends ModalConfig {}

const Modal = ({
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  message,
  onCancel,
  onClose,
  onConfirm,
  showCancel = true,
  title,
}: ModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        {title && <ModalTitle>{title}</ModalTitle>}
        {message && <ModalMessage>{message}</ModalMessage>}
        <ButtonContainer>
          {showCancel && (
            <Button $variant='secondary' onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          <Button $variant='primary' onClick={onConfirm}>
            {confirmText}
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

interface ModalAlertProviderProps {
  children: React.ReactNode;
}

/**
 * Modal alert provider for global modal management.
 * Based on Jafra's stable modal architecture.
 */
export const ModalAlertProvider: React.FC<ModalAlertProviderProps> = ({ children }) => {
  const [modalAlertConfig, setModalAlertConfig] = useState<ModalConfig | null>(null);

  const showModalAlert = (config: ModalConfig) => {
    setModalAlertConfig(config);
  };

  const closeModalAlert = () => {
    if (modalAlertConfig?.onClose) {
      modalAlertConfig.onClose();
    }
    setModalAlertConfig(null);
  };

  const contextValue: ModalAlertContextValue = {
    closeModalAlert,
    showModalAlert,
  };

  return (
    <ModalAlertContext.Provider value={contextValue}>
      {children}
      {modalAlertConfig && <Modal {...modalAlertConfig} />}
    </ModalAlertContext.Provider>
  );
};

export const useModalAlert = (): ModalAlertContextValue => {
  const context = useContext(ModalAlertContext);
  if (context === undefined) {
    throw new Error('useModalAlert must be used within a ModalAlertProvider');
  }
  return context;
};
