// Centralized API Client

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiError'
  }
}


// Centralized error handler
function handleApiError(response, data) {
  // 401 = Bad/expired token → Logout and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('tri_meter_token')
    localStorage.removeItem('tri_meter_user')
    window.location.href = '/#/'
    return
  }

  // For all other errors, throw ApiError with status code
  throw new ApiError(
    data.message || `Request failed with status ${response.status}`,
    response.status
  )
}

/**
 * Generic API request wrapper
 * @param {string} endpoint - API endpoint (e.g., '/meter-readings')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      handleApiError(response, data)
    }

    return data.data || data
  } catch (error) {
    // Re-throw ApiError or network errors
    if (error instanceof ApiError) {
      throw error
    }
    console.error('API request error:', error)
    throw error
  }
}

// GET request
export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' })
}

// POST request
export async function apiPost(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// PUT request
export async function apiPut(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

// DELETE request
export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' })
}
