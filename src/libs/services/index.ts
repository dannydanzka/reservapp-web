/**
 * Services exports
 */

// HTTP Services
export * from './http';

// API Services
export { authService } from './api/authService';
export { API_ENDPOINTS } from './api/config';
export { API_CONFIG as API_BASE_CONFIG } from './api/config';

// Authentication Services
export { JWTService } from './auth/jwtService';
export { AuthMiddleware } from './auth/authMiddleware';

// Cloudinary Services (server-side only)
// export * from './cloudinary';

// Utils
export * from './api/utils/handleApiRequest';
