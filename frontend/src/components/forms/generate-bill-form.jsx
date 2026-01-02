import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { apiRequest } from "@/lib/api"

export function GenerateBillForm({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    customer: "",
    meterServiceConnection: "",
    periodFrom: null,
    periodTo: null,
  })

  const [formErrors, setFormErrors] = useState({})
  const [preview, setPreview] = useState({
    consumption: 0,
    estimatedAmount: 0,
  })

  // Real data from API
  const [customers, setCustomers] = useState([])
  const [meterConnections, setMeterConnections] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingConnections, setLoadingConnections] = useState(false)

  // Fetch customers on mount
  useEffect(() => {
    if (open) {
      fetchCustomers()
    }
  }, [open])

  // Fetch service connections when customer changes
  useEffect(() => {
    if (formData.customer) {
      fetchServiceConnections(formData.customer)
      // Reset meter/service connection when customer changes
      setFormData(prev => ({ ...prev, meterServiceConnection: "" }))
    } else {
      setMeterConnections([])
    }
  }, [formData.customer])

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const response = await apiRequest('/bills/customers')
      if (response.success) {
        setCustomers(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoadingCustomers(false)
    }
  }

  const fetchServiceConnections = async (customerId) => {
    try {
      setLoadingConnections(true)
      const response = await apiRequest(`/bills/service-connections/${customerId}`)
      if (response.success) {
        setMeterConnections(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch service connections:', err)
    } finally {
      setLoadingConnections(false)
    }
  }

  // Calculate preview when form data changes
  useEffect(() => {
    if (formData.meterServiceConnection && formData.periodFrom && formData.periodTo) {
      // Mock calculation - replace with actual API call
      const consumption = 100
      const estimatedAmount = 45.0
      setPreview({ consumption, estimatedAmount })
    } else {
      setPreview({ consumption: 0, estimatedAmount: 0 })
    }
  }, [formData.meterServiceConnection, formData.periodFrom, formData.periodTo])

  const validateForm = () => {
    const errors = {}

    if (!formData.customer) {
      errors.customer = "Customer is required"
    }

    if (!formData.meterServiceConnection) {
      errors.meterServiceConnection = "Meter/Service Connection is required"
    }

    if (!formData.periodFrom) {
      errors.periodFrom = "From date is required"
    }

    if (!formData.periodTo) {
      errors.periodTo = "To date is required"
    }

    if (formData.periodFrom && formData.periodTo && formData.periodFrom > formData.periodTo) {
      errors.periodTo = "To date must be after From date"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({
      customer: "",
      meterServiceConnection: "",
      periodFrom: null,
      periodTo: null,
    })
    setFormErrors({})
    setPreview({ consumption: 0, estimatedAmount: 0 })
  }

  const handleSubmit = () => {
    if (validateForm()) {
      if (onSuccess) {
        onSuccess(formData)
      }
      resetForm()
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl">Generate Bill</DialogTitle>
        </DialogHeader>

        <div className="px-16 pt-6 pb-16 space-y-6">
          {/* Bill Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bill Information</h3>

            <div className="space-y-2">
            <Label htmlFor="customer">
              Customer<span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.customer}
              onValueChange={(value) => handleInputChange("customer", value)}
              disabled={loadingCustomers}
            >
              <SelectTrigger className={formErrors.customer ? "border-red-500" : ""}>
                <SelectValue placeholder={loadingCustomers ? "Loading customers..." : "Select customer"} />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.customerId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.customer && (
              <p className="text-sm text-red-500">{formErrors.customer}</p>
            )}
            </div>

            <div className="space-y-2">
            <Label htmlFor="meterServiceConnection">
              Meter/Service Connection<span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.meterServiceConnection}
              onValueChange={(value) => handleInputChange("meterServiceConnection", value)}
              disabled={!formData.customer || loadingConnections}
            >
              <SelectTrigger className={formErrors.meterServiceConnection ? "border-red-500" : ""}>
                <SelectValue placeholder={
                  !formData.customer
                    ? "Select customer first"
                    : loadingConnections
                      ? "Loading connections..."
                      : meterConnections.length === 0
                        ? "No connections available"
                        : "Select meter/service connection"
                } />
              </SelectTrigger>
              <SelectContent>
                {meterConnections.map((connection) => (
                  <SelectItem key={connection.id} value={connection.id}>
                    {connection.meter} - {connection.customer} ({connection.utility})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.meterServiceConnection && (
              <p className="text-sm text-red-500">{formErrors.meterServiceConnection}</p>
            )}
            </div>
          </div>

          <Separator />

          {/* Billing Period */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing Period</h3>

            <div className="space-y-2">
              <Label htmlFor="periodFrom">
                From<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${formErrors.periodFrom ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.periodFrom ? format(formData.periodFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.periodFrom}
                    onSelect={(date) => handleInputChange("periodFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.periodFrom && (
                <p className="text-sm text-red-500">{formErrors.periodFrom}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodTo">
                To<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${formErrors.periodTo ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.periodTo ? format(formData.periodTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.periodTo}
                    onSelect={(date) => handleInputChange("periodTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.periodTo && (
                <p className="text-sm text-red-500">{formErrors.periodTo}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Preview Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="border-2 rounded-lg p-6 bg-muted/30 space-y-2">
              <p className="text-base">
                <span className="font-medium">Consumption:</span> {preview.consumption} kWh
              </p>
              <p className="text-base">
                <span className="font-medium">Estimated Amount:</span> ${preview.estimatedAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Generate Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
