import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Electricity Tariff Columns
 * Columns: Plan Name, Valid From, Slabs, Date (Last Modified), Actions
 */
export const createElectricityTariffColumns = (onEdit, onDelete) => [
  {
    accessorKey: "planName",
    header: ({ column }) => {
      return (
        <div className="pl-4">
          Plan Name
        </div>
      )
    },
    cell: ({ row }) => <div className="font-normal pl-4">{row.getValue("planName")}</div>,
  },
  {
    accessorKey: "validFrom",
    header: "Valid From",
    cell: ({ row }) => <div>{row.getValue("validFrom")}</div>,
  },
  {
    accessorKey: "slabs",
    header: "Slabs",
    cell: ({ row }) => <div>{row.getValue("slabs")}</div>,
  },
  {
    accessorKey: "validTo",
    header: "Valid To",
    cell: ({ row }) => <div>{row.getValue("validTo")}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const tariff = row.original

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
              onClick={() => onEdit(tariff)}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(tariff)}
              className="cursor-pointer text-red-600"
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

/**
 * Water Tariff Columns
 * Columns: Plan Name, Rate, Fixed, Date, Actions
 */
export const createWaterTariffColumns = (onEdit, onDelete) => [
  {
    accessorKey: "planName",
    header: ({ column }) => {
      return (
        <div className="pl-4">
          Plan Name
        </div>
      )
    },
    cell: ({ row }) => <div className="font-normal pl-4">{row.getValue("planName")}</div>,
  },
  {
    accessorKey: "flatRate",
    header: "Rate",
    cell: ({ row }) => <div>${row.getValue("flatRate")}</div>,
  },
  {
    accessorKey: "fixedCharge",
    header: "Fixed",
    cell: ({ row }) => <div>${row.getValue("fixedCharge")}</div>,
  },
  {
    accessorKey: "validFrom",
    header: "Valid From",
    cell: ({ row }) => <div>{row.getValue("validFrom")}</div>,
  },
  {
    accessorKey: "validTo",
    header: "Valid To",
    cell: ({ row }) => <div>{row.getValue("validTo")}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const tariff = row.original

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
              onClick={() => onEdit(tariff)}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(tariff)}
              className="cursor-pointer text-red-600"
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

/**
 * Gas Tariff Columns
 * Columns: Plan Name, Slabs, Subsidy, Date, Actions
 */
export const createGasTariffColumns = (onEdit, onDelete) => [
  {
    accessorKey: "planName",
    header: ({ column }) => {
      return (
        <div className="pl-4">
          Plan Name
        </div>
      )
    },
    cell: ({ row }) => <div className="font-normal pl-4">{row.getValue("planName")}</div>,
  },
  {
    accessorKey: "slabs",
    header: "Slabs",
    cell: ({ row }) => <div>{row.getValue("slabs")}</div>,
  },
  {
    accessorKey: "subsidyAmount",
    header: "Subsidy",
    cell: ({ row }) => <div>${row.getValue("subsidyAmount")}</div>,
  },
  {
    accessorKey: "validFrom",
    header: "Valid From",
    cell: ({ row }) => <div>{row.getValue("validFrom")}</div>,
  },
  {
    accessorKey: "validTo",
    header: "Valid To",
    cell: ({ row }) => <div>{row.getValue("validTo")}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const tariff = row.original

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
              onClick={() => onEdit(tariff)}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(tariff)}
              className="cursor-pointer text-red-600"
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
