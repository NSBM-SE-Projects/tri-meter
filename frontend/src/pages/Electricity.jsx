import { Zap, TrendingUp, Clock } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ChartCard } from '@/components/charts/chart-card'
import { UsageLineChart } from '@/components/charts/usage-line-chart'
import { UsageAreaChart } from '@/components/charts/usage-area-chart'
import { mockElectricityUsage, mockElectricityHourly, currentMonthStats } from '@/lib/mock-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function Electricity() {
  const stats = currentMonthStats.electricity
  const avgDaily = (stats.current / 30).toFixed(2)
  const peakHours = mockElectricityHourly.filter((h) => h.isPeak)
  const avgPeakUsage = (
    peakHours.reduce((sum, h) => sum + h.usage, 0) / peakHours.length
  ).toFixed(2)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="text-yellow-500" />
          Electricity Monitoring
        </h1>
        <p className="text-muted-foreground">Detailed electricity usage and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Current Month"
          value={stats.current}
          unit="kWh"
          change={stats.percentChange}
          icon={Zap}
        />
        <StatsCard
          title="Average Daily"
          value={avgDaily}
          unit="kWh/day"
          icon={TrendingUp}
        />
        <StatsCard
          title="Peak Hours Avg"
          value={avgPeakUsage}
          unit="kWh/hour"
          icon={Clock}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4">
        <ChartCard
          title="30-Day Usage Trend"
          description="Daily electricity consumption over the past month"
        >
          <UsageLineChart
            data={mockElectricityUsage}
            dataKeys={[{ dataKey: 'usage', name: 'Usage (kWh)' }]}
            colors={['hsl(var(--chart-1))']}
          />
        </ChartCard>

        <ChartCard
          title="Hourly Breakdown (Today)"
          description="Usage patterns throughout the day"
        >
          <UsageAreaChart
            data={mockElectricityHourly}
            dataKeys={[{ dataKey: 'usage', name: 'Usage (kWh)' }]}
            colors={['hsl(var(--chart-1))']}
          />
        </ChartCard>
      </div>

      {/* Recent Readings Table */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Recent Daily Readings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Usage (kWh)</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockElectricityUsage.slice(-10).reverse().map((reading) => {
              const isHigh = reading.usage > 30
              return (
                <TableRow key={reading.date}>
                  <TableCell>{reading.date}</TableCell>
                  <TableCell>{reading.usage}</TableCell>
                  <TableCell>${reading.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={isHigh ? 'destructive' : 'default'}>
                      {isHigh ? 'High' : 'Normal'}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
