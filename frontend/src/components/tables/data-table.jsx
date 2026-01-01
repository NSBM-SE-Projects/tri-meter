"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, ChevronLeft, ChevronRight, Filter, ChevronDown } from "lucide-react"

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Badge,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components"

/**
 * Reusable DataTable component with TanStack Table
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions (TanStack Table format)
 * @param {Array} props.data - Data array
 * @param {string} props.filterColumn - Column key to filter by (optional)
 * @param {string} props.filterPlaceholder - Placeholder for filter input (optional)
 * @param {Array} props.filterConfig - Filter configuration array (optional)
 *   Example: [{ id: 'type', label: 'Customer Type', options: ['Household', 'Business'] }]
 * @param {boolean} props.showColumnToggle - Show filter dropdown (default: true)
 * @param {boolean} props.showPagination - Show pagination controls (default: true)
 */
export function DataTable({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter...",
  filterConfig = [],
  showColumnToggle = true,
  showPagination = true,
}) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeFilters, setActiveFilters] = React.useState({})

  // Apply filters
  React.useEffect(() => {
    const filters = Object.entries(activeFilters)
      .filter(([_, values]) => values.length > 0)
      .map(([id, values]) => ({ id, value: values }))
    setColumnFilters(filters)
  }, [activeFilters])

  const toggleFilter = (filterId, value) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [filterId]: updated }
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
  }

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, values) => sum + values.length,
    0
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    filterFns: {
      multiSelect: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true
        return filterValue.includes(row.getValue(columnId))
      },
    },
  })

  return (
    <div className="w-full">
      {(filterColumn || showColumnToggle) && (
        <div className="flex items-center py-4 gap-2">
          {filterColumn && (
            <div className="relative w-72 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={filterPlaceholder}
                value={(table.getColumn(filterColumn)?.getFilterValue()) ?? ""}
                onChange={(event) =>
                  table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                }
                className="w-full pl-9"
              />
            </div>
          )}
          {showColumnToggle && filterConfig.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto relative">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  {totalActiveFilters > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {totalActiveFilters}
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                {filterConfig.map((filter, index) => (
                  <React.Fragment key={filter.id}>
                    <DropdownMenuLabel className="text-xs uppercase text-muted-foreground font-semibold text-center">
                      {filter.label}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-1 py-1.5 space-y-0">
                      {filter.options.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option}
                          checked={(activeFilters[filter.id] || []).includes(option)}
                          onCheckedChange={() => toggleFilter(filter.id, option)}
                          className="cursor-pointer"
                        >
                          {option}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                    {index < filterConfig.length - 1 && <DropdownMenuSeparator />}
                  </React.Fragment>
                ))}

                {totalActiveFilters > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader className="bg-neutral-300 dark:bg-neutral-900 text-normal">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-neutral-900 dark:text-neutral-100">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-neutral-900 dark:text-neutral-300 h-14"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
