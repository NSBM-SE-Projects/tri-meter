import { useState, useEffect, useRef } from "react"
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
  Textarea,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  DialogDescription,
} from "@/components"
import { Calendar as CalendarIcon, Search, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { getActiveMeters, getLatestReading } from "@/services/meterReadingService"
import { cn } from "@/lib/utils"

export function MeterReadingForm({ open, onOpenChange, onSuccess, initialData = null, isEdit = false }) {
  const [meterSearch, setMeterSearch] = useState("")
  const [availableMeters, setAvailableMeters] = useState([])
  const [isLoadingMeters, setIsLoadingMeters] = useState(false)
  const [latestReading, setLatestReading] = useState(null)
  const [calculatedConsumption, setCalculatedConsumption] = useState(null)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const searchInputRef = useRef(null)
  const [isMouseOverList, setIsMouseOverList] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    meterNumber: "",
    date: null,
    value: "",
    previousValue: "",
    tampered: false,
    notes: ""
  })

  // Fetch active meters when dialog opens
  useEffect(() => {
    if (open) {
      fetchActiveMeters()
    }
  }, [open])

  useEffect(() => {
    if (isSelectOpen) {
      setMeterSearch("")
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
      if (formData.meterNumber) {
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

  // Check if meter is tampered
  const isTampered = () => {
    if (latestReading && formData.value && !isNaN(parseFloat(formData.value))) {
      const currentValue = parseFloat(formData.value)
      const previousValue = parseFloat(latestReading.value)
      return previousValue > currentValue
    }
    return false
  }

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        ...initialData,
        meterNumber: initialData.meterNumber?.toString() || "",
        date: initialData.date ? new Date(initialData.date) : null
      })
    } else if (initialData) {
      setFormData({
        ...initialData,
        meterNumber: initialData.meterNumber?.toString() || "",
        date: initialData.date ? new Date(initialData.date) : null
      })
    } else {
      resetForm()
    }
  }, [initialData, open, isEdit, availableMeters])

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
      const submissionData = {
        meterId: parseInt(formData.meterNumber),
        readingValue: parseFloat(formData.value),
        readingDate: format(formData.date, "yyyy-MM-dd"),
        isTampered: isTampered(),
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
      <DialogContent className="max-w-[80vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-background">
        <DialogHeader className="px-6 md:px-3 lg:px-3">
          <DialogTitle className="text-2xl">
            {isEdit ? "Edit Meter Reading" : "Record Meter Reading"} 
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit ? "Update meter record information" : "Fill in the latest reading details below "}
          </DialogDescription>
        </DialogHeader>

        {/* Desktop/Tablet Layout (md and up) */}
        <div className="hidden p-5 pt-8 space-y-6 md:block">
          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-14">
              {/* Meter Selection */}
              <div className="space-y-2">
                <Label htmlFor="meter">
                  Meter<span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formData.meterNumber}
                  onValueChange={(value) => {
                    handleInputChange("meterNumber", value)
                    setMeterSearch("")
                  }}
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                  disabled={isEdit || isLoadingMeters}
                >
                  <SelectTrigger className={cn("w-full", formErrors.meterNumber ? "border-red-700" : "")}>
                    {isLoadingMeters ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading meters...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select meter" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="w-[var(--radix-select-trigger-width)]">
                    <div className="sticky top-0 z-10 p-2 border-b bg-background">
                      <div className="relative">
                        <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                        <Input
                          ref={searchInputRef}
                          placeholder="Search meters..."
                          value={meterSearch}
                          onChange={(e) => setMeterSearch(e.target.value)}
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
                      {filteredMeters.length > 0 ? (
                        filteredMeters.map((meter) => (
                          <SelectItem key={meter.id} value={meter.id.toString()}>
                            {meter.meterNumber}: {meter.customerName}
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
                  <p className="text-sm text-red-700">{formErrors.meterNumber}</p>
                )}
              </div>

              {/* Meter Details */}
              <div className="space-y-2">
                <Label>Meter Details</Label>
                {selectedMeter ? (
                  <div className="border-2 rounded-md p-4 space-y-1.5 bg-muted/25 text-sm text-muted-foreground">
                    <p><span>Utility:</span> {selectedMeter.utilityType}</p>
                    <p><span>Unit:</span> {selectedMeter.unit}</p>
                    {latestReading && (
                      <>
                        <p><span>Last Reading:</span> {latestReading.value} {selectedMeter.unit}</p>
                        <p><span>Date:</span> {format(new Date(latestReading.date), "dd MMM, yyyy")}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 p-4 border-2 rounded-md bg-muted/30">
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
            <div className="space-y-5">
            {/* Current Reading Display */}
            <div className="space-y-2">
              <Label>
                Current Reading<span className="text-red-700">*</span>
              </Label>
              <div className="p-3 border-2 rounded-md bg-background">
                <p className="text-4xl font-bold break-words">
                  {formData.value || "0"}
                </p>
              </div>
              {formErrors.value && (
                <p className="text-sm text-red-700">{formErrors.value}</p>
              )}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-4 gap-4">
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
                className="h-16 font-semibold bg-green-500 hover:bg-green-700"
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
                variant="default"
                size="lg"
                className="h-16 font-semibold bg-red-500 hover:bg-red-700"
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

            {/* Reading Date */}
            <div className="space-y-2">
              <Label>
                Reading Month<span className="text-red-700">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild >
                  <Button
                    variant="outline"
                    className="justify-start w-full h-12 gap-2 font-normal text-left"
                  >
                    <CalendarIcon className="w-5 h-5 mr-1" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                  <PopoverContent className="w-64 p-1 mt-1" align="center">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => handleInputChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date && (
                <p className="text-sm text-red-700">{formErrors.date}</p>
              )}
            </div>
          </div>
        </div>

        {/* Calculated Consumption  */}
        {selectedMeter && calculatedConsumption !== null && (
            <div className={cn("border-2 rounded-md p-3 bg-background", isTampered() ? "border-red-700" : "border-gray-300 dark:border-neutral-700")}>
            
            {isTampered() ? (
              <p className="text-4xl font-bold text-center text-red-700">
                TAMPERED
              </p>
              ) : (
              <>
              <p className="mb-3 text-lg font-medium text-center">Calculated Consumption</p>
              <p className="text-4xl font-bold text-center">
                {calculatedConsumption.toFixed(2)} {selectedMeter.unit}
              </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Layout (below md) */}
        <div className="px-4 py-6 space-y-5 md:hidden">
          {/* Meter Selection */}
          <div className="space-y-2">
            <Label htmlFor="meter-mobile">
              Meter<span className="text-red-700">*</span>
            </Label>
            <Select
              value={formData.meterNumber}
              onValueChange={(value) => {
                handleInputChange("meterNumber", value)
                setMeterSearch("")
              }}
              disabled={isEdit}
            >
              <SelectTrigger className={cn("w-full", formErrors.meterNumber ? "border-red-700" : "")}>
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <div className="sticky top-0 z-10 p-2 border-b bg-background">
                  <div className="relative">
                    <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search meters..."
                      value={meterSearch}
                      onChange={(e) => setMeterSearch(e.target.value)}
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
                  { filteredMeters.length > 0 ? (
                    filteredMeters.map((meter) => (
                      <SelectItem key={meter.id} value={meter.id.toString()}>
                        {meter.meterNumber}: {meter.customerName}
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
              <p className="text-sm text-red-700">{formErrors.meterNumber}</p>
            )}
          </div>

          {/* Meter Details */}
          {selectedMeter && (
            <div className="border-2 rounded-md p-3 space-y-1.5 bg-muted/25 text-sm text-muted-foreground">
              <p><span>Utility:</span> {selectedMeter.utilityType}</p>
              <p><span>Unit:</span> {selectedMeter.unit}</p>
              {latestReading && (
                <>
                  <p><span>Last Reading:</span> {latestReading.value} {selectedMeter.unit}</p>
                  <p><span>Date:</span> {format(new Date(latestReading.date), "dd MMM, yyyy")}</p>
                </>
              )}
            </div>
          )}

          {/* Calculated Consumption */}
          {selectedMeter && calculatedConsumption !== null && (
            <div>
              <div className={cn("border-2 rounded-md p-4 bg-background", isTampered() ? "border-red-700" : "border-gray-300 dark:border-neutral-700")}>

                {isTampered() ? (
                  <p className="text-3xl font-bold text-center text-red-700">
                    TAMPERED
                  </p>
                ) : (
                  <>
                    <p className="mb-2 text-sm font-medium text-center">Calculated Consumption</p>
                    <p className="text-2xl font-bold text-center">
                      {calculatedConsumption.toFixed(2)} {selectedMeter.unit}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Current Reading */}
          <div className="space-y-2">
            <Label htmlFor="value-mobile">
              Current Reading<span className="text-red-700">*</span>
            </Label>
            <Input
              id="value-mobile"
              type="number"
              value={formData.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              className={formErrors.value ? "border-red-700" : ""}
              placeholder="Enter current reading"
            />
            {formErrors.value && (
              <p className="text-sm text-red-700">{formErrors.value}</p>
            )}
          </div>

          {/* Reading Date */}
          <div className="space-y-2">
            <Label>
              Reading Date<span className="text-red-700">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start w-full h-12 gap-2 font-normal text-left"
                >
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-1 mt-1 mb-1" align="center">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formErrors.date && (
              <p className="text-sm text-red-700">{formErrors.date}</p>
            )}
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

        <DialogFooter className="flex-col-reverse gap-5 px-10 pb-2 pt-7 lg:pt-10 md:px-5 sm:flex-row lg:gap-4">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            {isEdit ? "Update Reading" : "Save Reading"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
