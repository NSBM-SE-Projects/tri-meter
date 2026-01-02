/**
 * Meter Reading Service
 * Mock service with sample data - replace with real API calls when backend is ready
 */

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Mock data for development
const mockMeterReadings = [
  {
    id: 1,
    meterNumber: "E-12345",
    date: "Dec 26",
    value: "1250",
    previousValue: "1150",
    consumption: "100kWh",
    tampered: false,
    fieldOfficer: "John Doe",
    utilityType: "Electricity",
    month: "December",
    customerName: "John Smith",
  },
  {
    id: 2,
    meterNumber: "W-67890",
    date: "Dec 26",
    value: "850",
    previousValue: "800",
    consumption: "50m³",
    tampered: false,
    fieldOfficer: "Jane Smith",
    utilityType: "Water",
    month: "December",
    customerName: "Jane Doe",
  },
  {
    id: 3,
    meterNumber: "G-34567",
    date: "Dec 29",
    value: "420",
    previousValue: "400",
    consumption: "20m³",
    tampered: false,
    fieldOfficer: "Mike Johnson",
    utilityType: "Gas",
    month: "December",
    customerName: "ABC Corp",
  },
  {
    id: 4,
    meterNumber: "E-23456",
    date: "Dec 27",
    value: "2100",
    previousValue: "2000",
    consumption: "100kWh",
    tampered: true,
    fieldOfficer: "Sarah Lee",
    utilityType: "Electricity",
    month: "December",
    customerName: "Sarah Wilson",
  },
  {
    id: 5,
    meterNumber: "W-78901",
    date: "Dec 28",
    value: "950",
    previousValue: "920",
    consumption: "30m³",
    tampered: false,
    fieldOfficer: "David Chen",
    utilityType: "Water",
    month: "December",
    customerName: "Mike Brown",
  },
]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Get all meter readings
export async function getAllMeterReadings() {
  try {
    // TODO: Replace with real API call when backend is ready
    // const response = await fetch(`${API_URL}/meter-readings`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    // })
    // const data = await response.json()
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to fetch meter readings')
    // }
    // return data.data

    // Mock implementation
    await delay(500) // Simulate network delay
    return mockMeterReadings
  } catch (error) {
    console.error('Error fetching meter readings:', error)
    throw error
  }
}

// Get meter reading by ID
export async function getMeterReadingById(id) {
  try {
    // TODO: Replace with real API call when backend is ready
    // const response = await fetch(`${API_URL}/meter-readings/${id}`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    // })
    // const data = await response.json()
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to fetch meter reading')
    // }
    // return data.data

    // Mock implementation
    await delay(300)
    const reading = mockMeterReadings.find(r => r.id === parseInt(id))
    if (!reading) {
      throw new Error('Meter reading not found')
    }
    return reading
  } catch (error) {
    console.error('Error fetching meter reading:', error)
    throw error
  }
}

// Create new meter reading
export async function createMeterReading(readingData) {
  try {
    // TODO: Replace with real API call when backend is ready
    // const response = await fetch(`${API_URL}/meter-readings`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(readingData),
    // })
    // const data = await response.json()
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to create meter reading')
    // }
    // return data.data

    // Mock implementation
    await delay(500)
    const newReading = {
      id: mockMeterReadings.length + 1,
      ...readingData,
    }
    mockMeterReadings.push(newReading)
    return newReading
  } catch (error) {
    console.error('Error creating meter reading:', error)
    throw error
  }
}

// Update meter reading
export async function updateMeterReading(id, readingData) {
  try {
    // TODO: Replace with real API call when backend is ready
    // const response = await fetch(`${API_URL}/meter-readings/${id}`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(readingData),
    // })
    // const data = await response.json()
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to update meter reading')
    // }
    // return data.data

    // Mock implementation
    await delay(500)
    const index = mockMeterReadings.findIndex(r => r.id === parseInt(id))
    if (index === -1) {
      throw new Error('Meter reading not found')
    }
    const updatedReading = {
      ...mockMeterReadings[index],
      ...readingData,
    }
    mockMeterReadings[index] = updatedReading
    return updatedReading
  } catch (error) {
    console.error('Error updating meter reading:', error)
    throw error
  }
}

// Delete meter reading
export async function deleteMeterReading(id) {
  try {
    // TODO: Replace with real API call when backend is ready
    // const response = await fetch(`${API_URL}/meter-readings/${id}`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    // })
    // const data = await response.json()
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to delete meter reading')
    // }
    // return data

    // Mock implementation
    await delay(500)
    const index = mockMeterReadings.findIndex(r => r.id === parseInt(id))
    if (index === -1) {
      throw new Error('Meter reading not found')
    }
    mockMeterReadings.splice(index, 1)
    return { message: 'Meter reading deleted successfully' }
  } catch (error) {
    console.error('Error deleting meter reading:', error)
    throw error
  }
}
