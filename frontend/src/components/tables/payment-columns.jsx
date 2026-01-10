import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

export function createPaymentColumns(onView, onPrint) {
  return [
    {
      accessorKey: "paymentId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payment ID
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
          )
      },
      cell: ({ row }) =>
        <div className="pl-4 font-normal">{row.getValue("paymentId")}</div>,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "billId",
      header: "Bill ID",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">{row.getValue("amount")}</span>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("method")
        const variants = {
          Cash: "default",
          Card: "secondary",
          Online: "outline",
          Cheque: "outline"
        }
        return <Badge variant={variants[method] || "default"}>{method}</Badge>
      },
    },
    {
      accessorKey: "paymentDate",
      header: "Date",
    },
    {
      accessorKey: "cashierName",
      header: "Cashier",
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const payment = row.original

        return (
          <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onView(payment)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint(payment)}>
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
