// Payment Service

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get all payments with optional filters
export async function getAllPayments(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.append('search', filters.search)
  if (filters.method && filters.method !== 'all') params.append('method', filters.method)
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.append('dateTo', filters.dateTo)

  const queryString = params.toString()
  const endpoint = queryString ? `${API_URL}/payments?${queryString}` : `${API_URL}/payments`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch payments')
  }

  return data.data
}

// Get payment by ID
export async function getPaymentById(id) {
  const paymentId = id.toString().replace('P-', '')
  const response = await fetch(`${API_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch payment')
  }

  return data.data
}

// Record new payment
export async function recordPayment(paymentData) {
  const response = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(paymentData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to record payment')
  }

  return data.data
}

// Get bills for payment (unpaid/partially paid)
export async function getBillsForPayment(customerId) {
  const response = await fetch(`${API_URL}/payments/bills/${customerId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bills')
  }

  return data.data
}

// Get customers with unpaid bills
export async function getCustomersWithUnpaidBills() {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch customers')
  }

  // Filter customers that have unpaid/partially paid bills
  return data.data
}
