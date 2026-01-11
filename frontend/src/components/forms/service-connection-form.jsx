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
import { cn } from "@/lib/utils"

export function ServiceConnectionForm({ open, onOpenChange, onSuccess, customers = [], initialData = null, isEdit = false }) {
  const [customerSearch, setCustomerSearch] = useState("")
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [isMouseOverList, setIsMouseOverList] = useState(false)
  const searchInputRef = useRef(null)
  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
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
      // If editing, find the customer status
      if (isEdit && initialData.customerId) {
        const customer = customers.find(c => c.id === initialData.customerId)
        if (customer) {
          setSelectedCustomerStatus(customer.status)
        }
      }
    } else {
      // Reset to default when adding new connection
      setFormData({
        customerId: "",
        customerName: "",
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
      setSelectedCustomerStatus(null)
    }
  }, [initialData, open, isEdit, customers])

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
    if (!isEdit) {
      if (!formData.customerId) {
      errors.customerId = "Customer is required"
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
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      if (field === "customerId" && value) {
        const selectedCustomer = customers.find(c => c.id === parseInt(value))
        if (selectedCustomer) {
          updated.customerName = selectedCustomer.name
          updated.tariffPlan = selectedCustomer.type
        }
      }

      // Auto-fill installation charge based on utility type
      if (field === "utilityType") {
        if (value) {
          const charges = {
            "Electricity": "$100",
            "Water": "$80",
            "Gas": "$120"
          }
          const chargeString = charges[value] || "0";
          const numericCharge = parseInt(chargeString.replace(/[^0-9]/g, ''), 10);
          updated.installationCharge = numericCharge;
        } else {
          updated.installationCharge = 0
        }
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
  const filteredCustomers = customers.filter(customer =>
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
            <h3 className="text-lg font-medium">
              {isEdit ? "Status" : "Connection Information"}
            </h3>

            {/* Customer */}
            {!isEdit && (
              <div className="space-y-2 pb-1">
                <Label htmlFor="customer">
                  Customer<span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formData.customerId ? formData.customerId.toString() : ""}
                  onValueChange={(value) => {
                    handleInputChange("customerId", value)
                    setIsSelectOpen(false)
                  }}
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                >
                  <SelectTrigger className={cn("w-full", formErrors.customerId ? "border-red-700" : "")}>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent className="w-[var(--radix-select-trigger-width)]">
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
                          <SelectItem key={customer.id} value={customer.id.toString()}>
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
                {formErrors.customerId && (
                  <p className="text-sm text-red-700">{formErrors.customerId}</p>
                )}
              </div>
            )}

            {/* Utility Type */}
            {!isEdit && (
              <div className="space-y-4 pb-1">
                <Label>
                  Utility Type<span className="text-red-700">*</span>
                </Label>
                <RadioGroup
                  value={formData.utilityType}
                  onValueChange={(value) => handleInputChange("utilityType", value)}
                  className="flex flex-col sm:flex-row gap-7 md:gap-32 lg:gap-40"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Electricity" id="electricity" />
                    <Label htmlFor="electricity" className="font-normal cursor-pointer">
                      Electricity
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Water" id="water" />
                    <Label htmlFor="water" className="font-normal cursor-pointer">
                      Water
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Gas" id="gas" />
                    <Label htmlFor="gas" className="font-normal cursor-pointer">
                      Gas
                    </Label>
                  </div>
                </RadioGroup>
                {formErrors.utilityType && (
                  <p className="text-sm text-red-700">{formErrors.utilityType}</p>
                )}
              </div>
            )}

            {/* Meter Number */}
            {!isEdit && (
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
            )}

            {/* Tariff Plan */}
            {!isEdit && (
              <div className="space-y-2 pb-1">
                <Label htmlFor="tariffPlan">
                  Tariff Plan<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="tariffPlan"
                  value={formData.tariffPlan}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
                {formErrors.tariffPlan && (
                  <p className="text-sm text-red-700">{formErrors.tariffPlan}</p>
                )}
              </div>
            )}

            {/* Installation Charge */}
            {!isEdit && (
              <div className="space-y-2 pb-1">
                <Label htmlFor="installationCharge">Installation Charge</Label>
                <Input
                  id="installationCharge"
                  value={formData.installationCharge}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
            )}

            {/* Initial Reading - Only show in register mode */}
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

            {/* Status */}
            {isEdit && (
              <div className="space-y-3 pb-2">
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  className="flex flex-col sm:flex-row gap-6 md:gap-16 lg:gap-16"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Active"
                      id="status-active"
                      disabled={selectedCustomerStatus === 'Inactive'}
                    />
                    <Label
                      htmlFor="status-active"
                      className={`font-normal ${selectedCustomerStatus === 'Inactive' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Disconnected" id="status-disconnected" />
                    <Label htmlFor="status-disconnected" className="font-normal cursor-pointer">
                      Disconnected
                    </Label>
                  </div>
                </RadioGroup>

                {selectedCustomerStatus === 'Inactive' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">
                      <span className="font-semibold">⚠️ Customer Inactive:</span> This customer's account is inactive, so all their service connections must remain disconnected. The Active status cannot be selected until the customer account is reactivated.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isEdit && <Separator />}

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
