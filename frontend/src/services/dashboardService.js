/**
 * Dashboard Service
 * Handles fetching dashboard statistics
 */

import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch dashboard stats')
  }

  return data.data
}

export async function getRevenueTrends(range = '30d') {
  const response = await fetch(`${API_URL}/dashboard/revenue-trends?range=${range}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch revenue trends')
  }

  return data.data
}

export async function getRecentActivity() {
  const response = await fetch(`${API_URL}/dashboard/activity`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch recent activity')
  }

  return data.data
}
