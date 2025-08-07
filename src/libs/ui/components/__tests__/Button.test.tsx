import React from 'react';

import { ThemeProvider } from 'styled-components';

import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from '../Button/Button';
import { theme } from '../../styles/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Button Component', () => {
  test('renders button with text', () => {
    renderWithTheme(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('can be disabled', () => {
    renderWithTheme(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('supports different variants', () => {
    renderWithTheme(
      <Button color='primary' variant='contained'>
        Primary
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
