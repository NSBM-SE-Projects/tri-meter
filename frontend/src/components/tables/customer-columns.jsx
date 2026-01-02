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
      return "bg-green-600/25 text-green-500 hover:bg-green-600/40"
    case "Inactive":
      return "bg-red-600/25 text-red-500 hover:bg-red-600/40"
    case "Pending":
      return "bg-yellow-600/25 text-yellow-500 hover:bg-yellow-600/40"
    default:
      return "bg-gray-600/25 text-gray-500 hover:bg-gray-600/40"
  }
}

export const createCustomerColumns = (onViewDetails, onEdit, onDelete) => [
  {
    accessorKey: "id",
    header: () => <div className="pl-4">ID</div>,
    cell: ({ row }) => (
      <div className="font-normal pl-4">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
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
    header: () => <div className="text-center w-20">Actions</div>,
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground" aria-label="Open menu">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-700"
                onClick={() => onDelete(customer)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

// Keep old export for backwards compatibility (static version without actions)
export const customerColumns = createCustomerColumns(() => {}, () => {}, () => {})
