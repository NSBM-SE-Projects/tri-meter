import { useAuth } from '@/context/AuthContext'
import { BlackStatCard } from '@/components/dashboard/black-stat-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChartAreaInteractive } from '@/components/charts/chart-area-interactive'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Settings2, Plus } from 'lucide-react'
import { mockElectricityUsage, mockCustomers } from '@/lib/mock-data'

export default function Dashboard() {
  const { user } = useAuth()

  // Generate revenue data from mock electricity usage
  const revenueData = mockElectricityUsage.map((item) => ({
    date: item.date,
    revenue: parseFloat((item.cost * 15).toFixed(2)), // Multiply to create realistic revenue numbers
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-0">
            <BlackStatCard title="Total customers" value="1,234" change={12} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <BlackStatCard title="Unpaid Bills" value="156" change={-5} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <BlackStatCard title="Revenue This Month" value="$45,678" change={8} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <BlackStatCard title="Active Meters" value="1,890" change={3} />
          </div>
        </div>

        {/* Revenue Trends Chart and Recent Activity Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Revenue Trends Chart */}
          <div className="flex-1">
            <ChartAreaInteractive data={revenueData} />
          </div>

          {/* Recent Activity */}
          <div className="lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Table */}
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Customize columns
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="rounded-md border w-full">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-1/6">Customer ID</TableHead>
                  <TableHead className="w-1/6">Name</TableHead>
                  <TableHead className="w-1/6">Type</TableHead>
                  <TableHead className="w-1/6">Consumption</TableHead>
                  <TableHead className="w-1/6">Amount</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.type}</TableCell>
                    <TableCell>{customer.consumption} kWh</TableCell>
                    <TableCell>${customer.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.status === 'Paid'
                            ? 'default'
                            : customer.status === 'Pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page 1 of 7</p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-4">
          Built by Tri-meter team
        </div>
      </div>
    </div>
  )
}
