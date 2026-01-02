/**
 * Meter Reading Service
 * Service for meter reading CRUD operations
 */

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get all meter readings
export async function getAllMeterReadings() {
  try {
    const response = await fetch(`${API_URL}/meter-readings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch meter readings')
    }
    return data.data
  } catch (error) {
    console.error('Error fetching meter readings:', error)
    throw error
  }
}

// Get meter reading by ID
export async function getMeterReadingById(id) {
  try {
    const response = await fetch(`${API_URL}/meter-readings/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch meter reading')
    }
    return data.data
  } catch (error) {
    console.error('Error fetching meter reading:', error)
    throw error
  }
}

// Create new meter reading
export async function createMeterReading(readingData) {
  try {
    const response = await fetch(`${API_URL}/meter-readings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(readingData),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create meter reading')
    }
    return data.data
  } catch (error) {
    console.error('Error creating meter reading:', error)
    throw error
  }
}

// Update meter reading
export async function updateMeterReading(id, readingData) {
  try {
    const response = await fetch(`${API_URL}/meter-readings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(readingData),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update meter reading')
    }
    return data.data
  } catch (error) {
    console.error('Error updating meter reading:', error)
    throw error
  }
}

// Delete meter reading
export async function deleteMeterReading(id) {
  try {
    const response = await fetch(`${API_URL}/meter-readings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete meter reading')
    }
    return data
  } catch (error) {
    console.error('Error deleting meter reading:', error)
    throw error
  }
}

// Get all active meters for dropdown
export async function getActiveMeters() {
  try {
    const response = await fetch(`${API_URL}/meter-readings/meters/active`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch active meters')
    }
    return data.data
  } catch (error) {
    console.error('Error fetching active meters:', error)
    throw error
  }
}

// Get latest reading for a meter
export async function getLatestReading(meterId) {
  try {
    const response = await fetch(`${API_URL}/meter-readings/latest/${meterId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch latest reading')
    }
    return data.data
  } catch (error) {
    console.error('Error fetching latest reading:', error)
    throw error
  }
}
