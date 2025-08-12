#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const HOOK_TEMPLATES = {
  basicHook: (name) => `import { useState, useEffect, useCallback } from 'react';

export interface Use${name}Options {
  // Add configuration options here
  initialValue?: any;
  disabled?: boolean;
}

export interface Use${name}Result {
  // Add return values here
  value: any;
  loading: boolean;
  error: string | null;
  // Add methods
  update: (newValue: any) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

export function use${name}(options: Use${name}Options = {}): Use${name}Result {
  const { initialValue, disabled = false } = options;

  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback((newValue: any) => {
    if (disabled) return;

    setValue(newValue);
    setError(null);
  }, [disabled]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const refresh = useCallback(async () => {
    if (disabled) return;

    setLoading(true);
    setError(null);

    try {
      // Add refresh logic here
      console.log('Refreshing ${name.toLowerCase()}...');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [disabled]);

  useEffect(() => {
    // Add initialization logic here
    if (!disabled) {
      refresh();
    }
  }, [disabled, refresh]);

  return {
    value,
    loading,
    error,
    update,
    reset,
    refresh,
  };
}
`,

  apiHook: (name) => `import { useState, useEffect, useCallback } from 'react';
import { use${name}Service } from '@/libs/services';

export interface Use${name}ApiOptions {
  autoFetch?: boolean;
  dependencies?: any[];
}

export interface Use${name}ApiResult<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (updater: (current: T | null) => T | null) => void;
}

export function use${name}Api<T = any>(
  fetcher: () => Promise<T>,
  options: Use${name}ApiOptions = {}
): Use${name}ApiResult<T> {
  const { autoFetch = true, dependencies = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'API request failed';
      setError(message);
      console.error('${name} API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  const mutate = useCallback((updater: (current: T | null) => T | null) => {
    setData(current => updater(current));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
  };
}
`,

  formHook: (name) => `import { useState, useCallback } from 'react';

export interface Use${name}FormData {
  // Add form fields here
  [key: string]: any;
}

export interface Use${name}FormOptions {
  initialValues?: Partial<Use${name}FormData>;
  onSubmit?: (data: Use${name}FormData) => Promise<void> | void;
  validate?: (data: Use${name}FormData) => FormErrors;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Use${name}FormResult {
  values: Use${name}FormData;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  // Methods
  setValue: (field: string, value: any) => void;
  setValues: (values: Partial<Use${name}FormData>) => void;
  setError: (field: string, error: string) => void;
  setTouched: (field: string, touched?: boolean) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  getFieldProps: (field: string) => FieldProps;
}

export interface FieldProps {
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error: string | undefined;
  touched: boolean;
}

export function use${name}Form(options: Use${name}FormOptions = {}): Use${name}FormResult {
  const { initialValues = {}, onSubmit, validate } = options;

  const [values, setValuesState] = useState<Use${name}FormData>(initialValues as Use${name}FormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: string, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    // Clear error when value changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const setValues = useCallback((newValues: Partial<Use${name}FormData>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setTouched = useCallback((field: string, isTouched = true) => {
    setTouchedState(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return {};
    return validate(values);
  }, [validate, values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allFields = Object.keys(values);
    const touchedFields = allFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouchedState(touchedFields);

    // Validate
    const formErrors = validateForm();
    setErrors(formErrors);

    // Check if form is valid
    const isValid = Object.keys(formErrors).length === 0;
    if (!isValid || !onSubmit) return;

    // Submit
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  const reset = useCallback(() => {
    setValuesState(initialValues as Use${name}FormData);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  const getFieldProps = useCallback((field: string): FieldProps => ({
    name: field,
    value: values[field] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, e.target.value);
    },
    onBlur: () => {
      setTouched(field, true);
    },
    error: errors[field],
    touched: touched[field] || false,
  }), [values, errors, touched, setValue, setTouched]);

  const currentErrors = validateForm();
  const isValid = Object.keys(currentErrors).length === 0;

  return {
    values,
    errors: currentErrors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setValues,
    setError,
    setTouched,
    handleSubmit,
    reset,
    getFieldProps,
  };
}
`,

  stateHook: (name) => `import { useState, useCallback, useReducer } from 'react';

export interface ${name}State {
  // Add state properties here
  isOpen: boolean;
  data: any;
  loading: boolean;
  error: string | null;
}

export type ${name}Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: any }
  | { type: 'TOGGLE_OPEN' }
  | { type: 'RESET' };

const initial${name}State: ${name}State = {
  isOpen: false,
  data: null,
  loading: false,
  error: null,
};

function ${name.toLowerCase()}Reducer(state: ${name}State, action: ${name}Action): ${name}State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false, error: null };

    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen };

    case 'RESET':
      return initial${name}State;

    default:
      return state;
  }
}

export interface Use${name}StateResult {
  state: ${name}State;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setData: (data: any) => void;
    toggleOpen: () => void;
    reset: () => void;
  };
}

export function use${name}State(initialState?: Partial<${name}State>): Use${name}StateResult {
  const [state, dispatch] = useReducer(
    ${name.toLowerCase()}Reducer,
    { ...initial${name}State, ...initialState }
  );

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setData = useCallback((data: any) => {
    dispatch({ type: 'SET_DATA', payload: data });
  }, []);

  const toggleOpen = useCallback(() => {
    dispatch({ type: 'TOGGLE_OPEN' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    actions: {
      setLoading,
      setError,
      setData,
      toggleOpen,
      reset,
    },
  };
}
`,

  test: (name) => `import { renderHook, act } from '@testing-library/react';
import { use${name} } from './use${name}';

describe('use${name}', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => use${name}());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    // Add more assertions based on your hook's interface
  });

  it('should handle updates correctly', async () => {
    const { result } = renderHook(() => use${name}());

    await act(async () => {
      result.current.update('new value');
    });

    expect(result.current.value).toBe('new value');
  });

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => use${name}());

    // Mock an error scenario
    await act(async () => {
      // Trigger error condition
    });

    expect(result.current.error).toBeTruthy();
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() => use${name}({ initialValue: 'initial' }));

    act(() => {
      result.current.update('changed');
    });

    expect(result.current.value).toBe('changed');

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe('initial');
  });

  // Add more specific tests
});
`
};

