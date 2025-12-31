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

// Sample service connection data
const serviceConnectionsData = [
  {
    id: "1",
    customerName: "John Smith",
    utilityType: "Electricity",
    meterNumber: "E-12345",
    installationDate: "11th Dec 2024",
    tariffPlan: "Residential",
    status: "Active",
  },
  {
    id: "2",
    customerName: "Dwain Dias",
    utilityType: "Water",
    meterNumber: "W-23456",
    installationDate: "15th Nov 2024",
    tariffPlan: "Commercial",
    status: "Active",
  },
  {
    id: "3",
    customerName: "Ashen",
    utilityType: "Gas",
    meterNumber: "G-34567",
    installationDate: "20th Oct 2024",
    tariffPlan: "Residential",
    status: "Disconnected",
  },
  {
    id: "4",
    customerName: "Sarah Johnson",
    utilityType: "Electricity",
    meterNumber: "E-45678",
    installationDate: "5th Dec 2024",
    tariffPlan: "Industrial",
    status: "Active",
  },
  {
    id: "5",
    customerName: "Mike Brown",
    utilityType: "Water",
    meterNumber: "W-56789",
    installationDate: "1st Nov 2024",
    tariffPlan: "Residential",
    status: "Disconnected",
  },
  {
    id: "6",
    customerName: "Emily Chen",
    utilityType: "Electricity",
    meterNumber: "E-67890",
    installationDate: "10th Dec 2024",
    tariffPlan: "Residential",
    status: "Active",
  },
  {
    id: "7",
    customerName: "David Wilson",
    utilityType: "Gas",
    meterNumber: "G-78901",
    installationDate: "25th Oct 2024",
    tariffPlan: "Commercial",
    status: "Active",
  },
  {
    id: "8",
    customerName: "Lisa Anderson",
    utilityType: "Water",
    meterNumber: "W-89012",
    installationDate: "3rd Nov 2024",
    tariffPlan: "Industrial",
    status: "Active",
  },
  {
    id: "9",
    customerName: "Robert Taylor",
    utilityType: "Electricity",
    meterNumber: "E-90123",
    installationDate: "18th Nov 2024",
    tariffPlan: "Residential",
    status: "Disconnected",
  },
  {
    id: "10",
    customerName: "Jennifer Martinez",
    utilityType: "Gas",
    meterNumber: "G-01234",
    installationDate: "8th Dec 2024",
    tariffPlan: "Commercial",
    status: "Active",
  },
]

export default function ServiceConnections() {
  const [searchQuery, setSearchQuery] = useState("")
  const [utilityTypeFilter, setUtilityTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("")

  const filteredConnections = serviceConnectionsData.filter(connection => {
    const matchesSearch = connection.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.meterNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesUtilityType = utilityTypeFilter === "all" || connection.utilityType === utilityTypeFilter
    const matchesStatus = statusFilter === "all" || connection.status === statusFilter

    return matchesSearch && matchesUtilityType && matchesStatus
  })

  const getUtilityTypeBadgeColor = (type) => {
    switch (type) {
      case "Electricity":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
      case "Water":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
      case "Gas":
        return "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600"
      case "Disconnected":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-600"
      case "Disconnected":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Service Connection</h1>
                  <p className="text-muted-foreground">
                    Manage customer utility service connections
                  </p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Register Connection
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search:"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filters:
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="p-2 space-y-2">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Utility Type</label>
                        <Select value={utilityTypeFilter} onValueChange={setUtilityTypeFilter}>
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
                        <label className="text-sm font-medium mb-1.5 block">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Disconnected">Disconnected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Customer</label>
                        <Input
                          placeholder="Customer name..."
                          value={customerFilter}
                          onChange={(e) => setCustomerFilter(e.target.value)}
                        />
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Service Connection List</CardTitle>
                  <CardDescription>
                    A list of all service connections in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>Utility Type</TableHead>
                          <TableHead>Meter Number</TableHead>
                          <TableHead>Installation Date</TableHead>
                          <TableHead>Tariff Plan</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredConnections.length > 0 ? (
                          filteredConnections.map((connection) => (
                            <TableRow key={connection.id}>
                              <TableCell className="font-medium">
                                {connection.id}
                              </TableCell>
                              <TableCell>{connection.customerName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getUtilityTypeBadgeColor(connection.utilityType)}>
                                  {connection.utilityType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {connection.meterNumber}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {connection.installationDate}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {connection.tariffPlan}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getStatusDot(connection.status)}`} />
                                  <span className={getStatusColor(connection.status)}>
                                    {connection.status}
                                  </span>
                                </div>
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
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                              No service connections found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="flex justify-end">
                <div className="flex items-center gap-2">
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
