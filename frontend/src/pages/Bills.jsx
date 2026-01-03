import { AppSidebar } from "@/components"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Filter, Eye, Printer, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { GenerateBillForm } from "@/components/forms/generate-bill-form"
import { BillDetailsDialog } from "@/components/dialogs/bill-details-dialog"
import { apiRequest } from "@/lib/api"

export default function Bills() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [utilityFilter, setUtilityFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isGenerateBillOpen, setIsGenerateBillOpen] = useState(false)
  const [isBillDetailsOpen, setIsBillDetailsOpen] = useState(false)
  const [selectedBillData, setSelectedBillData] = useState(null)
  const [billsData, setBillsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const itemsPerPage = 10

  // Fetch bills from API
  useEffect(() => {
    fetchBills()
  }, [statusFilter, utilityFilter, searchQuery])

  const fetchBills = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (utilityFilter !== 'all') params.append('utilityType', utilityFilter)
      if (searchQuery) params.append('search', searchQuery)

      const queryString = params.toString()
      const endpoint = queryString ? `/bills?${queryString}` : '/bills'

      const response = await apiRequest(endpoint)

      if (response.success) {
        setBillsData(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch bills:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredBills = billsData.filter(bill => {
    const matchesPeriod = periodFilter === "all" || bill.period === periodFilter
    return matchesPeriod
  })

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBills = filteredBills.slice(startIndex, endIndex)

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
      case "Unpaid":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"
      case "Partially Paid":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
    }
  }

  const handleViewBill = async (bill) => {
    try {
      const response = await apiRequest(`/bills/${bill.id}`)

      if (response.success) {
        setSelectedBillData(response.data)
        setIsBillDetailsOpen(true)
      }
    } catch (err) {
      console.error('Failed to fetch bill details:', err)
      alert('Failed to load bill details. Please try again.')
    }
  }

  const handlePrintBill = async (bill) => {
    try {
      const response = await apiRequest(`/bills/${bill.id}`)

      if (response.success) {
        setSelectedBillData(response.data)
        setIsBillDetailsOpen(true)

        // Trigger print after a short delay to allow dialog to render
        setTimeout(() => {
          window.print()
        }, 100)
      }
    } catch (err) {
      console.error('Failed to fetch bill details:', err)
      alert('Failed to load bill details for printing. Please try again.')
    }
  }

  const handleSendEmail = async (bill) => {
    try {
      const response = await apiRequest(`/bills/${bill.id}/send-email`, {
        method: 'POST'
      })

      if (response.success) {
        alert(response.message)
      }
    } catch (err) {
      console.error('Failed to send bill email:', err)
      alert('Failed to send bill email. Please try again.')
    }
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background overflow-x-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <SiteHeader />
          <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">
            <div className="space-y-4 sm:space-y-6 max-w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Bills</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Manage customer billing
                  </p>
                </div>
                <div className="flex pt-4 lg:pt-0 gap-2 w-full sm:w-auto">
                  <Button onClick={() => setIsGenerateBillOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Bill
                  </Button>
                </div>
              </div>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Bills List</CardTitle>
                  <CardDescription>
                    A list of all bills in the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search bills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 w-full sm:w-auto justify-center">
                          <Filter className="w-4 h-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="p-3 space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Utility</label>
                            <Select value={utilityFilter} onValueChange={setUtilityFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Electricity">Electricity</SelectItem>
                                <SelectItem value="Water">Water</SelectItem>
                                <SelectItem value="Gas">Gas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Period</label>
                            <Select value={periodFilter} onValueChange={setPeriodFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Dec 2024">Dec 2024</SelectItem>
                                <SelectItem value="Nov 2024">Nov 2024</SelectItem>
                                <SelectItem value="Oct 2024">Oct 2024</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table className="min-w-[800px] w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[80px]">ID</TableHead>
                          <TableHead className="min-w-[150px]">Name</TableHead>
                          <TableHead className="min-w-[100px]">Period</TableHead>
                          <TableHead className="min-w-[120px]">Consumption</TableHead>
                          <TableHead className="min-w-[100px]">Amount</TableHead>
                          <TableHead className="min-w-[100px]">Due Date</TableHead>
                          <TableHead className="min-w-[120px]">Status</TableHead>
                          <TableHead className="text-right min-w-[60px]">Act</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                              Loading bills...
                            </TableCell>
                          </TableRow>
                        ) : error ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-red-500 py-8">
                              Error: {error}
                            </TableCell>
                          </TableRow>
                        ) : paginatedBills.length > 0 ? (
                          paginatedBills.map((bill) => (
                            <TableRow key={bill.id}>
                              <TableCell className="font-medium">
                                {bill.billId}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">{bill.name}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {bill.period}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {bill.consumption} {bill.unit}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {bill.amount}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {bill.dueDate}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(bill.status)}>
                                  {bill.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewBill(bill)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handlePrintBill(bill)}>
                                      <Printer className="w-4 h-4 mr-2" />
                                      Print
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendEmail(bill)}>
                                      <Mail className="w-4 h-4 mr-2" />
                                      Send Email
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                              No bills found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center sm:justify-end">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </Button>
                    {[...Array(Math.min(3, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={i}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 sm:w-auto"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 3 && (
                      <>
                        <span className="px-1 sm:px-2 text-sm">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 sm:w-auto"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Generate Bill Form Dialog */}
      <GenerateBillForm
        open={isGenerateBillOpen}
        onOpenChange={setIsGenerateBillOpen}
        onSuccess={async (formData) => {
          try {
            // Generate the bill
            const response = await apiRequest('/bills', {
              method: 'POST',
              body: JSON.stringify({
                customerId: parseInt(formData.customer),
                serviceConnectionId: parseInt(formData.meterServiceConnection),
                periodFrom: formData.periodFrom.toISOString().split('T')[0],
                periodTo: formData.periodTo.toISOString().split('T')[0]
              })
            })

            if (response.success) {
              // Extract the bill ID from the response (e.g., "B-045" -> "45")
              const billId = response.data.billId.replace('B-', '')

              // Fetch full bill details
              const detailsResponse = await apiRequest(`/bills/${billId}`)

              if (detailsResponse.success) {
                setSelectedBillData(detailsResponse.data)
                setIsBillDetailsOpen(true)
                setIsGenerateBillOpen(false)

                // Refresh bills list
                fetchBills()
              }
            }
          } catch (err) {
            console.error('Failed to generate bill:', err)
            alert('Failed to generate bill. ' + err.message)
          }
        }}
      />

      {/* Bill Details Dialog */}
      <BillDetailsDialog
        open={isBillDetailsOpen}
        onOpenChange={setIsBillDetailsOpen}
        billData={selectedBillData}
        onSendEmail={async () => {
          if (selectedBillData) {
            const billId = selectedBillData.billId.replace('B-', '')
            try {
              const response = await apiRequest(`/bills/${billId}/send-email`, {
                method: 'POST'
              })
              if (response.success) {
                alert(response.message)
              }
            } catch (err) {
              console.error('Failed to send bill email:', err)
              alert('Failed to send bill email. Please try again.')
            }
          }
        }}
      />
    </SidebarProvider>
  )
}
