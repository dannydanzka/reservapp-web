/**
 * TextField Component Interfaces
 *
 * TypeScript interfaces for the TextField component.
 */

import React from 'react';

import type { TextFieldStyledProps } from './TextField.styled';

export interface TextFieldProps
  extends TextFieldStyledProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Helper text to display below the input
   */
  helperText?: string;

  /**
   * Error message to display
   */
  errorText?: string;

  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;

  /**
   * Whether the input is clearable (shows clear button when has value)
   */
  clearable?: boolean;

  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;

  /**
   * Whether to show/hide password toggle for password inputs
   */
  showPasswordToggle?: boolean;

  /**
   * Custom action icon component
   */
  actionIcon?: React.ReactNode;

  /**
   * Callback when action icon is clicked
   */
  onActionClick?: () => void;

  /**
   * Whether the label should float above the input
   */
  floatingLabel?: boolean;

  /**
   * Whether to render as textarea for multiline input
   */
  multiline?: boolean;

  /**
   * Number of rows for textarea (when multiline is true)
   */
  rows?: number;

  /**
   * Maximum number of rows for textarea (when multiline is true)
   */
  maxRows?: number;
}
