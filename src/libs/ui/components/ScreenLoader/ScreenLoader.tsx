/**
 * Screen loader component based on Jafra's loading patterns.
 * Provides consistent loading UI across the application.
 */

import React from 'react';

import styled, { keyframes } from 'styled-components';

interface ScreenLoaderProps {
  /**
   * Size of the loader
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Whether to show the loader fullscreen
   * @default false
   */
  fullscreen?: boolean;

  /**
   * Custom color for the loader
   */
  color?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const LoaderContainer = styled.div<{ $fullscreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme?.spacing?.[4] || '1rem'};

  ${({ $fullscreen, theme }) =>
    $fullscreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    z-index: ${theme?.zIndex?.modal || 1040};
  `}
`;

const Spinner = styled.div<{ size: 'small' | 'medium' | 'large'; color?: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '24px';
      case 'large':
        return '56px';
      default:
        return '40px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '24px';
      case 'large':
        return '56px';
      default:
        return '40px';
    }
  }};
  border: ${({ color, size, theme }) => {
    const width = size === 'small' ? '2px' : size === 'large' ? '4px' : '3px';
    const spinnerColor = color || theme?.colors?.primary?.[600] || '#3b82f6';
    return `${width} solid ${theme?.colors?.secondary?.[200] || '#e2e8f0'}`;
  }};
  border-top: ${({ color, size, theme }) => {
    const width = size === 'small' ? '2px' : size === 'large' ? '4px' : '3px';
    const spinnerColor = color || theme?.colors?.primary?.[600] || '#3b82f6';
    return `${width} solid ${spinnerColor}`;
  }};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingMessage = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  color: ${({ theme }) => theme?.colors?.secondary?.[600] || '#475569'};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return theme?.typography?.fontSize?.xs || '0.75rem';
      case 'large':
        return theme?.typography?.fontSize?.base || '1rem';
      default:
        return theme?.typography?.fontSize?.sm || '0.875rem';
    }
  }};
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.medium || 500};
  text-align: center;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.[1] || '0.25rem'};
  margin-top: ${({ theme }) => theme?.spacing?.[2] || '0.5rem'};
`;

const Dot = styled.div<{ delay: number; color?: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ color, theme }) => color || theme?.colors?.primary?.[600] || '#3b82f6'};
  animation: ${pulse} 1.4s ease-in-out ${({ delay }) => delay}s infinite;
`;

/**
 * Screen loader component with customizable appearance and behavior.
 */
export const ScreenLoader: React.FC<ScreenLoaderProps> = ({
  color,
  fullscreen = false,
  message,
  size = 'medium',
}) => {
  return (
    <LoaderContainer $fullscreen={fullscreen}>
      <Spinner color={color} size={size} />
      {message && (
        <div>
          <LoadingMessage size={size}>{message}</LoadingMessage>
          <DotsContainer>
            <Dot color={color} delay={0} />
            <Dot color={color} delay={0.2} />
            <Dot color={color} delay={0.4} />
          </DotsContainer>
        </div>
      )}
    </LoaderContainer>
  );
};
