import styled, { keyframes } from 'styled-components';

import { ToastType } from './Toast.types';

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const slideInUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div<{
  $position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}>`
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  width: 100%;
  padding: 1rem;

  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return `
          top: 0;
          left: 0;
          align-items: flex-start;
        `;
      case 'top-center':
        return `
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          align-items: center;
        `;
      case 'top-right':
        return `
          top: 0;
          right: 0;
          align-items: flex-end;
        `;
      case 'bottom-left':
        return `
          bottom: 0;
          left: 0;
          align-items: flex-start;
          flex-direction: column-reverse;
        `;
      case 'bottom-center':
        return `
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          align-items: center;
          flex-direction: column-reverse;
        `;
      case 'bottom-right':
        return `
          bottom: 0;
          right: 0;
          align-items: flex-end;
          flex-direction: column-reverse;
        `;
      default:
        return `
          top: 0;
          right: 0;
          align-items: flex-end;
        `;
    }
  }}

  @media (width <= 480px) {
    left: 0.5rem;
    right: 0.5rem;
    max-width: none;
    padding: 0.5rem;

    ${({ $position }) => {
      if ($position.includes('center')) {
        return `
          left: 0.5rem;
          right: 0.5rem;
          transform: none;
        `;
      }
    }}
  }
`;

export const ToastItem = styled.div<{
  $type: ToastType;
  $position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  $isExiting?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgb(0 0 0 / 0.15);
  pointer-events: auto;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  max-width: 100%;

  /* Animation based on position and exit state */
  ${({ $isExiting, $position }) => {
    if ($isExiting) {
      if ($position.includes('right')) {
        return `animation: ${slideOutRight} 0.3s ease forwards;`;
      } else if ($position.includes('left')) {
        return `animation: ${slideOutLeft} 0.3s ease forwards;`;
      } else if ($position.includes('bottom')) {
        return `animation: ${slideOutDown} 0.3s ease forwards;`;
      } else {
        return `animation: ${slideOutUp} 0.3s ease forwards;`;
      }
    } else {
      if ($position.includes('right')) {
        return `animation: ${slideInRight} 0.3s ease;`;
      } else if ($position.includes('left')) {
        return `animation: ${slideInLeft} 0.3s ease;`;
      } else if ($position.includes('bottom')) {
        return `animation: ${slideInUp} 0.3s ease;`;
      } else {
        return `animation: ${slideInDown} 0.3s ease;`;
      }
    }
  }}

  /* Color scheme based on type */
  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return `
          background: ${theme.colors.success[50]};
          border-left: 4px solid ${theme.colors.success[500]};
        `;
      case 'error':
        return `
          background: ${theme.colors.error[50]};
          border-left: 4px solid ${theme.colors.error[500]};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning[50]};
          border-left: 4px solid ${theme.colors.warning[500]};
        `;
      case 'info':
        return `
          background: ${theme.colors.primary[50]};
          border-left: 4px solid ${theme.colors.primary[500]};
        `;
      default:
        return `
          background: ${theme.colors.secondary[50]};
          border-left: 4px solid ${theme.colors.secondary[500]};
        `;
    }
  }}
  
  &:hover {
    box-shadow: 0 15px 35px rgb(0 0 0 / 0.2);
    transform: translateY(-2px);
  }
`;

export const ToastIcon = styled.div<{ $type: ToastType }>`
  align-items: center;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success[600];
      case 'error':
        return theme.colors.error[600];
      case 'warning':
        return theme.colors.warning[600];
      case 'info':
        return theme.colors.primary[600];
      default:
        return theme.colors.secondary[600];
    }
  }};
  display: flex;
  flex-shrink: 0;
  height: 1.5rem;
  justify-content: center;
  width: 1.5rem;
`;

export const ToastContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ToastTitle = styled.h4<{ $type: ToastType }>`
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success[800];
      case 'error':
        return theme.colors.error[800];
      case 'warning':
        return theme.colors.warning[800];
      case 'info':
        return theme.colors.primary[800];
      default:
        return theme.colors.secondary[800];
    }
  }};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
`;

export const ToastMessage = styled.p<{ $type: ToastType }>`
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success[700];
      case 'error':
        return theme.colors.error[700];
      case 'warning':
        return theme.colors.warning[700];
      case 'info':
        return theme.colors.primary[700];
      default:
        return theme.colors.secondary[700];
    }
  }};
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
`;

export const ToastCloseButton = styled.button<{ $type: ToastType }>`
  align-items: center;
  background: none;
  border: none;
  border-radius: 0.25rem;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success[600];
      case 'error':
        return theme.colors.error[600];
      case 'warning':
        return theme.colors.warning[600];
      case 'info':
        return theme.colors.primary[600];
      default:
        return theme.colors.secondary[600];
    }
  }};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: 0.25rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $type, theme }) => {
      switch ($type) {
        case 'success':
          return theme.colors.success[100];
        case 'error':
          return theme.colors.error[100];
        case 'warning':
          return theme.colors.warning[100];
        case 'info':
          return theme.colors.primary[100];
        default:
          return theme.colors.secondary[100];
      }
    }};
  }
`;
