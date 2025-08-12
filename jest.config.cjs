const nextJest = require('next/jest');
const path = require('path');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // setupFiles: ['<rootDir>/src/__tests__/setup/jest-env.ts'], // Files removed during cleanup

  // Test environment
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },

  // Module resolution and path mapping
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Handle static assets - temporarily disabled (mocks removed)
    // '\\.(jpg|jpeg|png|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',
    
    // Handle module aliases (matches tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@shared/(.*)$': '<rootDir>/src/libs/shared/$1',
    '^@presentation/(.*)$': '<rootDir>/src/libs/presentation/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/libs/infrastructure/$1',
    '^@domains/(.*)$': '<rootDir>/src/libs/domains/$1',
    '^@ui/(.*)$': '<rootDir>/src/libs/presentation/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/libs/presentation/hooks/$1',
    '^@providers/(.*)$': '<rootDir>/src/libs/presentation/providers/$1',
    '^@layouts/(.*)$': '<rootDir>/src/libs/presentation/layouts/$1',
    '^@services/(.*)$': '<rootDir>/src/libs/infrastructure/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/libs/infrastructure/repositories/$1',
    '^@config/(.*)$': '<rootDir>/src/libs/shared/config/$1',
    '^@types/(.*)$': '<rootDir>/src/libs/shared/types/$1',
    '^@constants/(.*)$': '<rootDir>/src/libs/shared/constants/$1',
    '^@i18n/(.*)$': '<rootDir>/src/libs/shared/i18n/$1',
    '^@mod-auth/(.*)$': '<rootDir>/src/modules/mod-auth/$1',
    '^@mod-admin/(.*)$': '<rootDir>/src/modules/mod-admin/$1',
    '^@mod-landing/(.*)$': '<rootDir>/src/modules/mod-landing/$1',
    
    // Handle Next.js internal modules
    '^next-auth/(.*)$': '<rootDir>/node_modules/next-auth/$1',
  },

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
  ],

  // Module file extensions
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,ts}',
    '!src/**/index.{js,ts,tsx}', // Usually just exports
    '!src/app/**/*.{js,jsx,ts,tsx}', // Next.js app router files
    '!src/**/__tests__/**/*',
    '!src/**/__mocks__/**/*',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Performance and optimization
  maxWorkers: '50%',
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  // Verbose output for better debugging
  verbose: false,
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
      module: {
        type: 'es6',
      },
    }],
  },

  // Transform ES modules from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@prisma|stripe|cloudinary|resend)/)',
  ],

  // Watch mode configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Global test timeout (30 seconds)
  testTimeout: 30000,

  // Error handling
  errorOnDeprecated: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);