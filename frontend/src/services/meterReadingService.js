// Meter Reading Service

import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// Get all meter readings
export async function getAllMeterReadings() {
  return apiGet('/meter-readings')
}

// Get meter reading by ID
export async function getMeterReadingById(id) {
  return apiGet(`/meter-readings/${id}`)
}

// Create new meter reading
export async function createMeterReading(readingData) {
  return apiPost('/meter-readings', readingData)
}

// Update meter reading
export async function updateMeterReading(id, readingData) {
  return apiPut(`/meter-readings/${id}`, readingData)
}

// Delete meter reading
export async function deleteMeterReading(id) {
  return apiDelete(`/meter-readings/${id}`)
}

// Get all active meters for dropdown
export async function getActiveMeters() {
  return apiGet('/meter-readings/meters/active')
}

// Get latest reading for a meter
export async function getLatestReading(meterId) {
  return apiGet(`/meter-readings/latest/${meterId}`)
}
