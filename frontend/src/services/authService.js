/**
 * Authentication Service
 * Handles login, logout, token management
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const TOKEN_KEY = 'tri_meter_token'
const USER_KEY = 'tri_meter_user'

/**
 * Login user
 */
export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'LOGIN FAILED...')
  }

  // Save token and user data to localStorage
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.data))

  return data.data
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const userJson = localStorage.getItem(USER_KEY)
  return userJson ? JSON.parse(userJson) : null
}

/**
 * Get auth token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken()
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders() {
  const token = getToken()
  return token
    ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    : {
        'Content-Type': 'application/json',
      }
}
