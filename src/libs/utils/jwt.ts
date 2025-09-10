/**
 * JWT Client-side Utilities
 *
 * Utilities for handling JWT tokens on the client-side without server calls.
 * Based on premios-flow pattern for optimal performance.
 */

/**
 * Decode and validate JWT token expiration
 */
export const isTokenValid = (token: string | null): boolean => {
  if (typeof window === 'undefined' || !token) return false;

  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);

    // Check if token is expired
    return payload.exp > now;
  } catch {
    return false;
  }
};

/**
 * Get user data from JWT token
 */
export const getUserFromToken = (token: string | null) => {
  if (!token || !isTokenValid(token)) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Create a safe name fallback
    const firstName = payload.firstName || '';
    const lastName = payload.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const safeName = payload.name || fullName || payload.email?.split('@')[0] || 'Usuario';

    return {
      address: payload.address,
      businessName: payload.businessName,
      createdAt: payload.createdAt,
      email: payload.email,
      firstName: payload.firstName,
      id: payload.userId,
      isActive: payload.isActive,
      lastName: payload.lastName,
      name: safeName,
      phone: payload.phone,
      role: payload.role,
      subscriptionPlan: payload.subscriptionPlan,
      updatedAt: payload.updatedAt,
    };
  } catch {
    return null;
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (token: string | null, role: string): boolean => {
  const user = getUserFromToken(token);
  if (!user) return false;

  const userRole = user.role?.toUpperCase();
  const targetRole = role.toUpperCase();

  // Super admin has all permissions
  if (userRole === 'SUPER_ADMIN') return true;

  // Admin has admin permissions
  if (targetRole === 'ADMIN' && (userRole === 'ADMIN' || userRole === 'MANAGER')) return true;

  return userRole === targetRole;
};
