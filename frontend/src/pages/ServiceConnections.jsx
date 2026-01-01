import { useState, useEffect } from "react"
import { getAllServiceConnections, createServiceConnection, deleteServiceConnection, updateServiceConnection } from "@/services/serviceConnectionService"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table"
import { createServiceConnectionColumns } from "@/components/service-connection-columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Search } from "lucide-react"

// Sample customer data for dropdown
const sampleCustomers = [
  { id: "1", name: "John Smith", type: "Household" },
  { id: "2", name: "Dwain Dias", type: "Business" },
  { id: "3", name: "Ashen Perera", type: "Household" },
  { id: "4", name: "Sarah Johnson", type: "Household" },
  { id: "5", name: "Mike Brown", type: "Business" },
  { id: "6", name: "Emily Chen", type: "Household" },
  { id: "7", name: "David Wilson", type: "Business" },
  { id: "8", name: "Lisa Anderson", type: "Industrial" },
  { id: "9", name: "Robert Taylor", type: "Household" },
  { id: "10", name: "Jennifer Martinez", type: "Business" },
  { id: "11", name: "ABC Corporation", type: "Business" },
  { id: "12", name: "Sarah Wilson", type: "Household" },
  { id: "13", name: "Green Valley Hotel", type: "Business" },
  { id: "14", name: "Tech Solutions Ltd", type: "Industrial" },
  { id: "15", name: "Maria Garcia", type: "Household" },
]

