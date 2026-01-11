import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/data-table'
import { topConsumersColumns } from '@/components/tables/top-consumers-columns'
import { getTopConsumers } from '@/services/reportService'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export default function TopConsumersReport() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [utilityFilter, setUtilityFilter] = useState('All')
  const [limitFilter, setLimitFilter] = useState('10')

  useEffect(() => {
    fetchData()
  }, [utilityFilter, limitFilter])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await getTopConsumers({
        utilityType: utilityFilter,
        limit: limitFilter
      })
      setData(result)
    } catch (error) {
      console.error('Failed to fetch top consumers:', error)
      toast.error('Failed to load report. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    toast.info('Export feature coming soon')
  }

  // Calculate chart height dynamically (40px per row + padding)
  const chartHeight = Math.max(275, (data?.chartData?.length || 10) * 40 + 40)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data || data.consumers.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No consumer data found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top Consumers</h2>
        <div className="flex items-center gap-2">
          <Select value={utilityFilter} onValueChange={setUtilityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Utility Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Utilities</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
              <SelectItem value="Water">Water</SelectItem>
              <SelectItem value="Gas">Gas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={limitFilter} onValueChange={setLimitFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
              <SelectItem value="50">Top 50</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Total Consumers</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatNumber(data.summary.totalConsumers)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              High consumption accounts
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Total Consumption</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatNumber(data.summary.totalConsumption.toFixed(2))}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Combined usage
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Avg Consumption</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatNumber(data.summary.avgConsumption.toFixed(2))}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Average per account
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Horizontal Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Consumers by Consumption</CardTitle>
          <CardDescription>Ranked by total consumption ({data?.chartData?.length || 0} consumers)</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={{
              household: { label: 'Household', color: 'hsl(217, 91%, 60%)' },
              business: { label: 'Business', color: 'hsl(271, 91%, 65%)' },
              government: { label: 'Government', color: 'hsl(142, 76%, 36%)' },
            }}
            className="aspect-auto w-full"
            style={{ height: `${chartHeight}px` }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.chartData}
                layout="vertical"
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                isAnimationActive={true}
                animationDuration={800}
              >
                <CartesianGrid vertical={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="customerName"
                  type="category"
                  width={150}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip />
                <Bar dataKey="consumption" radius={[0, 8, 8, 0]}>
                  {data.chartData.map((entry, index) => {
                    const colors = {
                      Household: 'hsl(217, 91%, 60%)',
                      Business: 'hsl(271, 91%, 65%)',
                      Government: 'hsl(142, 76%, 36%)',
                    }
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[entry.customerType] || 'hsl(var(--chart-1))'}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <div className="p-6">
          <p className="text-lg font-medium">Consumer Details</p>
          <p className="pb-3 text-sm text-muted-foreground">High consumption accounts</p>
          <DataTable
            columns={topConsumersColumns}
            data={data.consumers}
            filterColumn="customerName"
            filterPlaceholder="Search consumers..."
          />
        </div>
      </div>
    </div>
  )
}
