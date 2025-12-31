import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SidebarProvider } from "@/components/ui/sidebar"
import data from "@/app/dashboard/data.json"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome to your Tri-Meter dashboard
                </p>
              </div>

              <SectionCards />

              <ChartAreaInteractive />

              <div className="rounded-lg border bg-card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <DataTable data={data} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
