/**
 * TextField component based on Jafra's design system.
 * Provides comprehensive text input functionality with labels, icons, and validation.
 */

import React, { forwardRef, useCallback, useState } from 'react';

import {
  ActionIcon,
  HelperText,
  InputIcon,
  Label,
  StyledInput,
  StyledTextArea,
  TextFieldContainer,
  TextFieldStyledProps,
  TextFieldWrapper,
} from './TextField.styled';

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

/**
 * TextField component with support for variants, icons, validation, and accessibility.
 */
export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      actionIcon,
      clearable = false,
      disabled = false,
      endIcon,
      error = false,
      errorText,
      floatingLabel = true,
      fullWidth = false,
      helperText,
      label,
      maxRows,
      multiline = false,
      onActionClick,
      onBlur,
      onChange,
      onClear,
      onFocus,
      placeholder,
      rows = 4,
      showPasswordToggle = false,
      size = 'medium',
      startIcon,
      type = 'text',
      value,
      variant = 'outlined',
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasValue = Boolean(value || rest.defaultValue);
    const hasError = error || Boolean(errorText);
    const displayHelperText = errorText || helperText;

    // Determine if we should show action icons
    const shouldShowClearButton = clearable && hasValue && !disabled;
    const shouldShowPasswordToggle = showPasswordToggle && type === 'password' && !disabled;
    const shouldShowActionIcon = actionIcon && !disabled;

    // Calculate effective end icon
    let effectiveEndIcon = endIcon;
    if (shouldShowClearButton || shouldShowPasswordToggle || shouldShowActionIcon) {
      effectiveEndIcon = null; // Action icons take precedence
    }

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocused(true);
        onFocus?.(event as React.FocusEvent<HTMLInputElement>);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocused(false);
        onBlur?.(event as React.FocusEvent<HTMLInputElement>);
      },
      [onBlur]
    );

    const handleClear = useCallback(() => {
      onClear?.();
      if (onChange) {
        const event = {
          currentTarget: { value: '' },
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    }, [onClear, onChange]);

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const inputType =
      showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const inputProps = {
      ...rest,
      'aria-describedby': displayHelperText ? `${rest.id}-helper-text` : undefined,
      'aria-invalid': hasError,
      disabled,
      onBlur: handleBlur,
      onChange,
      onFocus: handleFocus,
      placeholder: floatingLabel && label ? undefined : placeholder,
      type: inputType,
      value,
    };

    return (
      <TextFieldContainer fullWidth={fullWidth}>
        <TextFieldWrapper
          disabled={disabled}
          error={hasError}
          focused={focused}
          hasEndIcon={Boolean(effectiveEndIcon)}
          hasStartIcon={Boolean(startIcon)}
          multiline={multiline}
          size={size}
          variant={variant}
        >
          {startIcon && <InputIcon position='start'>{startIcon}</InputIcon>}

          {floatingLabel && label && (
            <Label error={hasError} floating focused={focused} hasValue={hasValue} size={size}>
              {label}
            </Label>
          )}

          {multiline ? (
            <StyledTextArea
              hasEndIcon={Boolean(effectiveEndIcon)}
              hasStartIcon={Boolean(startIcon)}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              style={{ maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined }}
              {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <StyledInput
              hasEndIcon={Boolean(effectiveEndIcon)}
              hasStartIcon={Boolean(startIcon)}
              ref={ref as React.Ref<HTMLInputElement>}
              {...inputProps}
            />
          )}

          {effectiveEndIcon && <InputIcon position='end'>{effectiveEndIcon}</InputIcon>}

          {shouldShowClearButton && (
            <ActionIcon aria-label='Clear input' position='end' type='button' onClick={handleClear}>
              ✕
            </ActionIcon>
          )}

          {shouldShowPasswordToggle && (
            <ActionIcon
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              position='end'
              type='button'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '🙈' : '👁️'}
            </ActionIcon>
          )}

          {shouldShowActionIcon && (
            <ActionIcon aria-label='Action' position='end' type='button' onClick={onActionClick}>
              {actionIcon}
            </ActionIcon>
          )}
        </TextFieldWrapper>

        {displayHelperText && (
          <HelperText error={hasError} id={rest.id ? `${rest.id}-helper-text` : undefined}>
            {displayHelperText}
          </HelperText>
        )}
      </TextFieldContainer>
    );
  }
);

TextField.displayName = 'TextField';
