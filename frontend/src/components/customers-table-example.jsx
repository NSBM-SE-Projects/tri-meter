import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"

// Sample customer data
const sampleCustomers = [
  {
    id: "C001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "0771234567",
    address: "123 Main St, Colombo",
    status: "active",
    balance: -1250.50,
  },
  {
    id: "C002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "0777654321",
    address: "456 Galle Rd, Galle",
    status: "active",
    balance: 0,
  },
  {
    id: "C003",
    name: "Bob Wilson",
    email: "bob.w@email.com",
    phone: "0712345678",
    address: "789 Kandy Rd, Kandy",
    status: "inactive",
    balance: -3400.00,
  },
  {
    id: "C004",
    name: "Alice Brown",
    email: "alice.brown@email.com",
    phone: "0769876543",
    address: "321 Temple Rd, Negombo",
    status: "active",
    balance: -500.00,
  },
  {
    id: "C005",
    name: "Charlie Davis",
    email: "c.davis@email.com",
    phone: "0778765432",
    address: "654 Beach Rd, Matara",
    status: "suspended",
    balance: -8900.75,
  },
]

// Column definitions
export const customerColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Customer ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "suspended"
              ? "destructive"
              : "secondary"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("balance"))
      const formatted = new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
      }).format(Math.abs(balance))

      return (
        <div
          className={`text-right font-medium ${
            balance < 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {balance < 0 ? `-${formatted}` : formatted}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>View bills</DropdownMenuItem>
            <DropdownMenuItem>View payments</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Example component usage
export function CustomersTableExample() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <DataTable
        columns={customerColumns}
        data={sampleCustomers}
        filterColumn="name"
        filterPlaceholder="Filter by name..."
      />
    </div>
  )
}
