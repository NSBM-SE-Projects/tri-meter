/**
 * API utility functions with JWT authentication
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get authorization headers with JWT token
 * @param {boolean} includeContentType - Whether to include Content-Type header
 */
export const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  return {
    ...(includeContentType && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

/**
 * Make authenticated API request
 */
export const apiRequest = async (endpoint, options = {}) => {
  // Check if body is FormData (for file uploads)
  const isFormData = options.body instanceof FormData;

  const config = {
    ...options,
    headers: {
      // Don't set Content-Type for FormData (browser will set it with boundary)
      ...getAuthHeaders(!isFormData),
      ...options.headers
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user from localStorage to avoid repeated API calls
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
