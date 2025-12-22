import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

function Test() {
  const [count, setCount] = useState(0)
  const [healthStatus, setHealthStatus] = useState({ status: 'loading', message: '' })
  const [dbStatus, setDbStatus] = useState({ status: 'loading', message: '' })

  useEffect(() => {
    // Test API health endpoint
    const testAPIHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`)
        const data = await response.json()
        setHealthStatus({
          status: 'success',
          message: data.status === 'OK' ? 'connected' : 'failed'
        })
      } catch (error) {
        setHealthStatus({ status: 'error', message: 'failed' })
      }
    }

    // Test database endpoint
    const testDatabase = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/test-db`)
        const data = await response.json()
        setDbStatus({
          status: 'success',
          message: data.status === 'OK' ? 'connected' : 'failed'
        })
      } catch (error) {
        setDbStatus({ status: 'error', message: 'failed' })
      }
    }

    testAPIHealth()
    testDatabase()
  }, [])

  const getStatusColor = (status) => {
    if (status === 'loading') return 'text-yellow-500'
    if (status === 'success') return 'text-green-500'
    return 'text-red-500'
  }

  return (
    <div className="dark min-h-screen bg-background p-16">
      <div className="mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Tri-Meter Test
          </h1>
        </div>

        {/* Status Card */}
        <div className="border border-border rounded-3xl p-8 bg-card max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Test API Status</h2>
          <hr className="border-border mb-4 w-full" />
          <div className="space-y-4">
            <StatusItem
              label="Frontend"
              status="Ready"
              color="text-green-500"
            />
            <StatusItem
              label="Backend API"
              status={healthStatus.message || 'Loading...'}
              color={getStatusColor(healthStatus.status)}
            />
            <StatusItem
              label="Database"
              status={dbStatus.message || 'Loading...'}
              color={getStatusColor(dbStatus.status)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setCount(count + 1)}>
            Primary Button ({count})
          </Button>
          <Button variant="secondary">
            Secondary Button
          </Button>
          <Button variant="destructive">
            Destructive Button
          </Button>
        </div>

        {/* Footer with Logos */}
        <div className="flex flex-col items-center gap-6 pt-20">
          <div className="flex gap-4">
            <img src={viteLogo} alt="Vite logo" className="h-20 w-20" />
            <img src={reactLogo} alt="React logo" className="h-20 w-20" />
          </div>
          <p className="text-sm text-muted-foreground">
            This Vite + React template was created by{' '}
            <a
              href="https://github.com/dwainXDL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @dwainXDL
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function StatusItem({ label, status, color }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-foreground font-bold">{label}</span>
      <span className={`text-sm font-medium ${color} uppercase`}>{status}</span>
    </div>
  )
}

export default Test
