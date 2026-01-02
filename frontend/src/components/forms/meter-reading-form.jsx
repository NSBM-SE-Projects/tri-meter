import { useState, useEffect } from "react"
import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Textarea,
} from "@/components"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"

export function MeterReadingForm({ open, onOpenChange, onSuccess, initialData = null, isEdit = false }) {
  // Form state
  const [formData, setFormData] = useState({
    meterNumber: "",
    date: null,
    value: "",
    previousValue: "",
    tampered: false,
    notes: ""
  })

  const [meterSearch, setMeterSearch] = useState("")

  // Mock meter data
  const [availableMeters] = useState([
    { id: "E-12345", customer: "John Smith", utility: "Electricity", lastReading: "1150", lastReadingDate: "Nov 26, 2024" },
    { id: "W-67890", customer: "Jane Doe", utility: "Water", lastReading: "800", lastReadingDate: "Nov 25, 2024" },
    { id: "G-34567", customer: "ABC Corp", utility: "Gas", lastReading: "400", lastReadingDate: "Nov 27, 2024" },
    { id: "E-23456", customer: "Sarah Wilson", utility: "Electricity", lastReading: "2000", lastReadingDate: "Nov 28, 2024" },
    { id: "W-78901", customer: "Mike Brown", utility: "Water", lastReading: "920", lastReadingDate: "Nov 29, 2024" },
  ])

  // Filter meters based on search
  const filteredMeters = availableMeters.filter(meter =>
    meter.id.toLowerCase().includes(meterSearch.toLowerCase()) ||
    meter.customer.toLowerCase().includes(meterSearch.toLowerCase())
  )

  // Get selected meter details
  const selectedMeter = availableMeters.find(m => m.id === formData.meterNumber)

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? new Date(initialData.date) : null
      })
    } else {
      resetForm()
    }
  }, [initialData, open])

  // Auto-fill previous value when meter is selected
  useEffect(() => {
    if (selectedMeter && !isEdit) {
      setFormData(prev => ({
        ...prev,
        previousValue: selectedMeter.lastReading
      }))
    }
  }, [selectedMeter, isEdit])

  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.meterNumber) {
      errors.meterNumber = "Meter is required"
    }

    if (!formData.value.trim()) {
      errors.value = "Current reading is required"
    } else if (selectedMeter && parseInt(formData.value) < parseInt(selectedMeter.lastReading) && !formData.tampered) {
      errors.value = "Must be greater than previous reading unless reset"
    }

    if (!formData.date) {
      errors.date = "Reading date is required"
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

  const handleNumberPadClick = (num) => {
    setFormData(prev => ({
      ...prev,
      value: prev.value + num.toString()
    }))
    if (formErrors.value) {
      setFormErrors(prev => ({ ...prev, value: undefined }))
    }
  }

  const handleClear = () => {
    setFormData(prev => ({ ...prev, value: "" }))
  }

  const handleEnter = () => {
    // Auto-focus to date picker or submit
    if (formData.value && formData.date) {
      handleSubmit()
    }
  }

  const resetForm = () => {
    setFormData({
      meterNumber: "",
      date: null,
      value: "",
      previousValue: "",
      tampered: false,
      notes: ""
    })
    setFormErrors({})
    setMeterSearch("")
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const consumption = parseInt(formData.value) - parseInt(formData.previousValue)
      const unit = selectedMeter?.utility === "Electricity" ? "kWh" : "m³"

      const submissionData = {
        ...formData,
        date: format(formData.date, "MMM dd, yyyy"),
        consumption: String(consumption) + unit,
        utilityType: selectedMeter?.utility,
        customerName: selectedMeter?.customer,
        month: format(formData.date, "MMMM"),
        fieldOfficer: "System User" // Default value
      }

      if (onSuccess) {
        onSuccess(submissionData)
      }

      resetForm()
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  // Calculate consumption
  const calculatedConsumption = () => {
    if (!formData.value || !formData.previousValue) return "0"
    const consumption = parseInt(formData.value) - parseInt(formData.previousValue)
    if (consumption < 0 && !formData.tampered) return "Invalid"
    return consumption
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl">Record Meter Reading</DialogTitle>
        </DialogHeader>

        {/* Desktop/Tablet Layout (md and up) */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 p-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Meter Selection */}
            <div className="space-y-2">
              <Label htmlFor="meter">
                Meter<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.meterNumber}
                onValueChange={(value) => {
                  handleInputChange("meterNumber", value)
                  setMeterSearch("")
                }}
                disabled={isEdit}
              >
                <SelectTrigger className={formErrors.meterNumber ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select meter" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 z-10 p-2 border-b bg-background">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search meters..."
                        value={meterSearch}
                        onChange={(e) => setMeterSearch(e.target.value)}
                        className="h-8 pl-8"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {filteredMeters.length > 0 ? (
                      filteredMeters.map((meter) => (
                        <SelectItem key={meter.id} value={meter.id}>
                          {meter.id}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        No meters found
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
              {formErrors.meterNumber && (
                <p className="text-sm text-red-500">{formErrors.meterNumber}</p>
              )}
            </div>

            {/* Meter Details */}
            <div className="space-y-2">
              <Label>Meter Details</Label>
              {selectedMeter ? (
                <div className="border-2 rounded-md p-4 space-y-1 bg-muted/30">
                  <p className="text-sm"><span className="font-medium">Customer:</span> {selectedMeter.customer}</p>
                  <p className="text-sm"><span className="font-medium">Utility:</span> {selectedMeter.utility}</p>
                  <p className="text-sm"><span className="font-medium">Last Reading:</span> {selectedMeter.lastReading} {selectedMeter.utility === "Electricity" ? "kWh" : "m³"}</p>
                  <p className="text-sm"><span className="font-medium">Date:</span> {selectedMeter.lastReadingDate}</p>
                  <p className="text-sm"><span className="font-medium">Meter:</span></p>
                </div>
              ) : (
                <div className="border-2 rounded-md p-4 bg-muted/30 h-32 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Select a meter to view details</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add any notes here..."
                rows={5}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Reading Display */}
            <div className="space-y-2">
              <Label>
                Current Reading<span className="text-red-500">*</span>
              </Label>
              <div className="border-2 rounded-lg p-8 text-center bg-background">
                <div className="text-6xl font-bold">
                  {formData.value || "0"}
                </div>
              </div>
              {formErrors.value && (
                <p className="text-sm text-red-500">{formErrors.value}</p>
              )}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3].map(num => (
                <Button
                  key={num}
                  variant="outline"
                  size="lg"
                  className="h-16 text-2xl font-semibold"
                  onClick={() => handleNumberPadClick(num)}
                  type="button"
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="default"
                size="lg"
                className="h-16 bg-green-600 hover:bg-green-700 font-semibold"
                onClick={handleEnter}
                type="button"
              >
                Enter
              </Button>

              {[4, 5, 6].map(num => (
                <Button
                  key={num}
                  variant="outline"
                  size="lg"
                  className="h-16 text-2xl font-semibold"
                  onClick={() => handleNumberPadClick(num)}
                  type="button"
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="destructive"
                size="lg"
                className="h-16 font-semibold"
                onClick={handleClear}
                type="button"
              >
                Clear
              </Button>

              {[7, 8, 9, 0].map(num => (
                <Button
                  key={num}
                  variant="outline"
                  size="lg"
                  className="h-16 text-2xl font-semibold"
                  onClick={() => handleNumberPadClick(num)}
                  type="button"
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Authorized Reset Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tampered"
                checked={formData.tampered}
                onCheckedChange={(checked) => handleInputChange("tampered", checked)}
              />
              <label htmlFor="tampered" className="text-sm font-medium cursor-pointer">
                Authorized Meter Reset
              </label>
            </div>

            {/* Reading Date */}
            <div className="space-y-2">
              <Label>
                Reading Date<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => handleInputChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date && (
                <p className="text-sm text-red-500">{formErrors.date}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout (below md) */}
        <div className="md:hidden px-4 py-6 space-y-6">
          {/* Meter Selection */}
          <div className="space-y-2">
            <Label htmlFor="meter-mobile">
              Meter<span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.meterNumber}
              onValueChange={(value) => {
                handleInputChange("meterNumber", value)
                setMeterSearch("")
              }}
              disabled={isEdit}
            >
              <SelectTrigger className={formErrors.meterNumber ? "border-red-500" : ""}>
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent>
                <div className="sticky top-0 z-10 p-2 border-b bg-background">
                  <div className="relative">
                    <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search meters..."
                      value={meterSearch}
                      onChange={(e) => setMeterSearch(e.target.value)}
                      className="h-8 pl-8"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredMeters.length > 0 ? (
                    filteredMeters.map((meter) => (
                      <SelectItem key={meter.id} value={meter.id}>
                        {meter.id}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      No meters found
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
            {formErrors.meterNumber && (
              <p className="text-sm text-red-500">{formErrors.meterNumber}</p>
            )}
          </div>

          {/* Meter Details */}
          {selectedMeter && (
            <div className="border-2 rounded-md p-3 space-y-1 bg-muted/30 text-sm">
              <p><span className="font-medium">Customer:</span> {selectedMeter.customer}</p>
              <p><span className="font-medium">Utility:</span> {selectedMeter.utility}</p>
              <p><span className="font-medium">Last Reading:</span> {selectedMeter.lastReading} {selectedMeter.utility === "Electricity" ? "kWh" : "m³"}</p>
              <p><span className="font-medium">Date:</span> {selectedMeter.lastReadingDate}</p>
            </div>
          )}

          {/* Current Reading */}
          <div className="space-y-2">
            <Label htmlFor="value-mobile">
              Current Reading<span className="text-red-500">*</span>
            </Label>
            <Input
              id="value-mobile"
              type="number"
              value={formData.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              className={formErrors.value ? "border-red-500" : ""}
              placeholder="Enter current reading"
            />
            {formErrors.value && (
              <p className="text-sm text-red-500">{formErrors.value}</p>
            )}
          </div>

          {/* Calculated Consumption */}
          {formData.value && formData.previousValue && (
            <div className="border rounded-lg p-4 text-center bg-muted/50">
              <h4 className="text-sm font-medium mb-1 text-muted-foreground">Calculated Consumption</h4>
              <p className="text-2xl font-bold">
                {calculatedConsumption()} {selectedMeter ? (selectedMeter.utility === "Electricity" ? "kWh" : "m³") : ""}
              </p>
            </div>
          )}

          {/* Reading Date */}
          <div className="space-y-2">
            <Label>
              Reading Date<span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formErrors.date && (
              <p className="text-sm text-red-500">{formErrors.date}</p>
            )}
          </div>

          {/* Authorized Reset */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tampered-mobile"
              checked={formData.tampered}
              onCheckedChange={(checked) => handleInputChange("tampered", checked)}
            />
            <label htmlFor="tampered-mobile" className="text-sm font-medium cursor-pointer">
              Authorized Meter Reset
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes-mobile">Notes</Label>
            <Textarea
              id="notes-mobile"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add any notes..."
              rows={3}
            />
          </div>
        </div>

        {/* Calculated Consumption (Desktop/Tablet only) */}
        <div className="hidden md:block px-6">
          <div className="border rounded-lg p-6 text-center bg-muted/50">
            <h3 className="text-lg font-semibold mb-2">Calculated Consumption</h3>
            <p className="text-4xl font-bold">
              {calculatedConsumption()} {selectedMeter ? (selectedMeter.utility === "Electricity" ? "kWh" : "m³") : ""}
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Save Reading
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
