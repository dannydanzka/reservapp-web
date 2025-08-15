/**
 * Injects authorization header if session token exists
 */
const injectAuthorizationHeader = (headers: Record<string, string> = {}): Record<string, any> => {
  let sessionToken =
    typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

  // Remove quotes if present (localStorage sometimes stores with quotes)
  if (sessionToken) {
    sessionToken = sessionToken.replace(/^"(.*)"$/, '$1');
  }

  const authHeader = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};

  return {
    ...authHeader,
    ...headers,
  };
};

export { injectAuthorizationHeader };
