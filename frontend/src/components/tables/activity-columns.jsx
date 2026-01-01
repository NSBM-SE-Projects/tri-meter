import { ArrowUpDown } from "lucide-react"
import { Button, Badge } from "@/components"

export const activityColumns = [
  {
    accessorKey: "activityType",
    header: () => <div className="pl-4">Type</div>,
    cell: ({ row }) => (
      <div className="pl-4">
        <Badge variant="outline" className="text-xs">
          {row.getValue("activityType")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "activityDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("activityDate"))
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "performedBy",
    header: "Performed By",
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("performedBy")}</span>
    },
  },
]
