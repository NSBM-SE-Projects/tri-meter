/**
 * Customer Service
 * Handles all customer-related API calls
 */

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Get all customers
 */
export async function getAllCustomers() {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch customers')
  }

  return data.data
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id) {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch customer')
  }

  return data.data
}

/**
 * Create new customer
 */
export async function createCustomer(customerData) {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(customerData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create customer')
  }

  return data.data
}

/**
 * Update customer
 */
export async function updateCustomer(id, customerData) {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(customerData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update customer')
  }

  return data.data
}

/**
 * Delete customer
 */
export async function deleteCustomer(id) {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete customer')
  }

  return data
}
