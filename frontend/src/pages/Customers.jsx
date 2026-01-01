import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table"
import { customerColumns } from "@/components/customer-columns"
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

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

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically send data to backend
      console.log("Form submitted:", formData)
      console.log("Uploaded file:", uploadedFile)
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
                    <DataTable
                      columns={customerColumns}
                      data={customersData}
                      filterColumn="name"
                      filterPlaceholder="Search customers..."
                      showColumnToggle={true}
                    />
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
    </SidebarProvider>
  )
}
