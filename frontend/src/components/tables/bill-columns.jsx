import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components"

const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
    case "Unpaid":
      return "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"
    case "PartiallyPaid":
      return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
  }
}

export const createBillColumns = (onView, onPrint, onSendEmail) => [
  {
    accessorKey: "billId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bill ID
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="pl-4 font-normal">{row.getValue("billId")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div>Customer</div>,
    cell: ({ row }) => <div className="font-normal">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "period",
    header: () => <div className="pl-4">Period</div>,
    cell: ({ row }) => <div className="pl-4 font-normal text-muted-foreground">{row.getValue("period")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("amount")}</div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("dueDate")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      // Add space for "Partially Paid"
      const displayStatus = status === "PartiallyPaid" ? "Partially Paid" : status
      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {displayStatus}
        </Badge>
      )
    },
    filterFn: "multiSelect",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const bill = row.original
      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground"
                aria-label="Open menu"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onView(bill)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint(bill)}>
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSendEmail(bill)}>
                Send Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

// backwards compatibility
export const billColumns = createBillColumns(() => {}, () => {}, () => {})
