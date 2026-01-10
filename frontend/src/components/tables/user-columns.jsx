import { MoreHorizontal, Eye, Pencil, Key, UserX, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
  Button
} from "@/components"

// Role badge colors
const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Cashier':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Field Officer':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Manager':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Status badge colors
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Working':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'On Leave':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Resigned':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export const createUserColumns = (onViewDetails, onEdit, onResetPassword, onDeactivate) => [
  {
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User ID
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-normal pl-4">{row.getValue("userId")}</div>,
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    filterFn: "multiSelect",
    cell: ({ row }) => {
      const role = row.getValue("role")
      return (
        <Badge variant="outline" className={getRoleBadgeColor(role)}>
          {role}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "multiSelect",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <Badge variant="outline" className={getStatusBadgeColor(status)}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => onViewDetails(user)}
                className="cursor-pointer"
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(user)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onResetPassword(user)}
                className="cursor-pointer"
              >
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeactivate(user)}
                className="cursor-pointer text-red-600"
                disabled={user.status === 'Resigned'}
              >
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
