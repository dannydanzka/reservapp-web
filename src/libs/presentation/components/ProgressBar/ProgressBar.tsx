'use client';

import React from 'react';

import { Check } from 'lucide-react';

import { ProgressBarProps, StepProps } from './ProgressBar.types';

import {
  ConnectionLine,
  LinearProgressBar,
  LinearProgressContainer,
  ProgressContainer,
  ProgressInfo,
  ProgressPercentage,
  ProgressText,
  StepCircle,
  StepLabel,
  StepsContainer,
  StepWrapper,
} from './ProgressBar.styled';

const Step: React.FC<StepProps> = ({
  color = 'primary',
  currentStep = 1,
  index = 0,
  label = '',
  showLabels = true,
  size = 'medium',
  totalSteps = 1,
}) => {
  const stepNumber = index + 1;
  const isActive = stepNumber === currentStep;
  const isCompleted = stepNumber < currentStep;

  return (
    <StepWrapper>
      <StepCircle
        $animated
        $color={color}
        $isActive={isActive}
        $isCompleted={isCompleted}
        $size={size}
      >
        {isCompleted ? (
          <Check size={size === 'small' ? 12 : size === 'large' ? 18 : 14} />
        ) : (
          stepNumber
        )}
      </StepCircle>

      {showLabels && label && (
        <StepLabel $color={color} $isActive={isActive} $isCompleted={isCompleted} $size={size}>
          {label}
        </StepLabel>
      )}

      {/* Connection line to next step */}
      {index < totalSteps - 1 && (
        <ConnectionLine $animated $color={color} $isCompleted={isCompleted} $size={size} />
      )}
    </StepWrapper>
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  animated = true,
  className = undefined,
  color = 'primary',
  currentStep = 1,
  showLabels = true,
  size = 'medium',
  steps = [],
  totalSteps = 1,
  variant = 'linear',
}) => {
  // Ensure currentStep is within valid range
  const validCurrentStep = Math.max(1, Math.min(currentStep, totalSteps));
  const progressPercentage = ((validCurrentStep - 1) / (totalSteps - 1)) * 100;

  if (variant === 'circular') {
    return (
      <ProgressContainer className={className}>
        <StepsContainer>
          {Array.from({ length: totalSteps }, (_, index) => (
            <Step
              color={color}
              currentStep={validCurrentStep}
              index={index}
              key={index}
              label={steps[index]}
              showLabels={showLabels}
              size={size}
              totalSteps={totalSteps}
            />
          ))}
        </StepsContainer>
      </ProgressContainer>
    );
  }

  return (
    <ProgressContainer className={className}>
      <ProgressInfo>
        <ProgressText $size={size}>
          Paso {validCurrentStep} de {totalSteps}
          {steps[validCurrentStep - 1] && `: ${steps[validCurrentStep - 1]}`}
        </ProgressText>
        <ProgressPercentage $color={color} $size={size}>
          {Math.round(progressPercentage)}%
        </ProgressPercentage>
      </ProgressInfo>

      <LinearProgressContainer $size={size}>
        <LinearProgressBar $animated={animated} $color={color} $progress={progressPercentage} />
      </LinearProgressContainer>

      {showLabels && steps.length > 0 && (
        <StepsContainer style={{ marginTop: '1rem' }}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === validCurrentStep;
            const isCompleted = stepNumber < validCurrentStep;

            return (
              <StepLabel
                $color={color}
                $isActive={isActive}
                $isCompleted={isCompleted}
                $size={size}
                key={index}
                style={{ flex: 1 }}
              >
                {step}
              </StepLabel>
            );
          })}
        </StepsContainer>
      )}
    </ProgressContainer>
  );
};
