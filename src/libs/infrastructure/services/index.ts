/**
 * Shared Infrastructure Services Index
 *
 * Only core services that are used across multiple modules.
 * Module-specific services should be in their respective modules.
 */

// Core Authentication Services (shared across all modules)
export * from './core/auth';

// Core Database Services (shared across all modules)
export * from './core/database';

// Core Email Services (shared across multiple modules)
export * from './core/email';

// Core HTTP Services (shared across all modules)
export * from './core/http';

// Core File Upload Services (shared across multiple modules)
export * from './core/cloudinary';

// Core Payment Services (shared across multiple modules)
export * from './core/stripe';

// Core API Services (shared across multiple modules)
export * from './core/api';
