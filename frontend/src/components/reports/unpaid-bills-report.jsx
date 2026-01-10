import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/data-table'
import { unpaidBillsColumns } from '@/components/tables/unpaid-bills-columns'
import { getUnpaidBillsSummary } from '@/services/reportService'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export default function UnpaidBillsReport() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [utilityFilter, setUtilityFilter] = useState('All')
  const [daysOverdueFilter, setDaysOverdueFilter] = useState('All')

  useEffect(() => {
    fetchData()
  }, [utilityFilter, daysOverdueFilter])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await getUnpaidBillsSummary({
        utilityType: utilityFilter
      })

      // Apply days overdue filter (frontend filtering)
      let filteredBills = result.bills
      if (daysOverdueFilter !== 'All') {
        filteredBills = result.bills.filter(bill => {
          const days = bill.daysOverdue
          if (daysOverdueFilter === '0-30') return days >= 0 && days <= 30
          if (daysOverdueFilter === '31-60') return days >= 31 && days <= 60
          if (daysOverdueFilter === '60+') return days > 60
          return true
        })
      }

      setData({ ...result, bills: filteredBills })
    } catch (error) {
      console.error('Failed to fetch unpaid bills:', error)
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

  if (!data || data.bills.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No unpaid bills found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Unpaid Bills Summary</h2>
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
          <Select value={daysOverdueFilter} onValueChange={setDaysOverdueFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Days Overdue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Days</SelectItem>
              <SelectItem value="0-30">0-30 Days</SelectItem>
              <SelectItem value="31-60">31-60 Days</SelectItem>
              <SelectItem value="60+">60+ Days</SelectItem>
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
            <CardDescription className="text-sm">Total Unpaid Bills</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatNumber(data.summary.totalUnpaidBills)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Bills currently overdue
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Total Outstanding</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatCurrency(data.summary.totalAmount)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Amount owed by customers
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Avg Days Overdue</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatNumber(data.summary.avgDaysOverdue)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Average overdue period
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Unpaid Bills by Utility Type</CardTitle>
          <CardDescription>Distribution of overdue bills</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={{
              electricity: { label: 'Electricity', color: 'hsl(43, 96%, 56%)' },
              water: { label: 'Water', color: 'hsl(217, 91%, 60%)' },
              gas: { label: 'Gas', color: 'hsl(0, 84%, 60%)' },
            }}
            className="aspect-auto h-[275px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.chartData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                isAnimationActive={true}
                animationDuration={800}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="utilityType"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {data.chartData.map((entry, index) => {
                    const colors = {
                      Electricity: 'hsl(43, 96%, 56%)',
                      Water: 'hsl(217, 91%, 60%)',
                      Gas: 'hsl(0, 84%, 60%)',
                    }
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[entry.utilityType] || 'hsl(var(--chart-1))'}
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
          <p className="text-lg font-medium">Unpaid Bills Details</p>
          <p className="pb-3 text-sm text-muted-foreground">Defaulted customer list</p>
          <DataTable
            columns={unpaidBillsColumns}
            data={data.bills}
            filterColumn="customerName"
            filterPlaceholder="Search customers..."
          />
        </div>
      </div>
    </div>
  )
}
