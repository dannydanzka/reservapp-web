export interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date | string;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  helperText?: string;
  className?: string;
  id?: string;
  name?: string;
}
