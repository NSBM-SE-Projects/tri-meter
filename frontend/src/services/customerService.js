/**
 * Customer Service
 */

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get all customers
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

// Get customer by ID
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

// Create new customer
export async function createCustomer(customerData, idImageFile = null) {
  const formData = new FormData()

  // Add all customer data fields
  Object.keys(customerData).forEach(key => {
    if (customerData[key] !== null && customerData[key] !== undefined) {
      formData.append(key, customerData[key])
    }
  })

  if (idImageFile) {
    formData.append('idImage', idImageFile)
  }

  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: {
      // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      'Authorization': getAuthHeaders()['Authorization']
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create customer')
  }

  return data.data
}

// Update customer
export async function updateCustomer(id, customerData, idImageFile = null) {
  const formData = new FormData()

  Object.keys(customerData).forEach(key => {
    if (customerData[key] !== null && customerData[key] !== undefined) {
      formData.append(key, customerData[key])
    }
  })

  if (idImageFile) {
    formData.append('idImage', idImageFile)
  }

  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': getAuthHeaders()['Authorization']
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update customer')
  }

  return data.data
}

// Delete customer
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
