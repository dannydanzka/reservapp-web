import styled, { keyframes } from 'styled-components';

const progressAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const StepsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
`;

export const StepWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

export const StepCircle = styled.div<{
  $isActive: boolean;
  $isCompleted: boolean;
  $size?: 'small' | 'medium' | 'large';
  $color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  $animated?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return `
          width: 1.5rem;
          height: 1.5rem;
          font-size: 0.75rem;
        `;
      case 'large':
        return `
          width: 3rem;
          height: 3rem;
          font-size: 1.125rem;
        `;
      default:
        return `
          width: 2rem;
          height: 2rem;
          font-size: 0.875rem;
        `;
    }
  }}
  background-color: ${({ $color = 'primary', $isActive, $isCompleted, theme }) => {
    if ($isCompleted) return theme.colors[$color][600];
    if ($isActive) return theme.colors[$color][500];
    return theme.colors.secondary[300];
  }};
  color: ${({ $isActive, $isCompleted, theme }) =>
    $isActive || $isCompleted ? theme.colors.white : theme.colors.secondary[600]};
  border: 2px solid
    ${({ $color = 'primary', $isActive, $isCompleted, theme }) => {
      if ($isCompleted) return theme.colors[$color][600];
      if ($isActive) return theme.colors[$color][500];
      return theme.colors.secondary[300];
    }};
  font-weight: 600;
  transition: all 0.3s ease;

  ${({ $animated, $isActive }) =>
    $animated && $isActive && `animation: ${pulseAnimation} 1.5s infinite;`}
`;

export const StepLabel = styled.span<{
  $isActive: boolean;
  $isCompleted: boolean;
  $size?: 'small' | 'medium' | 'large';
  $color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}>`
  color: ${({ $color = 'primary', $isActive, $isCompleted, theme }) => {
    if ($isCompleted) return theme.colors[$color][700];
    if ($isActive) return theme.colors[$color][600];
    return theme.colors.secondary[600];
  }};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '0.75rem';
      case 'large':
        return '1rem';
      default:
        return '0.875rem';
    }
  }};
  font-weight: ${({ $isActive, $isCompleted }) => ($isActive || $isCompleted ? '600' : '400')};
  text-align: center;
  transition: all 0.3s ease;
`;

export const ConnectionLine = styled.div<{
  $isCompleted: boolean;
  $size?: 'small' | 'medium' | 'large';
  $color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  $animated?: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  right: -50%;
  transform: translateY(-50%);
  z-index: 1;
  height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '2px';
      case 'large':
        return '4px';
      default:
        return '3px';
    }
  }};
  background-color: ${({ $color = 'primary', $isCompleted, theme }) =>
    $isCompleted ? theme.colors[$color][500] : theme.colors.secondary[300]};
  transition: all 0.5s ease;

  ${({ $animated, $isCompleted }) =>
    $animated && $isCompleted && `animation: ${progressAnimation} 0.5s ease;`}
`;

// Linear Progress Bar
export const LinearProgressContainer = styled.div<{
  $size?: 'small' | 'medium' | 'large';
}>`
  background-color: ${({ theme }) => theme.colors.secondary[200]};
  border-radius: 9999px;
  height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '0.5rem';
      case 'large':
        return '1rem';
      default:
        return '0.75rem';
    }
  }};
  overflow: hidden;
  width: 100%;
`;

export const LinearProgressBar = styled.div<{
  $progress: number;
  $color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  $animated?: boolean;
}>`
  height: 100%;
  background-color: ${({ $color = 'primary', theme }) => theme.colors[$color][500]};
  border-radius: inherit;
  transition: width 0.5s ease;
  width: ${({ $progress }) => Math.min(Math.max($progress, 0), 100)}%;

  ${({ $animated }) => $animated && `animation: ${progressAnimation} 0.5s ease;`}
`;

export const ProgressInfo = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const ProgressText = styled.span<{
  $size?: 'small' | 'medium' | 'large';
}>`
  color: ${({ theme }) => theme.colors.secondary[800]};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '0.75rem';
      case 'large':
        return '1rem';
      default:
        return '0.875rem';
    }
  }};
  font-weight: 600;
`;

export const ProgressPercentage = styled.span<{
  $size?: 'small' | 'medium' | 'large';
  $color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}>`
  color: ${({ $color = 'primary', theme }) => theme.colors[$color][600]};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '0.75rem';
      case 'large':
        return '1rem';
      default:
        return '0.875rem';
    }
  }};
  font-weight: 600;
`;