// Sample test data for frontend testing
const sampleConnectionsData = [
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
    status: "Pending",
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
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connections, setConnections] = useState(sampleConnectionsData)
  const [isLoading, setIsLoading] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    customer: "",
    utilityTypes: [],
    meterNumber: "",
    tariffPlan: "",
    installationCharge: "",
    initialReading: "0",
    houseNo: "",
    street: "",
    city: "",
    status: "Active"
  })

  const [formErrors, setFormErrors] = useState({})

  // Fetch service connections on component mount
  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      setIsLoading(true)
      // TODO: Uncomment when backend is ready
      // const data = await getAllServiceConnections()
      // setConnections(data)

      // Using sample data for frontend testing
      setConnections(sampleConnectionsData)
    } catch (error) {
      console.error("Failed to fetch service connections:", error)
      // Fallback to sample data if API fails
      setConnections(sampleConnectionsData)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.customer) {
      errors.customer = "Customer is required"
    }

    if (formData.utilityTypes.length === 0) {
      errors.utilityTypes = "Utility Type is required"
    }

    if (!formData.meterNumber.trim()) {
      errors.meterNumber = "Meter Number is required"
    }

    if (!formData.tariffPlan) {
      errors.tariffPlan = "Tariff Plan is required"
    }

    if (!formData.initialReading.trim()) {
      errors.initialReading = "Initial Reading is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Auto-fill installation charge based on utility type
      if (field === "utilityTypes" && value.length > 0) {
        const charges = {
          "Electricity": "$100 (Electricity)",
          "Water": "$80 (Water)",
          "Gas": "$120 (Gas)"
        }
        updated.installationCharge = charges[value[0]] || ""
      }

      return updated
    })

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleUtilityTypeChange = (type, checked) => {
    setFormData(prev => {
      const updated = { ...prev }
      if (checked) {
        updated.utilityTypes = [type] // Only one can be selected
        const charges = {
          "Electricity": "$100 (Electricity)",
          "Water": "$80 (Water)",
          "Gas": "$120 (Gas)"
        }
        updated.installationCharge = charges[type] || ""
      } else {
        updated.utilityTypes = updated.utilityTypes.filter(t => t !== type)
        updated.installationCharge = ""
      }
      return updated
    })
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        // TODO: Uncomment when backend is ready
        // const newConnection = await createServiceConnection(formData)

        // Using local data for frontend testing
        const newConnection = {
          id: String(connections.length + 1),
          customerName: formData.customer,
          utilityType: formData.utilityTypes[0],
          meterNumber: formData.meterNumber,
          installationDate: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          tariffPlan: formData.tariffPlan,
          status: formData.status,
        }

        // Add to connections list
        setConnections(prev => [newConnection, ...prev])

        // Show success message
        alert("Service connection registered successfully!")

        // Reset form and close dialog
        setFormData({
          customer: "",
          utilityTypes: [],
          meterNumber: "",
          tariffPlan: "",
          installationCharge: "",
          initialReading: "0",
          houseNo: "",
          street: "",
          city: "",
          status: "Active"
        })
        setFormErrors({})
        setCustomerSearch("")
        setIsRegisterDialogOpen(false)
      } catch (error) {
        console.error("Failed to create service connection:", error)
        alert(error.message || "Failed to register service connection. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      customer: "",
      utilityTypes: [],
      meterNumber: "",
      tariffPlan: "",
      installationCharge: "",
      initialReading: "0",
      houseNo: "",
      street: "",
      city: "",
      status: "Active"
    })
    setFormErrors({})
    setCustomerSearch("")
    setIsRegisterDialogOpen(false)
  }

  // Action handlers
  const handleViewDetails = (connection) => {
    setSelectedConnection(connection)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (connection) => {
    setSelectedConnection(connection)
    setFormData({
      customer: connection.customer || "",
      utilityTypes: [connection.utilityType] || [],
      meterNumber: connection.meterNumber || "",
      tariffPlan: connection.tariffPlan || "",
      installationCharge: connection.installationCharge || "",
      initialReading: connection.initialReading || "0",
      houseNo: connection.houseNo || "",
      street: connection.street || "",
      city: connection.city || "",
      status: connection.status || "Active"
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (connection) => {
    setSelectedConnection(connection)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedConnection) return

    try {
      setIsLoading(true)

      // TODO: Uncomment when backend is ready
      // await deleteServiceConnection(selectedConnection.id)

      // Using local data for frontend testing
      // Remove from connections list
      setConnections(prev => prev.filter(c => c.id !== selectedConnection.id))

      alert("Service connection deleted successfully!")
      setIsDeleteDialogOpen(false)
      setSelectedConnection(null)
    } catch (error) {
      console.error("Failed to delete service connection:", error)
      alert(error.message || "Failed to delete service connection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        // TODO: Uncomment when backend is ready
        // const updatedConnection = await updateServiceConnection(selectedConnection.id, {
        //   ...formData,
        //   status: selectedConnection.status
        // })

        // Using local data for frontend testing
        const updatedConnection = {
          ...selectedConnection,
          meterNumber: formData.meterNumber,
          tariffPlan: formData.tariffPlan,
          status: selectedConnection.status
        }

        // Update in connections list
        setConnections(prev => prev.map(c =>
          c.id === selectedConnection.id ? updatedConnection : c
        ))

        alert("Service connection updated successfully!")

        // Reset form and close dialog
        setFormData({
          customer: "",
          utilityTypes: [],
          meterNumber: "",
          tariffPlan: "",
          installationCharge: "",
          initialReading: "0",
          houseNo: "",
          street: "",
          city: "",
          status: "Active"
        })
        setFormErrors({})
        setIsEditDialogOpen(false)
        setSelectedConnection(null)
      } catch (error) {
        console.error("Failed to update service connection:", error)
        alert(error.message || "Failed to update service connection. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Filter customers based on search
  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  )

  // Create columns with action handlers
  const connectionColumns = createServiceConnectionColumns(
    handleViewDetails,
    handleEdit,
    handleDelete
  )

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-7">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold">Service Connections</h1>
                  <p className="text-muted-foreground">
                    Manage customer utility service connections
                  </p>
                </div>
                <Button onClick={() => setIsRegisterDialogOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Register Connection
                </Button>
              </div>

              <div className="border rounded-lg bg-card">
                <div className="p-6">
                  <p className="text-lg font-normal">Service Connection List</p>
                  <p className="pb-3 text-sm text-muted-foreground">
                    A list of all service connections in the system
                  </p>
                  <div className="px-6 overflow-x-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">Loading service connections...</p>
                      </div>
                    ) : connections.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">No service connections found. Register your first connection!</p>
                      </div>
                    ) : (
                      <DataTable
                        columns={connectionColumns}
                        data={connections}
                        filterColumn="customerName"
                        filterPlaceholder="Search connections..."
                        showColumnToggle={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Register Service Connection Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-gray-800">
          <DialogHeader className="px-3 sm:px-6 md:px-8">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">Register Service Connection</DialogTitle>
            <DialogDescription className="text-sm">
              Fill in the service connection details below
            </DialogDescription>
          </DialogHeader>

          <div className="px-3 pt-4 pb-6 space-y-4 sm:px-6 md:px-8 lg:px-20 sm:pt-6 md:pt-8 sm:pb-10 md:pb-16 sm:space-y-6">
            {/* Customer */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="customer">
                Customer<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.customer}
                onValueChange={(value) => {
                  handleInputChange("customer", value)
                  setCustomerSearch("") // Reset search when selection is made
                }}
              >
                <SelectTrigger className={formErrors.customer ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 z-10 p-2 border-b bg-background">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search customers..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="h-8 pl-8"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                          <span className="ml-2 text-xs text-muted-foreground">({customer.type})</span>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        No customers found
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
              {formErrors.customer && (
                <p className="text-sm text-red-500">{formErrors.customer}</p>
              )}
            </div>

            {/* Utility Type */}
            <div className="space-y-1.7 sm:space-y-2">
              <Label>
                Utility Type<span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col gap-12 sm:flex-row sm:gap-32">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="electricity"
                    checked={formData.utilityTypes.includes("Electricity")}
                    onCheckedChange={(checked) => handleUtilityTypeChange("Electricity", checked)}
                  />
                  <label htmlFor="electricity" className="text-sm font-medium cursor-pointer">
                    Electricity
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="water"
                    checked={formData.utilityTypes.includes("Water")}
                    onCheckedChange={(checked) => handleUtilityTypeChange("Water", checked)}
                  />
                  <label htmlFor="water" className="text-sm font-medium cursor-pointer">
                    Water
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gas"
                    checked={formData.utilityTypes.includes("Gas")}
                    onCheckedChange={(checked) => handleUtilityTypeChange("Gas", checked)}
                  />
                  <label htmlFor="gas" className="text-sm font-medium cursor-pointer">
                    Gas
                  </label>
                </div>
              </div>
              {formErrors.utilityTypes && (
                <p className="text-sm text-red-500">{formErrors.utilityTypes}</p>
              )}
            </div>

            {/* Meter Number */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="meterNumber">
                  Meter Number<span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="meterNumber"
                value={formData.meterNumber}
                onChange={(e) => handleInputChange("meterNumber", e.target.value)}
                className={formErrors.meterNumber ? "border-red-500" : ""}
                placeholder="E-12345"
              />
              {formErrors.meterNumber && (
                <p className="text-sm text-red-500">{formErrors.meterNumber}</p>
              )}
            </div>

            {/* Tariff Plan */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="tariffPlan">
                Tariff Plan<span className="text-red-500">*</span>
              </Label>
              <Select value={formData.tariffPlan} onValueChange={(value) => handleInputChange("tariffPlan", value)}>
                <SelectTrigger className={formErrors.tariffPlan ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select tariff plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.tariffPlan && (
                <p className="text-sm text-red-500">{formErrors.tariffPlan}</p>
              )}
            </div>

            {/* Installation Charge */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="installationCharge">Installation Charge</Label>
              </div>
              <Input
                id="installationCharge"
                value={formData.installationCharge}
                readOnly
                className="bg-muted"
              />
            </div>

            {/* Initial Reading */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="initialReading">
                Initial Reading<span className="text-red-500">*</span>
              </Label>
              <Input
                id="initialReading"
                type="number"
                value={formData.initialReading}
                onChange={(e) => handleInputChange("initialReading", e.target.value)}
                className={formErrors.initialReading ? "border-red-500" : ""}
              />
              {formErrors.initialReading && (
                <p className="text-sm text-red-500">{formErrors.initialReading}</p>
              )}
            </div>

            <Separator />

            {/* Service Address */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base font-semibold sm:text-lg">Service Address</h3>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="houseNo">House No.</Label>
                <Input
                  id="houseNo"
                  value={formData.houseNo}
                  onChange={(e) => handleInputChange("houseNo", e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse gap-2 px-3 pt-4 pb-2 sm:px-6 md:px-8 sm:flex-row">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              Register Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Service Connection Details</DialogTitle>
            <DialogDescription>
              View service connection information
            </DialogDescription>
          </DialogHeader>

          {selectedConnection && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Connection ID</p>
                  <p className="text-base">{selectedConnection.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Status</p>
                  <p className="text-base">{selectedConnection.status}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">Connection Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Customer Name</p>
                    <p className="text-base">{selectedConnection.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Utility Type</p>
                    <p className="text-base">{selectedConnection.utilityType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Meter Number</p>
                    <p className="text-base">{selectedConnection.meterNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Installation Date</p>
                    <p className="text-base">{selectedConnection.installationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Tariff Plan</p>
                    <p className="text-base">{selectedConnection.tariffPlan}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Connection Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-gray-800">
          <DialogHeader className="px-3 sm:px-6 md:px-8">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">Edit Service Connection</DialogTitle>
            <DialogDescription className="text-sm">
              Update service connection information
            </DialogDescription>
          </DialogHeader>

          <div className="px-3 pt-4 pb-6 space-y-4 sm:px-6 md:px-8 lg:px-20 sm:pt-6 md:pt-8 sm:pb-10 md:pb-16 sm:space-y-6">
            {/* Meter Number */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="editMeterNumber">
                Meter Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="editMeterNumber"
                value={formData.meterNumber}
                onChange={(e) => handleInputChange("meterNumber", e.target.value)}
                className={formErrors.meterNumber ? "border-red-500" : ""}
              />
              {formErrors.meterNumber && (
                <p className="text-sm text-red-500">{formErrors.meterNumber}</p>
              )}
            </div>

            {/* Tariff Plan */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="editTariffPlan">
                Tariff Plan<span className="text-red-500">*</span>
              </Label>
              <Select value={formData.tariffPlan} onValueChange={(value) => handleInputChange("tariffPlan", value)}>
                <SelectTrigger className={formErrors.tariffPlan ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select tariff plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.tariffPlan && (
                <p className="text-sm text-red-500">{formErrors.tariffPlan}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label>
                Status<span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={selectedConnection?.status || "Active"}
                onValueChange={(value) => {
                  setSelectedConnection(prev => prev ? {...prev, status: value} : null)
                }}
                className="flex flex-col gap-3 sm:flex-row sm:gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Active" id="edit-status-active" />
                  <Label htmlFor="edit-status-active" className="font-normal cursor-pointer">
                    Active
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Disconnected" id="edit-status-disconnected" />
                  <Label htmlFor="edit-status-disconnected" className="font-normal cursor-pointer">
                    Disconnected
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Pending" id="edit-status-pending" />
                  <Label htmlFor="edit-status-pending" className="font-normal cursor-pointer">
                    Pending
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse gap-2 px-3 pt-4 pb-2 sm:px-6 md:px-8 sm:flex-row">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setFormErrors({})
            }} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="w-full sm:w-auto">
              Update Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Service Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service connection?
            </DialogDescription>
          </DialogHeader>

          {selectedConnection && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This will permanently delete service connection <span className="font-semibold">{selectedConnection.meterNumber}</span> for <span className="font-semibold">{selectedConnection.customerName}</span> (ID: {selectedConnection.id}) from the system.
              </p>
              <p className="mt-2 text-sm text-red-600">
                This action cannot be undone.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
