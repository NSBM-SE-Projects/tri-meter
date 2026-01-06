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
    case "Active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "Inactive":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    case "Pending":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export const createCustomerColumns = (onViewDetails, onEdit) => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="pl-4 font-normal">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div>Name</div>,
    cell: ({ row }) => <div className="font-normal">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: () => <div className="pl-4">Type</div>,
    cell: ({ row }) => <div className="pl-4">{row.getValue("type")}</div>,
    filterFn: "multiSelect",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("phone")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
    filterFn: "multiSelect",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground" aria-label="Open menu">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

// Keep old export for backwards compatibility (static version without actions)
export const customerColumns = createCustomerColumns(() => {}, () => {})
