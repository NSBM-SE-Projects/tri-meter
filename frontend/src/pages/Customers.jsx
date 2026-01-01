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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, UserPlus, MoreHorizontal, Filter } from "lucide-react"
import { useState } from "react"

// Sample customer data
const customersData = [
  {
    id: "001",
    name: "John Smith",
    type: "Household",
    phone: "2321-232323",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: "002",
    name: "Jane Doe",
    type: "Business",
    phone: "2321-232324",
    email: "jane@example.com",
    status: "Active",
  },
  {
    id: "003",
    name: "ABC Corp",
    type: "Business",
    phone: "2321-232325",
    email: "abc@example.com",
    status: "Active",
  },
  {
    id: "004",
    name: "Sarah Wilson",
    type: "Household",
    phone: "2321-232326",
    email: "sarah@example.com",
    status: "Inactive",
  },
  {
    id: "005",
    name: "Michael Brown",
    type: "Household",
    phone: "2321-232327",
    email: "michael@example.com",
    status: "Pending",
  },
  {
    id: "006",
    name: "XYZ Ltd",
    type: "Business",
    phone: "2321-232328",
    email: "xyz@example.com",
    status: "Active",
  },
]

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    customerType: "Household",
    identityValidation: "",
    phone: "",
    email: "",
    houseNo: "",
    street: "",
    city: ""
  })

  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required"
    }

    // Identity Validation
    if (!formData.identityValidation.trim()) {
      errors.identityValidation = "Identity Validation is required"
    } else if (formData.customerType === "Household") {
      // NIC validation (old: 9 digits + V, new: 12 digits)
      if (!/^(\d{9}[vVxX]|\d{12})$/.test(formData.identityValidation)) {
        errors.identityValidation = "Invalid NIC format (9 digits + V or 12 digits)"
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{9}$/.test(formData.phone)) {
      errors.phone = "Phone must be 9 digits"
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format"
    }

    // House No validation
    if (!formData.houseNo.trim()) {
      errors.houseNo = "House No is required"
    }

    // Street validation
    if (!formData.street.trim()) {
      errors.street = "Street is required"
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = "City is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically send data to backend
      console.log("Form submitted:", formData)
      // Reset form and close dialog
      setFormData({
        fullName: "",
        customerType: "Household",
        identityValidation: "",
        phone: "",
        email: "",
        houseNo: "",
        street: "",
        city: ""
      })
      setFormErrors({})
      setIsAddDialogOpen(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: "",
      customerType: "Household",
      identityValidation: "",
      phone: "",
      email: "",
      houseNo: "",
      street: "",
      city: ""
    })
    setFormErrors({})
    setIsAddDialogOpen(false)
  }

  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesType = typeFilter === "all" || customer.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Inactive":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-2 sm:p-4">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
                  <p className="text-muted-foreground">
                    Manage all customer accounts
                  </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
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
                      Filter
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
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Customer Type</label>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Household">Household</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Government">Government</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Customer List</CardTitle>
                  <CardDescription>
                    A list of all registered customers in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-x-auto scroll-smooth -mx-1 px-1">
                    <Table className="min-w-[640px] w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Act</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell className="font-medium">
                                {customer.id}
                              </TableCell>
                              <TableCell>{customer.name}</TableCell>
                              <TableCell>{customer.type}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {customer.phone}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {customer.email}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(customer.status)}>
                                  {customer.status}
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
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                              No customers found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-gray-800">
          <DialogHeader className="px-4 sm:px-8 md:px-12">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">Add New Customer</DialogTitle>
            <DialogDescription className="text-sm">
              Fill in the customer information below
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 sm:px-8 md:px-12 lg:px-28 pt-6 sm:pt-10 pb-8 sm:pb-12 md:pb-24 space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Customer Information</h3>

              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={formErrors.fullName ? "border-red-500" : ""}
                />
                {formErrors.fullName && (
                  <p className="text-sm text-red-500">{formErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Customer Type<span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.customerType}
                  onValueChange={(value) => handleInputChange("customerType", value)}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Household" id="household" />
                    <Label htmlFor="household" className="font-normal cursor-pointer">
                      Household
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Business" id="business" />
                    <Label htmlFor="business" className="font-normal cursor-pointer">
                      Business
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Government" id="government" />
                    <Label htmlFor="government" className="font-normal cursor-pointer">
                      Government
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identityValidation">
                  Identity Validation (NIC/BRN/GOV)<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="identityValidation"
                  value={formData.identityValidation}
                  onChange={(e) => handleInputChange("identityValidation", e.target.value)}
                  className={formErrors.identityValidation ? "border-red-500" : ""}
                />
                {formErrors.identityValidation && (
                  <p className="text-sm text-red-500">{formErrors.identityValidation}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Contact Information</h3>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone No.<span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                    <span className="text-sm">+94</span>
                  </div>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value.replaceAll(/\D/g, ""))}
                    className={`rounded-l-none ${formErrors.phone ? "border-red-500" : ""}`}
                    maxLength={9}
                    placeholder="771234567"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Address</h3>

              <div className="space-y-2">
                <Label htmlFor="houseNo">
                  House No.<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="houseNo"
                  value={formData.houseNo}
                  onChange={(e) => handleInputChange("houseNo", e.target.value)}
                  className={formErrors.houseNo ? "border-red-500" : ""}
                />
                {formErrors.houseNo && (
                  <p className="text-sm text-red-500">{formErrors.houseNo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">
                  Street<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className={formErrors.street ? "border-red-500" : ""}
                />
                {formErrors.street && (
                  <p className="text-sm text-red-500">{formErrors.street}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  City<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={formErrors.city ? "border-red-500" : ""}
                />
                {formErrors.city && (
                  <p className="text-sm text-red-500">{formErrors.city}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 px-4 sm:px-8 md:px-12 flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              Save Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
