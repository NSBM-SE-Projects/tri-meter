// Bill Service

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get all bills with optional filters
export async function getAllBills(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'all') params.append('status', filters.status)
  if (filters.utilityType && filters.utilityType !== 'all') params.append('utilityType', filters.utilityType)
  if (filters.search) params.append('search', filters.search)

  const queryString = params.toString()
  const endpoint = queryString ? `${API_URL}/bills?${queryString}` : `${API_URL}/bills`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bills')
  }

  return data.data
}

// Get bill by ID
export async function getBillById(id) {
  const billId = id.toString().replace('B-', '')
  const response = await fetch(`${API_URL}/bills/${billId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bill')
  }

  return data.data
}

// Generate new bill
export async function generateBill(billData) {
  const response = await fetch(`${API_URL}/bills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(billData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate bill')
  }

  return data.data
}

// Send bill via email
export async function sendBillEmail(billId) {
  const id = billId.toString().replace('B-', '')
  const response = await fetch(`${API_URL}/bills/${id}/send-email`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send bill email')
  }

  return data
}

// Get customers for bill generation
export async function getCustomersForBilling() {
  const response = await fetch(`${API_URL}/bills/customers`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch customers')
  }

  return data.data
}

// Get service connections for customer
export async function getServiceConnectionsByCustomer(customerId) {
  const response = await fetch(`${API_URL}/bills/service-connections/${customerId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch service connections')
  }

  return data.data
}
