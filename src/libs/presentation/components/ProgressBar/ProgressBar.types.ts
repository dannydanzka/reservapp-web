export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  showLabels?: boolean;
  variant?: 'linear' | 'circular';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  animated?: boolean;
}

export interface StepProps {
  index: number;
  currentStep: number;
  totalSteps: number;
  label?: string;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}
