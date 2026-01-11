import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

const getUtilityTypeBadgeColor = (type) => {
  switch (type) {
    case "Electricity":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    case "Water":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
    case "Gas":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export const revenueColumns = [
  {
    accessorKey: 'yearMonth',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Month
        <ArrowUpDown className="w-4 h-4 ml-1" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="pl-4 font-normal">{row.getValue("yearMonth")}</div>
    ),
  },
  {
    accessorKey: 'utilityType',
    header: 'Utility',
    cell: ({ row }) => {
      const utility = row.getValue('utilityType')
      return (
        <Badge variant="outline" className={getUtilityTypeBadgeColor(utility)}>
          {utility}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'billCount',
    header: "Bill Count"
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
    accessorKey: 'outstandingAmount',
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
      const amount = parseFloat(row.getValue('outstandingAmount'))
      const color = amount > 1000 ? 'text-red-600 pl-4' : 'text-orange-600 pl-4'
      return <div className={`font-medium ${color}`}>${amount.toFixed(2)}</div>
    },
  },
]
