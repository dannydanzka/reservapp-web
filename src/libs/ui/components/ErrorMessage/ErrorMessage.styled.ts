import styled from 'styled-components';

interface StyledProps {
  variant?: 'default' | 'inline' | 'toast';
}

export const StyledErrorMessage = styled.div<StyledProps>`
  align-items: flex-start;
  background-color: ${({ variant }) => {
    switch (variant) {
      case 'inline':
        return '#fef2f2';
      case 'toast':
        return '#ffffff';
      default:
        return '#fef2f2';
    }
  }};
  border: 1px solid #fecaca;
  border-radius: ${({ variant }) => {
    switch (variant) {
      case 'inline':
        return '0.375rem';
      case 'toast':
        return '0.5rem';
      default:
        return '0.5rem';
    }
  }};
  color: #dc2626;
  display: flex;
  font-size: ${({ variant }) => {
    switch (variant) {
      case 'inline':
        return '0.875rem';
      case 'toast':
        return '0.875rem';
      default:
        return '1rem';
    }
  }};
  gap: 0.75rem;
  padding: ${({ variant }) => {
    switch (variant) {
      case 'inline':
        return '0.5rem 0.75rem';
      case 'toast':
        return '0.75rem 1rem';
      default:
        return '1rem';
    }
  }};
  ${({ variant }) =>
    variant === 'toast' &&
    `
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: #e5e7eb;
  `}
`;

export const StyledErrorIcon = styled.span`
  flex-shrink: 0;
  font-size: 1.2em;
  margin-top: 0.1em;
`;

export const StyledErrorContent = styled.div<StyledProps>`
  flex: 1;
  line-height: 1.5;

  ${({ variant }) =>
    variant === 'inline' &&
    `
    line-height: 1.4;
  `}
`;
