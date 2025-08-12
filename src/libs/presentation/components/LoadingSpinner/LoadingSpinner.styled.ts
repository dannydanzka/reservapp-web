import { keyframes, styled } from 'styled-components';

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div<{ $size: string; $color: string }>`
  animation: ${spin} 1s linear infinite;
  border: 2px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: 50%;
  border-top: 2px solid ${({ $color }) => $color};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '16px';
      case 'large':
        return '48px';
      default:
        return '24px';
    }
  }};
  width: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '16px';
      case 'large':
        return '48px';
      default:
        return '24px';
    }
  }};
`;

export const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
`;
