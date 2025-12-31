import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { activityColumns } from "@/components/activity-columns"
import { SidebarProvider } from "@/components/ui/sidebar"
import data from "@/app/dashboard/data.json"
import { Heart } from "lucide-react"

export default function Dashboard() {
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
                  Welcome back, Dwain Dias!
                </p>
              </div>

              <SectionCards />

              <ChartAreaInteractive />

              <div className="border rounded-lg bg-card">
                <div className="p-6">
                  <p className="text-lg font-normal">Recent Activity</p>
                  <p className="text-sm text-muted-foreground pb-3"> System logs </p>
                  <div className="overflow-x-auto px-6">
                    <DataTable
                      columns={activityColumns}
                      data={data}
                      filterColumn="header"
                      filterPlaceholder="Search"
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
