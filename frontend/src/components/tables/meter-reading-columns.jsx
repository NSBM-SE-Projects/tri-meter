import { ArrowUpDown, MoreHorizontal, AlertTriangle } from "lucide-react"
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components"

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

export const createMeterReadingColumns = (onViewDetails, onEdit, onDelete) => [
  {
    accessorKey: "meterNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Meter
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-normal pl-4">{row.getValue("meterNumber")}</div>,
  },
  {
    accessorKey: "month",
    header: "Period",
    cell: ({ row }) => (
      <div className="font-normal">{row.getValue("month")}</div>
    ),
    filterFn: "multiSelect",
  },
  {
    accessorKey: "consumption",
    header: "Consumption",
    cell: ({ row }) => (
      <div className="font-normal">{row.getValue("consumption")}</div>
    ),
  },
  {
    accessorKey: "tampered",
    header: "Tampered",
    cell: ({ row }) => {
      const tampered = row.getValue("tampered")
      return tampered ? (
        <Badge variant="destructive" className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="w-5 h-5" />
          Yes
        </Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      )
    },
  },
  {
    accessorKey: "fieldOfficer",
    header: "Field Officer",
    cell: ({ row }) => (
      <div className="font-normal">{row.getValue("fieldOfficer")}</div>
    ),
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
    filterFn: "multiSelect",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const reading = row.original
      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0" aria-label="Open menu">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onViewDetails(reading)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(reading)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(reading)}
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

// Backwards compatibility
export const meterReadingColumns = createMeterReadingColumns(() => {}, () => {}, () => {})
