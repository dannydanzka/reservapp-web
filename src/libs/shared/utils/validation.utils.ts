/**
 * Validation Utilities
 * Provides request validation functionality for API routes
 */

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enum?: (string | number)[];
  pattern?: RegExp;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export async function validateRequest(
  data: any,
  rules: ValidationRules
): Promise<ValidationResult> {
  const errors: string[] = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip validation if field is not provided and not required
    if (!rule.required && (value === undefined || value === null)) {
      continue;
    }

    // Type validation
    if (rule.type && value !== undefined && value !== null) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;

      if (actualType !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
        continue;
      }
    }

    // String validations
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters long`);
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters long`);
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }

    // Number validations
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
      }

      if (rule.max !== undefined && value > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
      }
    }

    // Enum validation
    if (
      rule.enum &&
      value !== undefined &&
      value !== null &&
      !rule.enum.includes(value as string | number)
    ) {
      errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
    }
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

// Validation helper functions
export function validateEmail(email: string): boolean {
  return ValidationPatterns.email.test(email);
}

export function validatePhone(phone: string): boolean {
  return ValidationPatterns.phone.test(phone);
}

export function validateUUID(uuid: string): boolean {
  return ValidationPatterns.uuid.test(uuid);
}

export function validateURL(url: string): boolean {
  return ValidationPatterns.url.test(url);
}

export function sanitizeString(input: string, maxLength = 1000): string {
  return input.trim().slice(0, maxLength);
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Common validation rule sets
export const CommonValidationRules = {
  email: {
    pattern: ValidationPatterns.email,
    required: true,
    type: 'string' as const,
  },
  name: {
    maxLength: 100,
    minLength: 2,
    required: true,
    type: 'string' as const,
  },
  password: {
    maxLength: 128,
    minLength: 8,
    required: true,
    type: 'string' as const,
  },
  phone: {
    pattern: ValidationPatterns.phone,
    required: false,
    type: 'string' as const,
  },
  uuid: {
    pattern: ValidationPatterns.uuid,
    required: true,
    type: 'string' as const,
  },
} as const;
