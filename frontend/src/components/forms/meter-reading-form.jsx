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
import { getActiveMeters, getLatestReading } from "@/services/meterReadingService"

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
  const [availableMeters, setAvailableMeters] = useState([])
  const [isLoadingMeters, setIsLoadingMeters] = useState(false)
  const [latestReading, setLatestReading] = useState(null)
  const [calculatedConsumption, setCalculatedConsumption] = useState(null)

  // Fetch active meters when dialog opens
  useEffect(() => {
    if (open) {
      fetchActiveMeters()
    }
  }, [open])

  const fetchActiveMeters = async () => {
    try {
      setIsLoadingMeters(true)
      const meters = await getActiveMeters()
      setAvailableMeters(meters)
    } catch (error) {
      console.error("Failed to fetch meters:", error)
    } finally {
      setIsLoadingMeters(false)
    }
  }

  // Filter meters based on search
  const filteredMeters = availableMeters.filter(meter =>
    meter.meterNumber.toLowerCase().includes(meterSearch.toLowerCase()) ||
    meter.customerName.toLowerCase().includes(meterSearch.toLowerCase())
  )

  // Get selected meter details
  const selectedMeter = availableMeters.find(m => m.id === parseInt(formData.meterNumber))

  // Fetch latest reading when meter is selected
  useEffect(() => {
    const fetchLatestReading = async () => {
      if (formData.meterNumber && !isEdit) {
        try {
          const reading = await getLatestReading(formData.meterNumber)
          setLatestReading(reading)
        } catch (error) {
          console.error("Failed to fetch latest reading:", error)
          setLatestReading(null)
        }
      } else {
        setLatestReading(null)
        setCalculatedConsumption(null)
      }
    }

    fetchLatestReading()
  }, [formData.meterNumber, isEdit])

  // Calculate consumption when current value changes
  useEffect(() => {
    if (latestReading && formData.value && !isNaN(parseFloat(formData.value))) {
      const currentValue = parseFloat(formData.value)
      const previousValue = parseFloat(latestReading.value)
      const consumption = currentValue - previousValue
      setCalculatedConsumption(consumption)
    } else {
      setCalculatedConsumption(null)
    }
  }, [formData.value, latestReading])

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

  // Note: Previous reading is now calculated automatically by the backend

  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.meterNumber) {
      errors.meterNumber = "Meter is required"
    }

    if (!formData.value.trim()) {
      errors.value = "Current reading is required"
    } else if (isNaN(parseFloat(formData.value))) {
      errors.value = "Must be a valid number"
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
    setLatestReading(null)
    setCalculatedConsumption(null)
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Transform form data to match backend API format
      const submissionData = {
        meterId: parseInt(formData.meterNumber),
        readingValue: parseFloat(formData.value),
        readingDate: format(formData.date, "yyyy-MM-dd"),
        isTampered: formData.tampered,
        notes: formData.notes || ""
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl">Record Meter Reading</DialogTitle>
        </DialogHeader>

        {/* Desktop/Tablet Layout (md and up) */}
        <div className="hidden md:block p-6 space-y-6">
          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-6">
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
                      {isLoadingMeters ? (
                        <div className="p-2 text-sm text-center text-muted-foreground">
                          Loading meters...
                        </div>
                      ) : filteredMeters.length > 0 ? (
                        filteredMeters.map((meter) => (
                          <SelectItem key={meter.id} value={meter.id.toString()}>
                            {meter.meterNumber} - {meter.customerName}
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
                  <div className="border-2 rounded-md p-4 space-y-1.5 bg-background">
                    <p className="text-base"><span className="font-medium">Customer:</span> {selectedMeter.customerName}</p>
                    <p className="text-base"><span className="font-medium">Utility:</span> {selectedMeter.utilityType}</p>
                    {latestReading && (
                      <>
                        <p className="text-base"><span className="font-medium">Last Reading:</span> {latestReading.value} {selectedMeter.unit}</p>
                        <p className="text-base"><span className="font-medium">Date:</span> {format(new Date(latestReading.date), "MMM dd, yyyy")}</p>
                      </>
                    )}
                    <p className="text-base"><span className="font-medium">Meter:</span> {selectedMeter.meterNumber}</p>
                  </div>
                ) : (
                  <div className="border-2 rounded-md p-4 bg-muted/30 h-40 flex items-center justify-center">
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
                  rows={6}
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

        {/* Calculated Consumption - Full Width */}
        {selectedMeter && calculatedConsumption !== null && (
          <div className="border-2 rounded-lg p-6 bg-background border-gray-300 dark:border-gray-600">
            <p className="text-xl font-medium text-center mb-3">Calculated Consumption</p>
            <p className="text-5xl font-bold text-center">
              {calculatedConsumption.toFixed(2)} {selectedMeter.unit}
            </p>
          </div>
        )}
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
                  {isLoadingMeters ? (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      Loading meters...
                    </div>
                  ) : filteredMeters.length > 0 ? (
                    filteredMeters.map((meter) => (
                      <SelectItem key={meter.id} value={meter.id.toString()}>
                        {meter.meterNumber} - {meter.customerName}
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
              <p><span className="font-medium">Meter:</span> {selectedMeter.meterNumber}</p>
              <p><span className="font-medium">Customer:</span> {selectedMeter.customerName}</p>
              <p><span className="font-medium">Utility:</span> {selectedMeter.utilityType}</p>
              <p><span className="font-medium">Unit:</span> {selectedMeter.unit}</p>
            </div>
          )}

          {/* Calculated Consumption */}
          {selectedMeter && calculatedConsumption !== null && (
            <div className="space-y-2">
              <div className="border-2 rounded-lg p-4 bg-background border-gray-300 dark:border-gray-600">
                <p className="text-base font-medium text-center mb-2">Calculated Consumption</p>
                <p className="text-3xl font-bold text-center">
                  {calculatedConsumption.toFixed(2)} {selectedMeter.unit}
                </p>
              </div>
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