const HOOK_TYPES = {
  basic: 'basicHook',
  api: 'apiHook',
  form: 'formHook',
  state: 'stateHook'
};

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  createDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(\`  ✅ Created: \${path.relative(process.cwd(), filePath)}\`);
}

function generateHook(hookName, type = 'basic', options = {}) {
  const name = hookName.charAt(0).toUpperCase() + hookName.slice(1);
  const {
    withTest = true,
    directory = 'src/libs/presentation/hooks'
  } = options;

  console.log(\`🪝 Generating \${type} hook: use\${name}\`);
  console.log(\`📁 Location: \${directory}\`);
  console.log('');

  const hookPath = path.join(process.cwd(), directory);
  const templateName = HOOK_TYPES[type] || 'basicHook';

  // Core hook file
  writeFile(
    path.join(hookPath, \`use\${name}.ts\`),
    HOOK_TEMPLATES[templateName](name)
  );

  // Test file
  if (withTest) {
    writeFile(
      path.join(hookPath, '__tests__', \`use\${name}.test.ts\`),
      HOOK_TEMPLATES.test(name)
    );
  }

  console.log('');
  console.log(\`✅ Hook use\${name} generated successfully!\`);

  // Update hooks index file
  updateHooksIndex(name, directory);
}

function updateHooksIndex(hookName, directory) {
  const indexPath = path.join(process.cwd(), directory, 'index.ts');
  const exportStatement = \`export * from './use\${hookName}';\n\`;

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    if (!content.includes(exportStatement.trim())) {
      fs.appendFileSync(indexPath, exportStatement);
      console.log(\`  ✅ Updated: \${path.relative(process.cwd(), indexPath)}\`);
    }
  } else {
    writeFile(indexPath, exportStatement);
  }
}

function showHelp() {
  console.log('Usage: npm run generate:hook <hook-name> [type] [options]');
  console.log('');
  console.log('Types:');
  console.log('  basic    Basic hook with state and methods (default)');
  console.log('  api      Hook for API calls and data fetching');
  console.log('  form     Hook for form state management');
  console.log('  state    Hook with reducer pattern for complex state');
  console.log('');
  console.log('Options:');
  console.log('  --no-test      Skip generating test file');
  console.log('  --dir <path>   Custom directory (default: src/libs/presentation/hooks)');
  console.log('');
  console.log('Examples:');
  console.log('  npm run generate:hook Counter');
  console.log('  npm run generate:hook UserData api');
  console.log('  npm run generate:hook LoginForm form');
  console.log('  npm run generate:hook Dialog state --dir src/modules/mod-venues/presentation/hooks');
}

// CLI handling
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const hookName = args[0];
const type = args[1] && Object.keys(HOOK_TYPES).includes(args[1]) ? args[1] : 'basic';
const options = {
  withTest: !args.includes('--no-test'),
  directory: args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'src/libs/presentation/hooks'
};

generateHook(hookName, type, options);
