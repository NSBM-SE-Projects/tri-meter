import { useEffect, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/data-table'
import { customerSummaryColumns } from '@/components/tables/customer-summary-columns'
import { getCustomerBillingSummary } from '@/services/reportService'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export default function CustomerReport() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [customerTypeFilter, setCustomerTypeFilter] = useState('All')

  useEffect(() => {
    fetchData()
  }, [customerTypeFilter])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await getCustomerBillingSummary({
        customerType: customerTypeFilter
      })
      setData(result)
    } catch (error) {
      console.error('Failed to fetch customer summary:', error)
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

  if (!data || data.customers.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No customer data found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Billing Summary</h2>
        <div className="flex items-center gap-2">
          <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Customer Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Household">Household</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
            </SelectContent>
          </Select>
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
            <CardDescription className="text-sm">Total Customers</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatNumber(data.summary.totalCustomers)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Registered accounts
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Total Billed</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatCurrency(data.summary.totalBilled)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              All invoices issued
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
              Payments received
            </div>
          </CardFooter>
        </Card>
        <Card className="bg-background dark:bg-neutral-900 shadow-base">
          <CardHeader className="relative pb-2">
            <CardDescription className="text-sm">Total Outstanding</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
              {formatCurrency(data.summary.totalOutstanding)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
            <div className="text-muted-foreground line-clamp-1">
              Awaiting payment
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Table (NO CHART for this report) */}
      <div className="border rounded-lg bg-card">
        <div className="p-6">
          <p className="text-lg font-medium">Customer Details</p>
          <p className="pb-3 text-sm text-muted-foreground">All columns are sortable</p>
          <DataTable
            columns={customerSummaryColumns}
            data={data.customers}
            filterColumn="customerName"
            filterPlaceholder="Search customers..."
          />
        </div>
      </div>
    </div>
  )
}
