/**
 * Button Component Interfaces
 *
 * TypeScript interfaces for the Button component.
 */

import React from 'react';

import type { ButtonStyledProps } from './Button.styled';

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

  /**
   * Optional rel for link buttons
   */
  rel?: string;

  /**
   * Optional download for link buttons
   */
  download?: string | boolean;

  /**
   * Full width button
   */
  fullWidth?: boolean;
}
