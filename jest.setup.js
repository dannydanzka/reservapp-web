// Jest setup file - runs after the test framework has been installed in the environment
// Learn more: https://jestjs.io/docs/configuration#setupfilesafterenv-array

// Import testing utilities
import '@testing-library/jest-dom';
import 'jest-styled-components';

// Polyfills for Next.js server components in tests
// Install whatwg-fetch for Request/Response polyfill in Node environment
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = input;
      this.method = init.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || {}));
      this._body = init.body;
    }

    async json() {
      return this._body ? JSON.parse(this._body) : {};
    }

    async text() {
      return this._body || '';
    }

    clone() {
      return new Request(this.url, {
        method: this.method,
        headers: Object.fromEntries(this.headers),
        body: this._body,
      });
    }
  };
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this?.status = init?.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.ok = this?.status >= 200 && this?.status < 300;
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
    }
  };
}

if (!global.Headers) {
  global.Headers = Map;
}

if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve(new Response('{}', { status: 200 }))
  );
}

// Setup test environment globals (commented out temporarily)
// import './src/__tests__/setup/test-globals';

// Import custom matchers and utilities (commented out temporarily)
// import './src/__tests__/setup/custom-matchers';

// Configure testing libraries
import { configure } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Configure React Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  // Log DOM on test failure for better debugging
  getElementError: (message, container) => {
    const error = new Error(
      [message, '', 'Here is the full DOM:', '', container.innerHTML].join('\n')
    );
    return error;
  },
});

// Global test environment setup
beforeAll(() => {
  // Suppress console errors during tests unless explicitly needed
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
      args[0].includes('React does not recognize') ||
      args[0].includes('validateDOMNesting'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

// Clean up after each test
afterEach(() => {
  // Clean up any remaining timers
  jest.clearAllTimers();
  jest.useRealTimers();

  // Clear all mocks
  jest.clearAllMocks();
});

// Global test utilities available in all test files
global.userEvent = userEvent;

// Performance monitoring for slow tests
const originalIt = global.it;
global.it = (name, fn, timeout) => {
  return originalIt(name, async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const duration = performance.now() - start;

    if (duration > 1000) {
      console.warn(`⚠️  Slow test detected: "${name}" took ${duration.toFixed(2)}ms`);
    }

    return result;
  }, timeout);
};

// Mock window.matchMedia (used by styled-components and responsive hooks)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollTo methods
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(Element.prototype, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock localStorage and sessionStorage
const createStorageMock = () => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index) => Object.keys(store)[index] || null),
  };
};

Object.defineProperty(window, 'localStorage', {
  value: createStorageMock(),
});

Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock(),
});

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-object-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
});

// Mock crypto.randomUUID (for Node.js < 19)
if (!global.crypto) {
  global.crypto = {};
}

if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = jest.fn(() => 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  );
}

// Increase timeout for integration tests
jest.setTimeout(30000);