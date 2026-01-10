import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export const customerSummaryColumns = [
  {
    accessorKey: 'customerId',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Customer ID
        <ArrowUpDown className="w-4 h-4 ml-1" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="pl-4 font-normal">{row.getValue("customerId")}</div>
    ),
  },
  {
    accessorKey: 'customerName',
    header: "Customer Name"
  },
  {
    accessorKey: 'customerType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('customerType')
      const colors = {
        Household: 'bg-blue-100 text-blue-800',
        Business: 'bg-purple-100 text-purple-800',
        Government: 'bg-green-100 text-green-800'
      }
      return (
        <Badge variant="outline" className={colors[type]}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'totalBilled',
    header: "Total Billed"
  },
  {
    accessorKey: 'totalPaid',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Total Paid
        <ArrowUpDown className="w-4 h-4 ml-1" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalPaid'))
      return <div className="font-medium text-green-600 pl-4">${amount.toFixed(2)}</div>
    },
  },
  {
    accessorKey: 'outstandingBalance',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Outstanding
        <ArrowUpDown className="w-4 h-4 ml-1" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('outstandingBalance'))
      const color = amount > 100 ? 'text-red-600 font-bold pl-4' : amount > 50 ? 'text-orange-600 font-semibold pl-4' : 'text-gray-600 pl-4'
      return <div className={color}>${amount.toFixed(2)}</div>
    },
  },
]
