import { AppSidebar } from "@/components/app-sidebar"
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
import { useState } from "react"
import { GenerateBillForm } from "@/components/forms/generate-bill-form"
import { BillDetailsDialog } from "@/components/dialogs/bill-details-dialog"

// Sample bills data
const billsData = [
  {
    id: "B-001",
    customerName: "John S.",
    period: "Dec 2024",
    amount: "$45.00",
    dueDate: "Jan 10",
    status: "Unpaid",
    utilityType: "Electricity",
  },
  {
    id: "B-002",
    customerName: "Jane Doe",
    period: "Dec 2024",
    amount: "$32.50",
    dueDate: "Jan 10",
    status: "Paid",
    utilityType: "Water",
  },
  {
    id: "B-003",
    customerName: "ABC Corp",
    period: "Dec 2024",
    amount: "$120.00",
    dueDate: "Jan 10",
    status: "Partially Paid",
    utilityType: "Gas",
  },
  {
    id: "B-004",
    customerName: "Sarah Wilson",
    period: "Nov 2024",
    amount: "$50.00",
    dueDate: "Dec 10",
    status: "Paid",
    utilityType: "Electricity",
  },
  {
    id: "B-005",
    customerName: "Mike Brown",
    period: "Dec 2024",
    amount: "$28.75",
    dueDate: "Jan 10",
    status: "Unpaid",
    utilityType: "Water",
  },
  {
    id: "B-006",
    customerName: "Emily Chen",
    period: "Nov 2024",
    amount: "$65.00",
    dueDate: "Dec 10",
    status: "Paid",
    utilityType: "Gas",
  },
  {
    id: "B-007",
    customerName: "David Wilson",
    period: "Dec 2024",
    amount: "$38.50",
    dueDate: "Jan 10",
    status: "Partially Paid",
    utilityType: "Electricity",
  },
  {
    id: "B-008",
    customerName: "Lisa Anderson",
    period: "Nov 2024",
    amount: "$42.00",
    dueDate: "Dec 10",
    status: "Unpaid",
    utilityType: "Water",
  },
  {
    id: "B-009",
    customerName: "Robert Taylor",
    period: "Dec 2024",
    amount: "$55.25",
    dueDate: "Jan 10",
    status: "Paid",
    utilityType: "Gas",
  },
  {
    id: "B-010",
    customerName: "Jennifer Martinez",
    period: "Dec 2024",
    amount: "$47.80",
    dueDate: "Jan 10",
    status: "Unpaid",
    utilityType: "Electricity",
  },
]

export default function Bills() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [utilityFilter, setUtilityFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isGenerateBillOpen, setIsGenerateBillOpen] = useState(false)
  const [isBillDetailsOpen, setIsBillDetailsOpen] = useState(false)
  const [selectedBillData, setSelectedBillData] = useState(null)
  const itemsPerPage = 10

  const filteredBills = billsData.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || bill.status === statusFilter
    const matchesUtility = utilityFilter === "all" || bill.utilityType === utilityFilter
    const matchesPeriod = periodFilter === "all" || bill.period === periodFilter

    return matchesSearch && matchesStatus && matchesUtility && matchesPeriod
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

  const handleViewBill = (bill) => {
    // Mock bill details (replace with actual API call)
    const billData = {
      billId: bill.id,
      customerName: bill.customerName,
      customerId: "#CUST-001",
      utility: bill.utilityType,
      meter: "E-12345",
      billingPeriod: `${bill.period}`,
      previousReading: 1150,
      currentReading: 1250,
      consumption: 100,
      unit: "kWh",
      charges: [
        { description: "First 100 kWh @ $0.10", amount: 10.00 },
        { description: "Fixed Charges", amount: 0.00 },
        { description: "Previous Balance", amount: 15.00 },
        { description: "Late Fee", amount: 5.00 },
      ],
      totalAmount: parseFloat(bill.amount.replace('$', '')),
      dueDate: bill.dueDate,
      status: bill.status,
    }

    setSelectedBillData(billData)
    setIsBillDetailsOpen(true)
  }

  const handlePrintBill = (bill) => {
    // Mock bill details (replace with actual API call)
    const billData = {
      billId: bill.id,
      customerName: bill.customerName,
      customerId: "#CUST-001",
      utility: bill.utilityType,
      meter: "E-12345",
      billingPeriod: `${bill.period}`,
      previousReading: 1150,
      currentReading: 1250,
      consumption: 100,
      unit: "kWh",
      charges: [
        { description: "First 100 kWh @ $0.10", amount: 10.00 },
        { description: "Fixed Charges", amount: 0.00 },
        { description: "Previous Balance", amount: 15.00 },
        { description: "Late Fee", amount: 5.00 },
      ],
      totalAmount: parseFloat(bill.amount.replace('$', '')),
      dueDate: bill.dueDate,
      status: bill.status,
    }

    setSelectedBillData(billData)
    setIsBillDetailsOpen(true)

    // Trigger print after a short delay to allow dialog to render
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background overflow-x-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <SiteHeader />
          <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">
            <div className="space-y-4 sm:space-y-6 max-w-full">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Bills</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Manage customer billing
                  </p>
                </div>
                <Button onClick={() => setIsGenerateBillOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Bill
                </Button>
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
                          <TableHead className="min-w-[100px]">Amount</TableHead>
                          <TableHead className="min-w-[100px]">Due Date</TableHead>
                          <TableHead className="min-w-[120px]">Status</TableHead>
                          <TableHead className="text-right min-w-[60px]">Act</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBills.length > 0 ? (
                          paginatedBills.map((bill) => (
                            <TableRow key={bill.id}>
                              <TableCell className="font-medium">
                                {bill.id}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">{bill.customerName}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {bill.period}
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
                                    <DropdownMenuItem>
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
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
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
        onSuccess={(data) => {
          // Generate mock bill data (replace with actual API call)
          const billData = {
            billId: "B-001234",
            customerName: "John Smith",
            customerId: "#CUST-001",
            utility: "Electricity",
            meter: "E-12345",
            billingPeriod: "Dec 1 - Dec 31, 2024",
            previousReading: 1150,
            currentReading: 1250,
            consumption: 100,
            unit: "kWh",
            charges: [
              { description: "First 100 kWh @ $0.10", amount: 10.00 },
              { description: "Fixed Charges", amount: 0.00 },
              { description: "Previous Balance", amount: 15.00 },
              { description: "Late Fee", amount: 5.00 },
            ],
            totalAmount: 30.00,
            dueDate: "Jan 15, 2025",
            status: "Unpaid (5 days overdue)",
          }

          setSelectedBillData(billData)
          setIsBillDetailsOpen(true)
          setIsGenerateBillOpen(false)
        }}
      />

      {/* Bill Details Dialog */}
      <BillDetailsDialog
        open={isBillDetailsOpen}
        onOpenChange={setIsBillDetailsOpen}
        billData={selectedBillData}
      />
    </SidebarProvider>
  )
}
