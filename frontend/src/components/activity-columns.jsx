import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const activityColumns = [
  {
    accessorKey: "header",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("header")}</div>,
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline" className="text-xs">
          {row.getValue("type")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <div className="text-center">
        <Badge
          variant={status === "Done" ? "default" : "secondary"}
        >
          {status}
        </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const reviewer = row.getValue("reviewer")
      return reviewer === "Assign reviewer" ? (
        <span className="text-muted-foreground text-sm">{reviewer}</span>
      ) : (
        <span className="text-sm">{reviewer}</span>
      )
    },
  },
]
