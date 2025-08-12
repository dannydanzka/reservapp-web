import styled from 'styled-components';

interface StyledProps {
  variant?: 'danger' | 'warning' | 'info';
}

export const StyledOverlay = styled.div`
  align-items: center;
  background-color: rgb(0 0 0 / 0.5);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 1000;
`;

export const StyledDialog = styled.div<StyledProps>`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  max-height: 90vh;
  max-width: 400px;
  overflow: hidden;
  width: 100%;

  ${({ variant }) =>
    variant === 'danger' &&
    `
    border-top: 4px solid #dc2626;
  `}

  ${({ variant }) =>
    variant === 'warning' &&
    `
    border-top: 4px solid #f59e0b;
  `}
  
  ${({ variant }) =>
    variant === 'info' &&
    `
    border-top: 4px solid #3b82f6;
  `}
`;

export const StyledHeader = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1rem;
`;

export const StyledIcon = styled.div<StyledProps>`
  flex-shrink: 0;
  font-size: 1.5rem;
  margin-top: 0.25rem;
`;

export const StyledTitle = styled.h3<StyledProps>`
  color: ${({ variant }) => {
    switch (variant) {
      case 'danger':
        return '#dc2626';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#1f2937';
    }
  }};
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
`;

export const StyledContent = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

export const StyledMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
`;

export const StyledActions = styled.div`
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.5rem;

  button {
    min-width: 80px;
  }
`;
