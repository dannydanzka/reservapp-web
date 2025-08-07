const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@ui/(.*)$': '<rootDir>/src/libs/ui/$1',
    '^@core/(.*)$': '<rootDir>/src/libs/core/$1',
    '^@data/(.*)$': '<rootDir>/src/libs/data/$1',
    '^@types/(.*)$': '<rootDir>/src/libs/types/$1',
    '^@mod-auth/(.*)$': '<rootDir>/src/modules/mod-auth/$1',
    '^@mod-admin/(.*)$': '<rootDir>/src/modules/mod-admin/$1',
    '^@mod-landing/(.*)$': '<rootDir>/src/modules/mod-landing/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  // Add more setup options if needed
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);