import { fileURLToPath } from 'url';
import path from 'path';

import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import restrictedGlobals from 'eslint-restricted-globals';
import sortDestructureKeysPlugin from 'eslint-plugin-sort-destructure-keys';
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import nextPlugin from '@next/eslint-plugin-next';

import js from '@eslint/js';

import { customImportOrderRule } from './scripts/eslint-rules/custom-import-order.js';
import { requireDefaultPropsRule } from './scripts/eslint-rules/require-default-props.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ESLint Configuration with Context-Aware Rule Exceptions
 * 
 * Key Adjustments Made:
 * - Console statements: Allowed in API routes, seed files, and development utilities
 * - TypeScript any: More permissive with ignoreRestArgs for common patterns
 * - Nullish coalescing: Disabled due to excessive false positives
 * - Unused vars: Better pattern matching with underscore prefix support
 * - React jsx-no-bind: More permissive for event handlers
 * - Props spreading: Exceptions for common HTML elements
 * - Nested ternary: Disabled for JSX conditional rendering
 * - Array index keys: Disabled for common list patterns
 * - Plus plus operator: Allowed in for loops
 * - Alerts: Disabled for development and debugging
 * 
 * File-specific overrides:
 * - API routes & Prisma: Console logging allowed
 * - Seed files & scripts: Relaxed rules for data setup
 * - Styled components: Template literal patterns allowed
 * - Hooks: Custom return patterns allowed
 * - Test files: Very permissive rules for testing utilities
 */

