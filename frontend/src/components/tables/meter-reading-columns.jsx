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
          className="-ml-4"
        >
          Meter
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("meterNumber")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("value")}</div>
    ),
  },
  {
    accessorKey: "previousValue",
    header: "Previous Value",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("previousValue")}</div>
    ),
  },
  {
    accessorKey: "consumption",
    header: "Consump.",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("consumption")}</div>
    ),
  },
  {
    accessorKey: "tampered",
    header: "Tampered",
    cell: ({ row }) => {
      const tampered = row.getValue("tampered")
      return tampered ? (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
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
      <div className="text-muted-foreground">{row.getValue("fieldOfficer")}</div>
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
    accessorKey: "month",
    header: "Month",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("month")}</div>
    ),
    filterFn: "multiSelect",
  },
  {
    id: "actions",
    header: () => <div className="text-center w-20">Actions</div>,
    cell: ({ row }) => {
      const reading = row.original
      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground" aria-label="Open menu">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onViewDetails(reading)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(reading)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-700"
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

// Keep old export for backwards compatibility (static version without actions)
export const meterReadingColumns = createMeterReadingColumns(() => {}, () => {}, () => {})
