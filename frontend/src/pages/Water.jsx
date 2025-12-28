import { Droplet, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ChartCard } from '@/components/charts/chart-card'
import { UsageLineChart } from '@/components/charts/usage-line-chart'
import { mockWaterUsage, currentMonthStats } from '@/lib/mock-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function Water() {
  const stats = currentMonthStats.water
  const avgDaily = (stats.current / 30).toFixed(2)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Droplet className="text-blue-500" />
          Water Monitoring
        </h1>
        <p className="text-muted-foreground">Detailed water usage and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Current Month"
          value={stats.current}
          unit="m³"
          change={stats.percentChange}
          icon={Droplet}
        />
        <StatsCard title="Average Daily" value={avgDaily} unit="m³/day" icon={TrendingUp} />
        <StatsCard
          title="Monthly Cost"
          value={`$${stats.cost.toFixed(2)}`}
          unit=""
          icon={Droplet}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4">
        <ChartCard
          title="30-Day Usage Trend"
          description="Daily water consumption over the past month"
        >
          <UsageLineChart
            data={mockWaterUsage}
            dataKeys={[{ dataKey: 'usage', name: 'Usage (m³)' }]}
            colors={['hsl(var(--chart-2))']}
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
              <TableHead>Usage (m³)</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWaterUsage.slice(-10).reverse().map((reading) => {
              const isHigh = reading.usage > 4.5
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
