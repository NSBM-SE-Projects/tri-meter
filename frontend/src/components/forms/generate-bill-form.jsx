import { useState, useEffect } from "react"
import { Button, Label, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, DialogDescription } from "@/components"
import { MonthYearPicker } from "@/components/ui/month-year-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { getCustomersForBilling, getServiceConnectionsByCustomer } from "@/services/billService"

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

  const [periodFromOpen, setPeriodFromOpen] = useState(false)
  const [periodToOpen, setPeriodToOpen] = useState(false)

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
      setFormData(prev => ({ ...prev, meterServiceConnection: "" }))
    } else {
      setMeterConnections([])
    }
  }, [formData.customer])

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const data = await getCustomersForBilling()
      setCustomers(data)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoadingCustomers(false)
    }
  }

  const fetchServiceConnections = async (customerId) => {
    try {
      setLoadingConnections(true)
      const data = await getServiceConnectionsByCustomer(customerId)
      setMeterConnections(data)
    } catch (err) {
      console.error('Failed to fetch service connections:', err)
    } finally {
      setLoadingConnections(false)
    }
  }

  // Calculate preview when form data changes
  useEffect(() => {
    if (formData.meterServiceConnection && formData.periodFrom && formData.periodTo) {
      calculatePreview()
    } else {
      setPreview({ consumption: 0, estimatedAmount: 0 })
    }
  }, [formData.meterServiceConnection, formData.periodFrom, formData.periodTo])

  const calculatePreview = () => {
    // Placeholder preview calculation
    // In a real scenario, this would fetch meter readings and calculate consumption
    setPreview({
      consumption: 0,
      estimatedAmount: 0
    })
  }

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto gap-0">
        <DialogHeader>
          <DialogTitle>Generate Bill</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
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
              <Popover open={periodFromOpen} onOpenChange={setPeriodFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${formErrors.periodFrom ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {formData.periodFrom ? format(formData.periodFrom, "MMMM yyyy") : <span>Pick a month</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <MonthYearPicker
                    selected={formData.periodFrom}
                    onSelect={(date) => handleInputChange("periodFrom", date)}
                    onConfirm={() => setPeriodFromOpen(false)}
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
              <Popover open={periodToOpen} onOpenChange={setPeriodToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${formErrors.periodTo ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {formData.periodTo ? format(formData.periodTo, "MMMM yyyy") : <span>Pick a month</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <MonthYearPicker
                    selected={formData.periodTo}
                    onSelect={(date) => handleInputChange("periodTo", date)}
                    onConfirm={() => setPeriodToOpen(false)}
                  />
                </PopoverContent>
              </Popover>
              {formErrors.periodTo && (
                <p className="text-sm text-red-500">{formErrors.periodTo}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-1 pt-5 space-x-2 border-t">
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
