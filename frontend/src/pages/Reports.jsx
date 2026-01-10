import { useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SiteHeader } from '@/components/layout/site-header'
import ReportTypeSelector from '@/components/reports/report-type-selector'
import UnpaidBillsReport from '@/components/reports/unpaid-bills-report'
import RevenueReport from '@/components/reports/revenue-report'
import CustomerReport from '@/components/reports/customer-report'
import TopConsumersReport from '@/components/reports/top-consumers-report'

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('unpaid-bills')

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <SiteHeader />
          <main className="flex-1 p-7">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                  Generate insights and view summaries
                </p>
              </div>

              {/* Report Type Selector */}
              <ReportTypeSelector
                selectedReport={selectedReport}
                onSelectReport={setSelectedReport}
              />

              {/* Separator */}
              <div className="border-t" />

              {/* Report Content (conditional rendering) */}
              {selectedReport === 'unpaid-bills' && <UnpaidBillsReport />}
              {selectedReport === 'revenue' && <RevenueReport />}
              {selectedReport === 'customer' && <CustomerReport />}
              {selectedReport === 'top-consumers' && <TopConsumersReport />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
