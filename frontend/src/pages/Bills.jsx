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
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react"
import { useState } from "react"

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

  const filteredBills = billsData.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || bill.status === statusFilter
    const matchesUtility = utilityFilter === "all" || bill.utilityType === utilityFilter
    const matchesPeriod = periodFilter === "all" || bill.period === periodFilter

    return matchesSearch && matchesStatus && matchesUtility && matchesPeriod
  })

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

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Bills</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    manage customer billing
                  </p>
                </div>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Bill
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search:"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:max-w-md pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                      <Filter className="w-4 h-4" />
                      Filters:
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="p-2 space-y-2">
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

              <Card>
                <CardHeader>
                  <CardTitle>Bills List</CardTitle>
                  <CardDescription>
                    A list of all bills in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table className="min-w-[640px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bill ID</TableHead>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date.</TableHead>
                          <TableHead>Status (badge)</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBills.length > 0 ? (
                          filteredBills.map((bill) => (
                            <TableRow key={bill.id}>
                              <TableCell className="font-medium">
                                {bill.id}
                              </TableCell>
                              <TableCell>{bill.customerName}</TableCell>
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
                              <TableCell className="text-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View</DropdownMenuItem>
                                    <DropdownMenuItem>Print</DropdownMenuItem>
                                    <DropdownMenuItem>Send Email</DropdownMenuItem>
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
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="flex justify-center sm:justify-end overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max">
                  <Button variant="outline" size="sm">
                    &lt;
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span className="px-2">...</span>
                  <Button variant="outline" size="sm">
                    123
                  </Button>
                  <Button variant="outline" size="sm">
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
