/**
 * Error Boundary HOC based on Jafra's stable patterns.
 * Provides error handling protection for components.
 */

import React, { Component, ComponentType, ErrorInfo, ReactNode } from 'react';

import styled from 'styled-components';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; errorInfo: ErrorInfo; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

const DefaultErrorFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.error[700]};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const RetryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.error[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error[700]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.error[500]};
    outline-offset: 2px;
  }
`;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      error,
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      error: null,
      errorInfo: null,
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      const { fallback: CustomFallback } = this.props;

      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            retry={this.handleRetry}
          />
        );
      }

      return (
        <DefaultErrorFallback>
          <ErrorTitle>¡Oops! Algo salió mal</ErrorTitle>
          <ErrorMessage>
            Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>Intentar de nuevo</RetryButton>
        </DefaultErrorFallback>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-Order Component that wraps a component with error boundary protection.
 * @param WrappedComponent - The component to wrap
 * @param options - Configuration options for the error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: {
    fallback?: ComponentType<{ error: Error; errorInfo: ErrorInfo; retry: () => void }>;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }
) {
  const WithErrorBoundaryComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary fallback={options?.fallback} onError={options?.onError}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

  // Set display name for debugging
  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundaryComponent;
}

export default withErrorBoundary;
