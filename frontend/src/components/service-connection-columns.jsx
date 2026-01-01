import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "Disconnected":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    case "Pending":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export const createServiceConnectionColumns = (onViewDetails, onEdit, onDelete) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("customerName")}</div>,
  },
  {
    accessorKey: "utilityType",
    header: "Utility Type",
    cell: ({ row }) => {
      const utilityType = row.getValue("utilityType")
      return (
        <Badge variant="outline" className={getUtilityTypeBadgeColor(utilityType)}>
          {utilityType}
        </Badge>
      )
    },
  },
  {
    accessorKey: "meterNumber",
    header: "Meter Number",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("meterNumber")}</div>
    ),
  },
  {
    accessorKey: "installationDate",
    header: "Installation Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("installationDate")}</div>
    ),
  },
  {
    accessorKey: "tariffPlan",
    header: "Tariff Plan",
    cell: ({ row }) => <div>{row.getValue("tariffPlan")}</div>,
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
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const connection = row.original

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(connection)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(connection)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(connection)}
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

// Keep backward compatibility
export const serviceConnectionColumns = createServiceConnectionColumns(
  () => {},
  () => {},
  () => {}
)
