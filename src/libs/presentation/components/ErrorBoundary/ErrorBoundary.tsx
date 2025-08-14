'use client';

import React, { Component, ReactNode } from 'react';

import { AppError, ErrorHandler } from '@libs/shared/utils/errorHandler';

import { Button } from '../Button';

import {
  StyledErrorActions,
  StyledErrorBoundary,
  StyledErrorContent,
  StyledErrorIcon,
  StyledErrorMessage,
  StyledErrorTitle,
} from './ErrorBoundary.styled';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  appError?: AppError;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Parse the error using our error handler
    const appError = ErrorHandler.parseError(error);
    return { appError, error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with context
    const appError = ErrorHandler.parseError(error);
    ErrorHandler.logError(appError, 'ErrorBoundary');

    // Handle authentication errors
    if (appError.isAuthError) {
      ErrorHandler.handleAuthError(appError);
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ appError: undefined, error: undefined, hasError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { appError } = this.state;

      // Special handling for auth errors
      if (appError?.isAuthError) {
        return (
          <StyledErrorBoundary>
            <StyledErrorContent>
              <StyledErrorIcon>🔒</StyledErrorIcon>
              <StyledErrorTitle>Sesión Expirada</StyledErrorTitle>
              <StyledErrorMessage>{appError.message}</StyledErrorMessage>
              <StyledErrorActions>
                <Button variant='contained' onClick={() => (window.location.href = '/auth/login')}>
                  Iniciar Sesión
                </Button>
                <Button variant='outlined' onClick={() => (window.location.href = '/')}>
                  Ir al Inicio
                </Button>
              </StyledErrorActions>
            </StyledErrorContent>
          </StyledErrorBoundary>
        );
      }

      return (
        <StyledErrorBoundary>
          <StyledErrorContent>
            <StyledErrorIcon>⚠️</StyledErrorIcon>
            <StyledErrorTitle>Algo salió mal</StyledErrorTitle>
            <StyledErrorMessage>
              {appError?.message ||
                'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'}
            </StyledErrorMessage>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
                <summary>Detalles del error (desarrollo)</summary>
                <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <StyledErrorActions>
              <Button variant='outlined' onClick={this.handleRetry}>
                Intentar nuevamente
              </Button>
              <Button variant='contained' onClick={this.handleReload}>
                Recargar página
              </Button>
            </StyledErrorActions>
          </StyledErrorContent>
        </StyledErrorBoundary>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
