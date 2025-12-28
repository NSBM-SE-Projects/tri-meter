// Mock user data
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'customer',
  avatar: '/src/assets/logo-no-bg-white.png'
}

// Helper function to generate usage data
const generateUsageData = (days, baseUsage, variance) => {
  const data = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const randomVariance = (Math.random() - 0.5) * variance
    const usage = Math.max(0, baseUsage + randomVariance)
    const cost = usage * 0.12 // Mock rate

    data.push({
      date: date.toISOString().split('T')[0],
      usage: parseFloat(usage.toFixed(2)),
      cost: parseFloat(cost.toFixed(2))
    })
  }

  return data
}

// Electricity usage data (last 30 days in kWh)
export const mockElectricityUsage = generateUsageData(30, 25, 10)

// Water usage data (last 30 days in cubic meters)
export const mockWaterUsage = generateUsageData(30, 3.5, 1.5)

// Gas usage data (last 30 days in cubic meters)
export const mockGasUsage = generateUsageData(30, 2.8, 1.2)

// Calculate current month stats
const calculateMonthStats = (data) => {
  const current = data.reduce((sum, day) => sum + day.usage, 0)
  const previous = current * (0.9 + Math.random() * 0.2) // Mock previous month
  const percentChange = ((current - previous) / previous) * 100
  const totalCost = data.reduce((sum, day) => sum + day.cost, 0)

  return {
    current: parseFloat(current.toFixed(2)),
    previous: parseFloat(previous.toFixed(2)),
    percentChange: parseFloat(percentChange.toFixed(1)),
    cost: parseFloat(totalCost.toFixed(2))
  }
}

export const currentMonthStats = {
  electricity: calculateMonthStats(mockElectricityUsage),
  water: calculateMonthStats(mockWaterUsage),
  gas: calculateMonthStats(mockGasUsage)
}

// Mock invoices data
export const mockInvoices = [
  {
    id: 'INV-2024-001',
    date: '2024-01-01',
    dueDate: '2024-01-15',
    amount: 285.50,
    status: 'paid',
    utilities: {
      electricity: 145.30,
      water: 68.20,
      gas: 72.00
    }
  },
  {
    id: 'INV-2024-002',
    date: '2024-02-01',
    dueDate: '2024-02-15',
    amount: 312.75,
    status: 'paid',
    utilities: {
      electricity: 168.50,
      water: 71.25,
      gas: 73.00
    }
  },
  {
    id: 'INV-2024-003',
    date: '2024-03-01',
    dueDate: '2024-03-15',
    amount: 298.40,
    status: 'pending',
    utilities: {
      electricity: 152.90,
      water: 69.50,
      gas: 76.00
    }
  }
]

// Mock recent activity
export const mockRecentActivity = [
  {
    id: '1',
    type: 'payment',
    description: 'Payment received for February invoice',
    timestamp: '2024-02-10T14:30:00',
    amount: 312.75
  },
  {
    id: '2',
    type: 'alert',
    description: 'Electricity usage 15% higher than average',
    timestamp: '2024-02-08T09:15:00'
  },
  {
    id: '3',
    type: 'reading',
    description: 'Monthly meter reading completed',
    timestamp: '2024-02-01T08:00:00'
  },
  {
    id: '4',
    type: 'payment',
    description: 'Payment received for January invoice',
    timestamp: '2024-01-12T11:20:00',
    amount: 285.50
  }
]

// Peak hours data for electricity (hourly breakdown)
export const mockElectricityHourly = Array.from({ length: 24 }, (_, hour) => {
  const isPeakHour = hour >= 17 && hour <= 21
  const baseUsage = isPeakHour ? 1.8 : 0.8
  const variance = Math.random() * 0.4

  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    usage: parseFloat((baseUsage + variance).toFixed(2)),
    isPeak: isPeakHour
  }
})

// Mock customer data
export const mockCustomers = [
  {
    id: 'C-001',
    name: 'John Smith',
    type: 'Residential',
    consumption: 245.5,
    amount: 29.46,
    status: 'Paid'
  },
  {
    id: 'C-002',
    name: 'Jane Doe',
    type: 'Commercial',
    consumption: 482.3,
    amount: 57.88,
    status: 'Pending'
  },
  {
    id: 'C-003',
    name: 'Robert Johnson',
    type: 'Residential',
    consumption: 198.7,
    amount: 23.84,
    status: 'Paid'
  },
  {
    id: 'C-004',
    name: 'Sarah Williams',
    type: 'Residential',
    consumption: 312.1,
    amount: 37.45,
    status: 'Overdue'
  },
  {
    id: 'C-005',
    name: 'Michael Brown',
    type: 'Commercial',
    consumption: 567.9,
    amount: 68.15,
    status: 'Paid'
  },
  {
    id: 'C-006',
    name: 'Emily Davis',
    type: 'Residential',
    consumption: 223.4,
    amount: 26.81,
    status: 'Pending'
  },
  {
    id: 'C-007',
    name: 'David Miller',
    type: 'Commercial',
    consumption: 645.2,
    amount: 77.42,
    status: 'Paid'
  }
]
