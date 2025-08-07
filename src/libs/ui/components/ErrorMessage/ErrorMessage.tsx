'use client';

import React from 'react';

import { StyledErrorContent, StyledErrorIcon, StyledErrorMessage } from './ErrorMessage.styled';

interface ErrorMessageProps {
  error: string | Error | null;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'inline' | 'toast';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className,
  error,
  showIcon = true,
  variant = 'default',
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  // Convert technical errors to user-friendly messages
  const getUserFriendlyMessage = (message: string): string => {
    const lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes('network')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }

    if (lowercaseMessage.includes('timeout')) {
      return 'La operación tardó demasiado. Intenta nuevamente.';
    }

    if (lowercaseMessage.includes('unauthorized') || lowercaseMessage.includes('401')) {
      return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    }

    if (lowercaseMessage.includes('forbidden') || lowercaseMessage.includes('403')) {
      return 'No tienes permisos para realizar esta acción.';
    }

    if (lowercaseMessage.includes('not found') || lowercaseMessage.includes('404')) {
      return 'El recurso solicitado no fue encontrado.';
    }

    if (lowercaseMessage.includes('server error') || lowercaseMessage.includes('500')) {
      return 'Error del servidor. Intenta nuevamente en unos minutos.';
    }

    if (lowercaseMessage.includes('validation') || lowercaseMessage.includes('invalid')) {
      return 'Los datos ingresados no son válidos. Verifica la información.';
    }

    if (lowercaseMessage.includes('email')) {
      return 'Error con el email. Verifica que sea válido.';
    }

    if (lowercaseMessage.includes('payment') || lowercaseMessage.includes('stripe')) {
      return 'Error en el pago. Verifica tu información de pago.';
    }

    if (lowercaseMessage.includes('reservation')) {
      return 'Error con la reserva. Intenta nuevamente.';
    }

    // If no match, return a generic user-friendly message
    return 'Ha ocurrido un error. Por favor, intenta nuevamente.';
  };

  const displayMessage = getUserFriendlyMessage(errorMessage);

  return (
    <StyledErrorMessage className={className} variant={variant}>
      {showIcon && <StyledErrorIcon>⚠️</StyledErrorIcon>}
      <StyledErrorContent variant={variant}>
        {displayMessage}
        {process.env.NODE_ENV === 'development' && (
          <details style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
            <summary>Error técnico (desarrollo)</summary>
            <pre style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{errorMessage}</pre>
          </details>
        )}
      </StyledErrorContent>
    </StyledErrorMessage>
  );
};

export { ErrorMessage };
