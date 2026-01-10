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

export const topConsumersColumns = [
  {
    accessorKey: 'rank',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rank = row.getValue('rank')
      let medal = ''
      if (rank === 1) medal = '🥇'
      else if (rank === 2) medal = '🥈'
      else if (rank === 3) medal = '🥉'

      if (medal !== '') {
        return (
          <div className="flex items-center gap-1 font-semibold pl-3 text-2xl">
            {medal}
          </div>
        )
      } else
      {
        return (
          <div className="flex items-center gap-1 font-semibold pl-4">
            {rank}
          </div>
        )
      }
    },
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Customer Name
        <ArrowUpDown className="w-4 h-4 ml-1" />
      </Button>
    ),
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
    accessorKey: 'totalConsumption',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Total Consumption
        <ArrowUpDown className="w-4 h-4 ml-1" />
      </Button>
    ),
    cell: ({ row }) => {
      const consumption = parseFloat(row.getValue('totalConsumption'))
      const unit = row.original.unit
      return (
        <div className="font-medium pl-4">
          {consumption.toFixed(2)} {unit}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Amount
        <ArrowUpDown className="w-4 h-4 ml-1" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'))
      return <div className="font-medium pl-4">${amount.toFixed(2)}</div>
    },
  },
]
