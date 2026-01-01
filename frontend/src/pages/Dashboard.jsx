import { useState, useEffect } from "react"
import {
  AppSidebar,
  SiteHeader,
  SectionCards,
  ChartAreaInteractive,
  DataTable,
  activityColumns,
  SidebarProvider,
} from "@/components"
import { Heart, Loader2 } from "lucide-react"
import { getDashboardStats, getRecentActivity } from "@/services/dashboardService"
import { useAuth } from "@/context/AuthContext"

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [activityData, setActivityData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const [statsData, activityLogs] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ])
        setStats(statsData)
        setActivityData(activityLogs)
      } catch (err) {
        console.error('DATABASE DATA ERROR:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex w-full min-h-screen bg-background">
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <SiteHeader />
            <main className="flex-1 p-7 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex w-full min-h-screen bg-background">
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <SiteHeader />
            <main className="flex-1 p-7">
              <div className="text-center text-destructive">
                Error loading dashboard: {error}...
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-7">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.fullName || user?.username || 'User'}!
                </p>
              </div>

              <SectionCards stats={stats} />

              <ChartAreaInteractive />

              <div className="border rounded-lg bg-card">
                <div className="p-6">
                  <p className="text-lg font-normal">Recent Activity</p>
                  <p className="text-sm text-muted-foreground pb-3"> System logs </p>
                  <div className="overflow-x-auto px-6">
                    <DataTable
                      columns={activityColumns}
                      data={activityData}
                      filterColumn="description"
                      filterPlaceholder="Search activity..."
                      showColumnToggle={false}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center text-muted-foreground text-sm pt-1 lg:pt-1">
                  Made with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> by the Tri-Meter team
              </div>  
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
