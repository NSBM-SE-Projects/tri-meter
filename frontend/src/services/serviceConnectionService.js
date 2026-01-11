/**
 * Service Connection Service
 */

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get all service connections
export async function getAllServiceConnections() {
  const response = await fetch(`${API_URL}/service-connections`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch service connections')
  }

  return data.data
}

// Get service connection by ID
export async function getServiceConnectionById(id) {
  const response = await fetch(`${API_URL}/service-connections/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch service connection')
  }

  return data.data
}

// Create new service connection
export async function createServiceConnection(connectionData) {
  const response = await fetch(`${API_URL}/service-connections`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(connectionData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create service connection')
  }

  return data.data
}

// Update service connection
export async function updateServiceConnection(id, connectionData) {
  const response = await fetch(`${API_URL}/service-connections/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(connectionData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update service connection')
  }

  return data.data
}

// Delete service connection
export async function deleteServiceConnection(id) {
  const response = await fetch(`${API_URL}/service-connections/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete service connection')
  }

  return data
}

// Disconnect all active service connections for a customer
export async function disconnectCustomerConnections(customerId) {
  const response = await fetch(`${API_URL}/service-connections/disconnect-customer/${customerId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to disconnect customer connections')
  }

  return data.data
}
