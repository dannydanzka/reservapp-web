'use client';

import React, { Component, ReactNode } from 'react';

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
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ error: undefined, hasError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <StyledErrorBoundary>
          <StyledErrorContent>
            <StyledErrorIcon>⚠️</StyledErrorIcon>
            <StyledErrorTitle>Algo salió mal</StyledErrorTitle>
            <StyledErrorMessage>
              Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
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
