import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/data-table'
import { revenueColumns } from '@/components/tables/revenue-columns'
import { getMonthlyRevenue } from '@/services/reportService'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export default function RevenueReport() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await getMonthlyRevenue({})
      setData(result)
    } catch (error) {
      console.error('Failed to fetch revenue:', error)
      toast.error('Failed to load report. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    toast.info('Export feature coming soon')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data || data.revenue.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No revenue data found.</p>
      </div>
    )
  }

  const chartConfig = {
    electricity: {
      label: 'Electricity',
      color: 'hsl(43, 96%, 56%)',
    },
    water: {
      label: 'Water',
      color: 'hsl(217, 91%, 60%)',
    },
    gas: {
      label: 'Gas',
      color: 'hsl(0, 84%, 60%)',
    },
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monthly Revenue</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Total Billed</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatCurrency(data.summary.totalBilled)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Billed this period
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Total Paid</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatCurrency(data.summary.totalPaid)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Payment received
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Outstanding</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatCurrency(data.summary.totalOutstanding)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Pending collection
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Collection Rate</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatNumber(data.summary.collectionRate)}%
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Payment percentage
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue by utility type</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[275px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                <defs>
                  <linearGradient id="fillElectricity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-electricity)" stopOpacity={1.0} />
                    <stop offset="95%" stopColor="var(--color-electricity)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-water)" stopOpacity={1.0} />
                    <stop offset="95%" stopColor="var(--color-water)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-gas)" stopOpacity={1.0} />
                    <stop offset="95%" stopColor="var(--color-gas)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                  minTickGap={32}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip />
                <Area
                  dataKey="electricity"
                  fill="url(#fillElectricity)"
                  stroke="var(--color-electricity)"
                  strokeWidth={2}
                  type="natural"
                />
                <Area
                  dataKey="water"
                  fill="url(#fillWater)"
                  stroke="var(--color-water)"
                  strokeWidth={2}
                  type="natural"
                />
                <Area
                  dataKey="gas"
                  fill="url(#fillGas)"
                  stroke="var(--color-gas)"
                  strokeWidth={2}
                  type="natural"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <div className="p-6">
          <p className="text-lg font-medium">Revenue Details</p>
          <p className="pb-3 text-sm text-muted-foreground">Monthly revenue breakdown by utility type</p>
          <DataTable
            columns={revenueColumns}
            data={data.revenue}
            filterColumn="yearMonth"
            filterPlaceholder="Search by month..."
          />
        </div>
      </div>
    </div>
  )
}
