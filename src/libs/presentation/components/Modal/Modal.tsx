'use client';

import React, { useEffect } from 'react';

import { X } from 'lucide-react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div<{ $maxWidth?: string }>`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: ${({ $maxWidth }) => $maxWidth || '500px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary[400]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[600]};
  }
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen = false,
  maxWidth = '500px',
  onClose = () => {},
  title = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContent $maxWidth={maxWidth}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>
            <X className='w-5 h-5' />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </ModalContent>
    </Overlay>
  );
};