export default [
  {
    ignores: [
      '**/dist/**',
      '**/dist/out-tsc/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/build/**',
      '**/out/**',
      '**/lib/**',
      '**/coverage/**',
      '**/storybook-static/**',
      '**/config/**',  // Ignore config directory
      '__disabled__/**',  // Ignore disabled files
      '__disabled__tests__/**',  // Ignore disabled test files
      'eslint.config.js',
      '.stylelintrc.js',
      'scripts/**/*.cjs',  // Ignore CommonJS scripts - avoid conflicts
      'scripts/eslint-rules/**',  // Ignore ESLint custom rules - avoid parsing conflicts
      'jest.setup.js',
      'jest.config.cjs',
      'playwright.config.ts',
      'prisma/seed.ts',
      'src/__tests__/__mocks__/**',  // Ignore mock files
      'src/__tests__/examples/**',  // Ignore example test files
      'src/__tests__/__disabled__/**',  // Ignore disabled test files
      'src/__disabled__/**',  // Ignore disabled source files
      'src/libs/services/__tests__/setup/**',  // Ignore service test setup files
      '**/__tests__/**/*.mock.js',  // Ignore mock files
      '**/__tests__/**/setup/**/*.js',  // Ignore test setup files
    ],
  },
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2020,
        ...globals.jest,
        config: 'readonly',
        React: 'readonly',
        google: 'readonly', // Google Maps API
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        project: path.resolve(__dirname, 'tsconfig.json'),
        sourceType: 'module',
      },
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@next/next': nextPlugin,
      custom: {
        rules: {
          'import-order': customImportOrderRule,
          'require-default-props': requireDefaultPropsRule,
        },
      },
      import: importPlugin,
      jest: jestPlugin,
      'jsx-a11y': jsxA11yPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'sort-destructure-keys': sortDestructureKeysPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
      'testing-library': testingLibraryPlugin,
    },
    settings: {
      react: {
        version: 'detect',
        runtime: 'automatic',
      },
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, 'tsconfig.json'),
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/extensions': [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
      ],
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      ...importPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...typescriptPlugin.configs.recommended.rules,
      // Next.js recommended rules
      '@next/next/google-font-display': 'warn',
      '@next/next/google-font-preconnect': 'warn',
      '@next/next/next-script-for-ga': 'warn',
      '@next/next/no-async-client-component': 'warn',
      '@next/next/no-before-interactive-script-outside-document': 'warn',
      '@next/next/no-css-tags': 'warn',
      '@next/next/no-head-element': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'warn',
      '@next/next/no-styled-jsx-in-document': 'warn',
      '@next/next/no-sync-scripts': 'warn',
      '@next/next/no-title-in-document-head': 'warn',
      '@next/next/no-typos': 'warn',
      '@next/next/no-unwanted-polyfillio': 'warn',
      '@next/next/inline-script-id': 'error',
      '@next/next/no-assign-module-variable': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-duplicate-head': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-script-component-in-head': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // TypeScript rules - pragmatic approach to reduce friction
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: false,
          ignoreRestArgs: true,
          // More permissive in certain contexts
        },
      ],
      // Unused variables - better handling of intentionally unused
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      // Disable prefer-nullish-coalescing due to too many false positives
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      // Disable base ESLint rules that are covered by TypeScript equivalents
      'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
      'no-use-before-define': 'off', // Handled by @typescript-eslint/no-use-before-define
      'no-shadow': 'off', // Handled by @typescript-eslint/no-shadow
      'no-undef': 'off', // TypeScript handles this better
      'no-redeclare': 'off', // Handled by @typescript-eslint/no-redeclare
      
      // TypeScript-specific rules (replacing ESLint equivalents)
      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/no-shadow': 'warn', 
      '@typescript-eslint/no-redeclare': 'warn',
      
      // Additional TypeScript rules for better code quality
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      'consistent-return': 'warn',
      'custom/import-order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'styled'],
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'builtin',
              pattern: 'react',
              position: 'before',
            },
            {
              group: 'internal',
              pattern: '@/**',
              position: 'after',
            },
            {
              group: 'styled',
              pattern: '**/*.styled',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
      // Custom require-default-props - more permissive for common patterns
      'custom/require-default-props': [
        'warn',
        {
          checkAllFunctions: false,
          exclude: ['children', 'className', 'key', 'ref', 'params', 'searchParams'],
        },
      ],
      'default-param-last': 'off',
      eqeqeq: 'warn',
      'func-names': 'warn',
      'global-require': 'warn',
      // Import rules optimized for TypeScript
      'import/default': 'off', // TypeScript handles this
      'import/named': 'off', // TypeScript handles this
      'import/namespace': 'off', // TypeScript handles this
      'import/no-cycle': 'warn', // Keep for circular dependencies
      'import/no-dynamic-require': 'warn',
      'import/no-extraneous-dependencies': 'warn',
      'import/no-mutable-exports': 'warn',
      'import/no-named-as-default': 'off', // Often false positives with TypeScript
      'import/no-namespace': 'off',
      'import/no-unused-modules': 'off', // TypeScript compiler handles this
      'import/order': 'off', // Using custom import-order rule instead
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off',
      'import/no-unresolved': 'off', // TypeScript handles this better
      'jest/expect-expect': 'warn',
      'jest/no-commented-out-tests': 'warn',
      'jest/no-conditional-expect': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/control-has-associated-label': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      // Testing library rules
      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/no-wait-for-multiple-assertions': 'warn',
      'testing-library/no-wait-for-side-effects': 'warn',
      'testing-library/no-node-access': 'warn',
      // Disable no-alert - allow for development and debugging
      'no-alert': 'off',
      'no-await-in-loop': 'warn',
      'no-cond-assign': 'warn',
      // Console statements - context-aware exceptions
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-constant-binary-expression': 'warn',
      'no-control-regex': 'warn',
      'no-func-assign': 'warn',
      'no-implicit-coercion': 'warn',
      // Disable nested ternary - common in JSX conditional rendering
      'no-nested-ternary': 'off',
      'no-param-reassign': 'warn',
      // Allow ++ in for loops
      'no-plusplus': [
        'warn',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-promise-executor-return': 'warn',
      'no-restricted-exports': [
        'warn',
        {
          restrictedNamedExports: ['default'],
        },
      ],
      'no-restricted-globals': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          message: 'Avoid default exports. Use named exports instead.',
          selector: 'ExportDefaultDeclaration',
        },
      ],
      'no-useless-escape': 'warn',
      'sort-keys-fix/sort-keys-fix': 'warn',
      'sort-destructure-keys/sort-destructure-keys': 'warn',
      'no-case-declarations': 'error',
      'import/no-duplicates': 'warn',
      'import/newline-after-import': 'warn',
      'import/max-dependencies': ['warn', { max: 15 }],
      // React jsx-no-bind - more permissive for event handlers
      'react/jsx-no-bind': [
        'warn',
        {
          ignoreDOMComponents: true,
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: true,
          allowBind: false,
        },
      ],
      'react/jsx-curly-brace-presence': ['warn', {
        props: 'never',
        children: 'never'
      }],
      'react/self-closing-comp': ['warn', {
        component: true,
        html: true
      }],
      'react/jsx-boolean-value': ['warn', 'never'],
      'no-return-assign': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-useless-catch': 'warn',
      'prefer-destructuring': 'warn',
      'prettier/prettier': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      // Make destructuring assignment more flexible
      'react/destructuring-assignment': [
        'warn',
        'always',
        {
          destructureInSignature: 'ignore',
        },
      ],
      'react/display-name': 'warn',
      'react/forbid-prop-types': [
        'warn',
        {
          checkChildContextTypes: true,
          checkContextTypes: true,
          forbid: ['any'],
        },
      ],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      'react/jsx-no-constructed-context-values': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      // Props spreading - disable for common patterns
      'react/jsx-props-no-spreading': [
        'warn',
        {
          html: 'ignore',
          custom: 'ignore',
          explicitSpread: 'ignore',
          exceptions: ['div', 'span', 'input', 'button', 'form'],
        },
      ],
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: false,
          shorthandFirst: false,
        },
      ],
      // Disable array index key warning - common pattern in lists
      'react/no-array-index-key': 'off',
      'react/no-danger': 'warn',
      'react/no-unknown-property': 'warn',
      'react/no-unstable-nested-components': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/require-default-props': 'off',
      'react/sort-prop-types': [
        'warn',
        {
          callbacksLast: false,
          ignoreCase: false,
          requiredFirst: false,
          sortShapeProp: true,
        },
      ],
      'sort-destructure-keys/sort-destructure-keys': ['warn', { caseSensitive: false }],
      'sort-keys-fix/sort-keys-fix': [
        'warn',
        'asc',
        {
          caseSensitive: true,
          natural: false,
        },
      ],
      'testing-library/await-async-queries': 'warn',
      'testing-library/no-node-access': 'warn',
      'testing-library/render-result-naming-convention': 'warn',
      'no-trailing-spaces': 'warn',
      'no-multi-spaces': 'warn',
      'eol-last': 'warn',
      'no-multiple-empty-lines': 'warn',
      'no-mixed-spaces-and-tabs': 'warn',
    },
  },
  // TypeScript-specific configuration for better optimization
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript-only rules - more strict for TS files
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for most cases
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/member-ordering': 'off',
      
      // Disable rules that don't make sense in TypeScript context
      'consistent-return': 'off', // TypeScript handles return type checking
      'default-param-last': 'off', // TypeScript handles this better with optional params
      
      // Import rules for TypeScript - let TS compiler handle most of this
      'import/extensions': 'off',
      'import/no-useless-path-segments': 'warn',
    },
  },
  // JavaScript-specific configuration (more lenient)
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      // Re-enable some ESLint rules for pure JS files
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'consistent-return': 'warn',
      
      // Import rules for JavaScript
      'import/no-unresolved': 'warn',
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
    },
    rules: {
      'consistent-return': 'warn',
      'default-param-last': 'off',
      eqeqeq: 'warn',
      'func-names': 'warn',
      'global-require': 'off',
      'import/no-dynamic-require': 'off',
      'import/order': 'off',
      'no-alert': 'warn',
      'no-console': 'off',
      'no-param-reassign': 'warn',
      'no-shadow': 'warn',
      'no-unused-vars': 'warn',
      'no-use-before-define': 'warn',
      'prettier/prettier': 'warn',
      'sort-keys-fix/sort-keys-fix': [
        'warn',
        'asc',
        {
          caseSensitive: true,
          natural: false,
        },
      ],
    },
  },
  {
    files: ['**/serviceWorker.js'],
    rules: {
      'no-restricted-globals': ['warn', ...restrictedGlobals.filter((g) => g !== 'self')],
    },
  },
  {
    files: ['eslint.config.js', '.prettierrc.js', 'stylelint.config.js'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/hocs/**/*.{ts,tsx}'],
    rules: {
      'react/jsx-props-no-spreading': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: [
      'src/app/**/page.{js,jsx,ts,tsx}',
      'src/app/**/layout.{js,jsx,ts,tsx}',
      'src/app/**/loading.{js,jsx,ts,tsx}',
      'src/app/**/error.{js,jsx,ts,tsx}',
      'src/app/**/not-found.{js,jsx,ts,tsx}',
      'src/app/**/global-error.{js,jsx,ts,tsx}',
      'src/app/**/template.{js,jsx,ts,tsx}',
      'src/app/**/default.{js,jsx,ts,tsx}',
    ],
    rules: {
      'no-restricted-syntax': 'off',
      'no-restricted-exports': 'off',
      'import/no-default-export': 'off',
      'import/prefer-default-export': 'error',
    },
  },
  {
    files: ['src/app/api/**/route.{js,ts}'],
    rules: {
      'no-restricted-syntax': 'off',
      'no-console': 'warn',
      'import/prefer-default-export': 'off',
    },
  },
  {
    files: ['next.config.{js,ts,mjs}', 'middleware.{js,ts}'],
    rules: {
      'no-restricted-syntax': 'off',
      'import/no-default-export': 'off',
      'no-restricted-exports': 'off',
    },
  },
  {
    files: ['src/libs/services/**/*.{ts,tsx}', 'src/libs/data/**/*.{ts,tsx}'],
    rules: {
      'testing-library/no-await-sync-queries': 'off',
      'testing-library/await-async-queries': 'off',
      'testing-library/no-node-access': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Allow console statements in development and server-side code, warn in production
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  // API routes should allow console statements for server-side logging
  {
    files: ['src/app/api/**/*.{js,ts}', 'prisma/**/*.{js,ts}'],
    rules: {
      'no-console': 'off', // Allow server-side logging
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
  // Seed files and scripts - allow console statements and relaxed rules
  {
    files: ['prisma/seed.ts', 'scripts/**/*.{js,ts,cjs}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-plusplus': 'off',
      'no-await-in-loop': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
  // Styled components files - relaxed rules for styled-components patterns
  {
    files: ['**/*.styled.{ts,tsx}'],
    rules: {
      'import/prefer-default-export': 'off',
      'no-unused-expressions': 'off', // For styled-components template literals
    },
  },
  // Hook files - allow custom patterns
  {
    files: ['**/hooks/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/exhaustive-deps': 'warn', // Keep as warning, not error
      'consistent-return': 'off', // Hooks may have conditional returns
    },
  },
  // Test files - more permissive rules to reduce friction
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // Common in test mocks
      'react/jsx-props-no-spreading': 'off',
      'no-alert': 'off',
      'import/no-extraneous-dependencies': 'off',
      'react/display-name': 'off',
      
      // Testing Library - more permissive to reduce friction
      'testing-library/no-container': 'warn', // Allow container access when needed
      'testing-library/no-node-access': 'warn', // Sometimes necessary
      'testing-library/no-wait-for-side-effects': 'warn', // Common in integration tests
      'testing-library/no-wait-for-multiple-assertions': 'warn', // Common in complex tests
      
      // Jest rules - more permissive
      'jest/no-conditional-expect': 'warn',
      'jest/expect-expect': 'off', // Allow helper functions without explicit expects
    },
  },
];
