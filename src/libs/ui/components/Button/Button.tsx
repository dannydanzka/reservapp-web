/**
 * Button component based on Jafra's design system.
 * Provides comprehensive button functionality with variants, sizes, and states.
 */

import React, { forwardRef } from 'react';

import { ButtonIcon, ButtonStyledProps, LoadingSpinner, StyledButton } from './Button.styled';

export interface ButtonProps
  extends ButtonStyledProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /**
   * Button content
   */
  children?: React.ReactNode;

  /**
   * Icon to display at the start of the button
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display at the end of the button
   */
  endIcon?: React.ReactNode;

  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean;

  /**
   * Loading text to show when loading
   */
  loadingText?: string;

  /**
   * Optional component to render as (for links, etc.)
   */
  as?: React.ElementType;

  /**
   * Optional href for link buttons
   */
  href?: string;

  /**
   * Optional target for link buttons
   */
  target?: string;
}

/**
 * Button component with support for variants, icons, loading states, and accessibility.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as,
      children,
      color = 'primary',
      disabled = false,
      endIcon,
      fullWidth = false,
      href,
      loading = false,
      loadingText,
      size = 'medium',
      startIcon,
      target,
      type = 'button',
      variant = 'contained',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const displayText = loading && loadingText ? loadingText : children;

    // If href is provided and no 'as' prop, default to 'a'
    const component = as || (href ? 'a' : 'button');

    // Props specific to the rendered element
    const elementProps = {
      ...rest,
      ...(component === 'button' && { type }),
      ...(component === 'a' && { href, target }),
    };

    return (
      <StyledButton
        aria-disabled={isDisabled}
        as={component}
        color={color}
        disabled={isDisabled}
        fullWidth={fullWidth}
        loading={loading}
        ref={ref}
        size={size}
        variant={variant}
        {...elementProps}
      >
        {loading && <LoadingSpinner />}

        {!loading && startIcon && <ButtonIcon position='start'>{startIcon}</ButtonIcon>}

        {displayText}

        {!loading && endIcon && <ButtonIcon position='end'>{endIcon}</ButtonIcon>}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
