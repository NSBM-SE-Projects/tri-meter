import { useState, useEffect, useRef } from "react"
import {
  Button,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components"
import { Search } from "lucide-react"

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

export function ServiceConnectionForm({ open, onOpenChange, onSuccess, initialData = null, isEdit = false }) {
  const [customerSearch, setCustomerSearch] = useState("")
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [isMouseOverList, setIsMouseOverList] = useState(false)
  const searchInputRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    customer: "",
    utilityType: "",
    meterNumber: "",
    tariffPlan: "",
    installationCharge: "",
    initialReading: "0",
    houseNo: "",
    street: "",
    city: "",
    status: "Active"
  })

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      // Reset to default when adding new connection
      setFormData({
        customer: "",
        utilityType: "",
        meterNumber: "",
        tariffPlan: "",
        installationCharge: "",
        initialReading: "0",
        houseNo: "",
        street: "",
        city: "",
        status: "Active"
      })
    }
  }, [initialData, open])

  useEffect(() => {
    if (isSelectOpen) {
      setCustomerSearch("")
      setIsMouseOverList(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus()
        })
      })
    }
  }, [isSelectOpen])

  // Maintain focus while typing (stop when mouse hovers over list)
  useEffect(() => {
    if (isSelectOpen) {
      const interval = setInterval(() => {
        if (!isMouseOverList && searchInputRef.current && document.activeElement !== searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isSelectOpen, isMouseOverList])

  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.customer) {
      errors.customer = "Customer is required"
    }

    if (!formData.utilityType) {
      errors.utilityType = "Utility Type is required"
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

      if (field === "customer" && value) {
        const selectedCustomer = sampleCustomers.find(c => c.name === value)
        if (selectedCustomer) {
          const tariffMapping = {
            "Household": "Residential",
            "Business": "Commercial",
            "Government": "Industrial"
          }
          updated.tariffPlan = tariffMapping[selectedCustomer.type] || ""
        }
      }

      // Auto-fill installation charge based on utility type
      if (field === "utilityType" && value) {
        const charges = {
          "Electricity": "$100",
          "Water": "$80",
          "Gas": "$120"
        }
        updated.installationCharge = charges[value] || ""
      }

      return updated
    })

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({
      customer: "",
      utilityType: "",
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
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(formData)
      }

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  // Filter customers based on search
  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-7 md:gap-0 lg:gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-background">
        <DialogHeader className="px-3 sm:px-6 md:px-3">
          <DialogTitle className="text-2xl">
            {isEdit ? "Edit Service Connection" : "Register Service Connection"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit ? "Update service connection information" : "Fill in the service connection details below"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-3 sm:px-14 md:px-16 lg:px-20 sm:pt-6 md:pt-8 space-y-4 sm:space-y-7">
          {/* Connection Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Connection Information</h3>

            {/* Customer */}
            <div className="space-y-2 pb-1">
              <Label htmlFor="customer">
                Customer<span className="text-red-700">*</span>
              </Label>
              <Select
                value={formData.customer}
                onValueChange={(value) => {
                  handleInputChange("customer", value)
                  setIsSelectOpen(false)
                }}
                open={isSelectOpen}
                onOpenChange={setIsSelectOpen}
              >
                <SelectTrigger className={formErrors.customer ? "border-red-700" : ""}>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 z-10 p-2 border-b bg-background">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Search customers..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="h-8 pl-8 text-sm"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          e.stopPropagation()
                          if (e.key !== 'Escape' && e.key !== 'Tab') {
                            e.nativeEvent.stopImmediatePropagation()
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="max-h-[200px] overflow-y-auto"
                    onMouseEnter={() => setIsMouseOverList(true)}
                  >
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
                <p className="text-sm text-red-700">{formErrors.customer}</p>
              )}
            </div>

            {/* Utility Type */}
            <div className="space-y-4 pb-1">
              <Label>
                Utility Type<span className="text-red-700">*</span>
              </Label>
              <RadioGroup
                value={formData.utilityType}
                onValueChange={(value) => handleInputChange("utilityType", value)}
                className="flex flex-col sm:flex-row gap-7 md:gap-32 lg:gap-40"
                disabled={isEdit}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Electricity" id="electricity" disabled={isEdit} />
                  <Label htmlFor="electricity" className="font-normal cursor-pointer">
                    Electricity
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Water" id="water" disabled={isEdit} />
                  <Label htmlFor="water" className="font-normal cursor-pointer">
                    Water
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Gas" id="gas" disabled={isEdit} />
                  <Label htmlFor="gas" className="font-normal cursor-pointer">
                    Gas
                  </Label>
                </div>
              </RadioGroup>
              {formErrors.utilityType && (
                <p className="text-sm text-red-700">{formErrors.utilityType}</p>
              )}
            </div>

            {/* Meter Number */}
            <div className="space-y-2 pb-1">
              <Label htmlFor="meterNumber">
                Meter Number<span className="text-red-700">*</span>
              </Label>
              <Input
                id="meterNumber"
                value={formData.meterNumber}
                onChange={(e) => handleInputChange("meterNumber", e.target.value)}
                className={formErrors.meterNumber ? "border-red-700" : ""}
                placeholder="E-12345"
              />
              {formErrors.meterNumber && (
                <p className="text-sm text-red-700">{formErrors.meterNumber}</p>
              )}
            </div>

            {/* Tariff Plan */}
            <div className="space-y-2 pb-1">
              <Label htmlFor="tariffPlan">
                Tariff Plan<span className="text-red-700">*</span>
              </Label>
              <Input
                id="tariffPlan"
                value={formData.tariffPlan}
                readOnly
                className="bg-muted"
              />
              {formErrors.tariffPlan && (
                <p className="text-sm text-red-700">{formErrors.tariffPlan}</p>
              )}
            </div>

            {/* Installation Charge */}
            {!isEdit && (
              <div className="space-y-2 pb-1">
                <Label htmlFor="installationCharge">Installation Charge</Label>
                <Input
                  id="installationCharge"
                  value={formData.installationCharge}
                  readOnly
                  className="bg-muted"
                />
              </div>
            )}

            {/* Initial Reading */}
            {!isEdit && (
              <div className="space-y-2 pb-1">
                <Label htmlFor="initialReading">
                  Initial Reading<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="initialReading"
                  type="number"
                  value={formData.initialReading}
                  onChange={(e) => handleInputChange("initialReading", e.target.value)}
                  className={formErrors.initialReading ? "border-red-700" : ""}
                />
                {formErrors.initialReading && (
                  <p className="text-sm text-red-700">{formErrors.initialReading}</p>
                )}
              </div>
            )}

            {/* Status (Edit mode only) */}
            {isEdit && (
              <div className="space-y-4 pb-1">
                <Label>
                  Status<span className="text-red-700">*</span>
                </Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  className="flex flex-col sm:flex-row gap-7 md:gap-24 lg:gap-28"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active" id="status-active" />
                    <Label htmlFor="status-active" className="font-normal cursor-pointer">
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Disconnected" id="status-disconnected" />
                    <Label htmlFor="status-disconnected" className="font-normal cursor-pointer">
                      Disconnected
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Pending" id="status-pending" />
                    <Label htmlFor="status-pending" className="font-normal cursor-pointer">
                      Pending
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <Separator />

          {/* Service Address */}
          {!isEdit && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium">Service Address</h3>

              <div className="space-y-2">
                <Label htmlFor="houseNo">House No.</Label>
                <Input
                  id="houseNo"
                  value={formData.houseNo}
                  onChange={(e) => handleInputChange("houseNo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-7 lg:pt-10 px-10 md:px-5 pb-2 flex-col-reverse sm:flex-row gap-5 lg:gap-3">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            {isEdit ? "Update Connection" : "Register Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
