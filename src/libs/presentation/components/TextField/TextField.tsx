/**
 * TextField component based on Jafra's design system.
 * Provides comprehensive text input functionality with labels, icons, and validation.
 */

import React, { forwardRef, useCallback, useState } from 'react';

import type { TextFieldProps } from './TextField.interfaces';

import {
  ActionIcon,
  HelperText,
  InputIcon,
  Label,
  StyledInput,
  StyledTextArea,
  TextFieldContainer,
  TextFieldWrapper,
} from './TextField.styled';

/**
 * TextField component with support for variants, icons, validation, and accessibility.
 */
export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      actionIcon = undefined,
      clearable = false,
      disabled = false,
      endIcon = undefined,
      error = false,
      errorText = undefined,
      floatingLabel = true,
      fullWidth = false,
      helperText = undefined,
      label = undefined,
      maxRows = undefined,
      multiline = false,
      onActionClick = undefined,
      onBlur = undefined,
      onChange = undefined,
      onClear = undefined,
      onFocus = undefined,
      placeholder = undefined,
      rows = 4,
      showPasswordToggle = false,
      size = 'medium',
      startIcon = undefined,
      type = 'text',
      value = undefined,
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

    const baseProps = {
      ...rest,
      'aria-describedby': displayHelperText ? `${rest.id}-helper-text` : undefined,
      'aria-invalid': hasError,
      disabled,
      onBlur: handleBlur,
      onFocus: handleFocus,
      placeholder: floatingLabel && label ? undefined : placeholder,
      value,
    };

    const inputProps = {
      ...baseProps,
      onChange,
      type: inputType,
    };

    const textareaProps = {
      'aria-describedby': baseProps['aria-describedby'],
      'aria-invalid': baseProps['aria-invalid'],
      autoComplete: baseProps.autoComplete,
      autoFocus: baseProps.autoFocus,
      disabled: baseProps.disabled,
      id: baseProps.id,
      maxLength: baseProps.maxLength,
      minLength: baseProps.minLength,
      name: baseProps.name,
      onBlur: baseProps.onBlur as React.FocusEventHandler<HTMLTextAreaElement>,
      onChange: onChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>,
      onFocus: baseProps.onFocus as React.FocusEventHandler<HTMLTextAreaElement>,
      placeholder: baseProps.placeholder,
      readOnly: baseProps.readOnly,
      required: baseProps.required,
      tabIndex: baseProps.tabIndex,
      value: baseProps.value,
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
          {startIcon && <InputIcon $position='start'>{startIcon}</InputIcon>}

          {floatingLabel && label && (
            <Label error={hasError} floating focused={focused} hasValue={hasValue} size={size}>
              {label}
            </Label>
          )}

          {multiline ? (
            <StyledTextArea
              $hasEndIcon={Boolean(effectiveEndIcon)}
              $hasStartIcon={Boolean(startIcon)}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              style={{ maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined }}
              {...textareaProps}
            />
          ) : (
            <StyledInput
              $hasEndIcon={Boolean(effectiveEndIcon)}
              $hasStartIcon={Boolean(startIcon)}
              ref={ref as React.Ref<HTMLInputElement>}
              {...inputProps}
            />
          )}

          {effectiveEndIcon && <InputIcon $position='end'>{effectiveEndIcon}</InputIcon>}

          {shouldShowClearButton && (
            <ActionIcon
              $position='end'
              aria-label='Clear input'
              type='button'
              onClick={handleClear}
            >
              ✕
            </ActionIcon>
          )}

          {shouldShowPasswordToggle && (
            <ActionIcon
              $position='end'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              type='button'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '🙈' : '👁️'}
            </ActionIcon>
          )}

          {shouldShowActionIcon && (
            <ActionIcon $position='end' aria-label='Action' type='button' onClick={onActionClick}>
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
