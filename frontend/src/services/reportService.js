import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function getUnpaidBillsSummary(filters = {}) {
  const params = new URLSearchParams()
  if (filters.utilityType && filters.utilityType !== 'All') {
    params.append('utilityType', filters.utilityType)
  }
  if (filters.minDaysOverdue) {
    params.append('minDaysOverdue', filters.minDaysOverdue)
  }

  const queryString = params.toString()
  const endpoint = queryString
    ? `${API_URL}/reports/unpaid-bills-summary?${queryString}`
    : `${API_URL}/reports/unpaid-bills-summary`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch unpaid bills summary')
  }

  return data.data
}

export async function getMonthlyRevenue(filters = {}) {
  const params = new URLSearchParams()
  if (filters.startMonth) params.append('startMonth', filters.startMonth)
  if (filters.endMonth) params.append('endMonth', filters.endMonth)
  if (filters.utilityType && filters.utilityType !== 'All') {
    params.append('utilityType', filters.utilityType)
  }

  const queryString = params.toString()
  const endpoint = queryString
    ? `${API_URL}/reports/monthly-revenue?${queryString}`
    : `${API_URL}/reports/monthly-revenue`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch monthly revenue')
  }

  return data.data
}

export async function getCustomerBillingSummary(filters = {}) {
  const params = new URLSearchParams()
  if (filters.customerType && filters.customerType !== 'All') {
    params.append('customerType', filters.customerType)
  }
  if (filters.minOutstanding) {
    params.append('minOutstanding', filters.minOutstanding)
  }
  if (filters.sortBy) params.append('sortBy', filters.sortBy)
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

  const queryString = params.toString()
  const endpoint = queryString
    ? `${API_URL}/reports/customer-billing-summary?${queryString}`
    : `${API_URL}/reports/customer-billing-summary`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch customer billing summary')
  }

  return data.data
}

export async function getTopConsumers(filters = {}) {
  const params = new URLSearchParams()
  if (filters.utilityType && filters.utilityType !== 'All') {
    params.append('utilityType', filters.utilityType)
  }
  if (filters.limit) params.append('limit', filters.limit)
  if (filters.customerType && filters.customerType !== 'All') {
    params.append('customerType', filters.customerType)
  }

  const queryString = params.toString()
  const endpoint = queryString
    ? `${API_URL}/reports/top-consumers?${queryString}`
    : `${API_URL}/reports/top-consumers`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch top consumers')
  }

  return data.data
}
