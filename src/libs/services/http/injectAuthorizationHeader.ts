/**
 * Injects authorization header if session token exists
 */
const injectAuthorizationHeader = (headers: Record<string, string> = {}): Record<string, any> => {
  const sessionToken =
    typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const authHeader = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};

  return {
    ...authHeader,
    ...headers,
  };
};

export { injectAuthorizationHeader };
