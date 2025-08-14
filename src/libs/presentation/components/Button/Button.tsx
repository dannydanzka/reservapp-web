/**
 * Button component based on Jafra's design system.
 * Provides comprehensive button functionality with variants, sizes, and states.
 */

import React, { forwardRef } from 'react';

import type { ButtonProps } from './Button.interfaces';

import { ButtonIcon, LoadingSpinner, StyledButton } from './Button.styled';

/**
 * Button component with support for variants, icons, loading states, and accessibility.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as = undefined,
      children,
      color = 'primary',
      disabled = false,
      download,
      endIcon = undefined,
      fullWidth = false,
      href = undefined,
      loading = false,
      loadingText = undefined,
      rel,
      size = 'medium',
      startIcon = undefined,
      target = undefined,
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

    // Props specific to the rendered element (filter out styled component props)
    const elementProps = {
      ...rest,
      ...(component === 'button' && { type }),
      ...(component === 'a' && { download, href, rel, target }),
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
