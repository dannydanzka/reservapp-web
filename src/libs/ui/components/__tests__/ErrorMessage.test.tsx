import React from 'react';

import { ThemeProvider } from 'styled-components';

import { render, screen } from '@testing-library/react';

import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { theme } from '../../styles/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ErrorMessage Component', () => {
  test('renders error message', () => {
    renderWithTheme(<ErrorMessage error='Something went wrong' />);

    expect(screen.getByText(/ha ocurrido un error/i)).toBeInTheDocument();
  });

  test('translates network errors to Spanish', () => {
    renderWithTheme(<ErrorMessage error='Network error occurred' />);

    expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
  });

  test('shows default message for unknown errors', () => {
    renderWithTheme(<ErrorMessage error='Unknown error type' />);

    expect(screen.getByText(/ha ocurrido un error/i)).toBeInTheDocument();
  });

  test('renders without dismissal (no onDismiss prop)', () => {
    renderWithTheme(<ErrorMessage error='Test error' />);

    const errorText = screen.getByText(/ha ocurrido un error/i);
    expect(errorText).toBeInTheDocument();
  });
});
