import { useState, useEffect } from "react"
import { getAllCustomers, createCustomer, deleteCustomer, updateCustomer } from "@/services/customerService"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table"
import { createCustomerColumns } from "@/components/customer-columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { UserPlus, Upload } from "lucide-react"

export default function Customers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const data = await getAllCustomers()
      setCustomers(data)
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      alert("Failed to load customers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      console.log("File uploaded:", file.name)
      // Here you would typically upload the file to your backend
    }
  }

  const triggerFileUpload = () => {
    document.getElementById("idFileUpload").click()
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        // Create customer
        const newCustomer = await createCustomer(formData)

        // Add to customers list
        setCustomers(prev => [newCustomer, ...prev])

        // Show success message
        alert("Customer added successfully!")

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
        setUploadedFile(null)
        setIsAddDialogOpen(false)

        // Refresh customer list
        await fetchCustomers()
      } catch (error) {
        console.error("Failed to create customer:", error)
        alert(error.message || "Failed to add customer. Please try again.")
      } finally {
        setIsLoading(false)
      }
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
    setUploadedFile(null)
    setIsAddDialogOpen(false)
  }

  // Action handlers
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setFormData({
      fullName: customer.name || "",
      customerType: customer.type || "Household",
      identityValidation: customer.idProof || "",
      phone: customer.phone?.replace("+94", "") || "",
      email: customer.email || "",
      houseNo: customer.houseNo || "",
      street: customer.street || "",
      city: customer.city || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCustomer) return

    try {
      setIsLoading(true)
      await deleteCustomer(selectedCustomer.id)

      // Remove from customers list
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id))

      alert("Customer deleted successfully!")
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
    } catch (error) {
      console.error("Failed to delete customer:", error)
      alert(error.message || "Failed to delete customer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        // Update customer
        const updatedCustomer = await updateCustomer(selectedCustomer.id, {
          ...formData,
          status: selectedCustomer.status
        })

        // Update in customers list
        setCustomers(prev => prev.map(c =>
          c.id === selectedCustomer.id ? updatedCustomer : c
        ))

        alert("Customer updated successfully!")

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
        setUploadedFile(null)
        setIsEditDialogOpen(false)
        setSelectedCustomer(null)

        // Refresh customer list
        await fetchCustomers()
      } catch (error) {
        console.error("Failed to update customer:", error)
        alert(error.message || "Failed to update customer. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Create columns with action handlers
  const customerColumns = createCustomerColumns(
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Customers</h1>
                  <p className="text-muted-foreground">
                    Manage all customer accounts
                  </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>

              <div className="border rounded-lg bg-card">
                <div className="p-6">
                  <p className="text-lg font-normal">Customer List</p>
                  <p className="text-sm text-muted-foreground pb-3">
                    A list of all registered customers in the system
                  </p>
                  <div className="overflow-x-auto px-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">Loading customers...</p>
                      </div>
                    ) : customers.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">No customers found. Add your first customer!</p>
                      </div>
                    ) : (
                      <DataTable
                        columns={customerColumns}
                        data={customers}
                        filterColumn="name"
                        filterPlaceholder="Search customers..."
                        showColumnToggle={true}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-gray-800">
          <DialogHeader className="px-3 sm:px-6 md:px-8">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">Add New Customer</DialogTitle>
            <DialogDescription className="text-sm">
              Fill in the customer information below
            </DialogDescription>
          </DialogHeader>

          <div className="px-3 sm:px-6 md:px-8 lg:px-20 pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-10 md:pb-16 space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Customer Information</h3>

              <div className="space-y-1.5 sm:space-y-2">
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

              <div className="space-y-1.5 sm:space-y-2">
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

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="identityValidation">
                  Identity Validation (NIC/BRN/GOV)<span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="identityValidation"
                    value={formData.identityValidation}
                    onChange={(e) => handleInputChange("identityValidation", e.target.value)}
                    className={`flex-1 ${formErrors.identityValidation ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={triggerFileUpload}
                    className="shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <input
                    id="idFileUpload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {uploadedFile && (
                  <p className="text-sm text-green-600">
                    File uploaded: {uploadedFile.name}
                  </p>
                )}
                {formErrors.identityValidation && (
                  <p className="text-sm text-red-500">{formErrors.identityValidation}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Contact Information</h3>

              <div className="space-y-1.5 sm:space-y-2">
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

              <div className="space-y-1.5 sm:space-y-2">
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
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Address</h3>

              <div className="space-y-1.5 sm:space-y-2">
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

              <div className="space-y-1.5 sm:space-y-2">
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

              <div className="space-y-1.5 sm:space-y-2">
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

          <DialogFooter className="pt-4 px-3 sm:px-6 md:px-8 pb-2 flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              Save Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Customer ID</p>
                  <p className="text-base">{selectedCustomer.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Status</p>
                  <p className="text-base">{selectedCustomer.status}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Full Name</p>
                    <p className="text-base">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Customer Type</p>
                    <p className="text-base">{selectedCustomer.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Identity Proof</p>
                    <p className="text-base">{selectedCustomer.idProof}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                    <p className="text-base">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Email</p>
                    <p className="text-base">{selectedCustomer.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">House No.</p>
                    <p className="text-base">{selectedCustomer.houseNo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Street</p>
                    <p className="text-base">{selectedCustomer.street}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">City</p>
                    <p className="text-base">{selectedCustomer.city}</p>
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

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-gray-800">
          <DialogHeader className="px-3 sm:px-6 md:px-8">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">Edit Customer</DialogTitle>
            <DialogDescription className="text-sm">
              Update customer information
            </DialogDescription>
          </DialogHeader>

          <div className="px-3 sm:px-6 md:px-8 lg:px-20 pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-10 md:pb-16 space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Customer Information</h3>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="editFullName">
                  Full Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editFullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={formErrors.fullName ? "border-red-500" : ""}
                />
                {formErrors.fullName && (
                  <p className="text-sm text-red-500">{formErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label>
                  Customer Type<span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.customerType}
                  onValueChange={(value) => handleInputChange("customerType", value)}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Household" id="edit-household" />
                    <Label htmlFor="edit-household" className="font-normal cursor-pointer">
                      Household
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Business" id="edit-business" />
                    <Label htmlFor="edit-business" className="font-normal cursor-pointer">
                      Business
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Government" id="edit-government" />
                    <Label htmlFor="edit-government" className="font-normal cursor-pointer">
                      Government
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="editIdentityValidation">
                  Identity Validation (NIC/BRN/GOV)<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editIdentityValidation"
                  value={formData.identityValidation}
                  onChange={(e) => handleInputChange("identityValidation", e.target.value)}
                  className={formErrors.identityValidation ? "border-red-500" : ""}
                />
                {formErrors.identityValidation && (
                  <p className="text-sm text-red-500">{formErrors.identityValidation}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label>
                  Status<span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={selectedCustomer?.status || "Active"}
                  onValueChange={(value) => {
                    setSelectedCustomer(prev => prev ? {...prev, status: value} : null)
                  }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active" id="edit-status-active" />
                    <Label htmlFor="edit-status-active" className="font-normal cursor-pointer">
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Inactive" id="edit-status-inactive" />
                    <Label htmlFor="edit-status-inactive" className="font-normal cursor-pointer">
                      Inactive
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Contact Information</h3>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="editPhone">
                  Phone No.<span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                    <span className="text-sm">+94</span>
                  </div>
                  <Input
                    id="editPhone"
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

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
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
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Address</h3>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="editHouseNo">
                  House No.<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editHouseNo"
                  value={formData.houseNo}
                  onChange={(e) => handleInputChange("houseNo", e.target.value)}
                  className={formErrors.houseNo ? "border-red-500" : ""}
                />
                {formErrors.houseNo && (
                  <p className="text-sm text-red-500">{formErrors.houseNo}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="editStreet">
                  Street<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editStreet"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className={formErrors.street ? "border-red-500" : ""}
                />
                {formErrors.street && (
                  <p className="text-sm text-red-500">{formErrors.street}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="editCity">
                  City<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editCity"
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

          <DialogFooter className="pt-4 px-3 sm:px-6 md:px-8 pb-2 flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setFormErrors({})
            }} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="w-full sm:w-auto">
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer?
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This will permanently delete <span className="font-semibold">{selectedCustomer.name}</span> (ID: {selectedCustomer.id}) from the system.
              </p>
              <p className="text-sm text-red-600 mt-2">
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
