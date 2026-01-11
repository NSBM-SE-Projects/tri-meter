import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function TariffForm({ open, onOpenChange, onSuccess, initialData, isEdit = false, utilityType }) {
  const [formData, setFormData] = useState({
    utilityType: utilityType || "Electricity",
    planName: "",
    validFrom: null,
    validTo: null,
    description: "",
    installationCharge: "",
    // Electricity fields
    slab1Max: "",
    slab1Rate: "",
    slab2Max: "",
    slab2Rate: "",
    slab3Rate: "",
    // Water fields
    flatRate: "",
    fixedCharge: "",
    // Gas fields
    subsidyAmount: "",
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      // Convert string dates to Date objects
      let validFromDate = null
      let validToDate = null

      if (initialData.validFrom && initialData.validFrom !== 'Present') {
        validFromDate = new Date(initialData.validFrom)
      }

      if (initialData.validTo && initialData.validTo !== 'Present' && initialData.validTo !== '') {
        validToDate = new Date(initialData.validTo)
      }

      setFormData({
        ...initialData,
        utilityType: utilityType || initialData.utilityType || "Electricity",
        validFrom: validFromDate,
        validTo: validToDate,
      })
    } else {
      resetForm()
    }
  }, [initialData, open, utilityType])

  const validateForm = () => {
    const errors = {}

    if (!formData.planName) {
      errors.planName = "Plan name is required"
    }

    if (!formData.validFrom) {
      errors.validFrom = "Valid from date is required"
    }

    // Validate based on utility type
    if (formData.utilityType === "Electricity") {
      if (!formData.slab1Max || formData.slab1Max <= 0) {
        errors.slab1Max = "Slab 1 max is required"
      }
      if (!formData.slab1Rate || formData.slab1Rate < 0) {
        errors.slab1Rate = "Slab 1 rate is required"
      }
      if (!formData.slab2Max || formData.slab2Max <= 0) {
        errors.slab2Max = "Slab 2 max is required"
      }
      if (!formData.slab2Rate || formData.slab2Rate < 0) {
        errors.slab2Rate = "Slab 2 rate is required"
      }
      if (!formData.slab3Rate || formData.slab3Rate < 0) {
        errors.slab3Rate = "Slab 3 rate is required"
      }
    } else if (formData.utilityType === "Water") {
      if (!formData.flatRate || formData.flatRate < 0) {
        errors.flatRate = "Flat rate is required"
      }
      if (!formData.fixedCharge || formData.fixedCharge < 0) {
        errors.fixedCharge = "Fixed charge is required"
      }
    } else if (formData.utilityType === "Gas") {
      if (!formData.slab1Max || formData.slab1Max <= 0) {
        errors.slab1Max = "Slab 1 max is required"
      }
      if (!formData.slab1Rate || formData.slab1Rate < 0) {
        errors.slab1Rate = "Slab 1 rate is required"
      }
      if (!formData.slab2Rate || formData.slab2Rate < 0) {
        errors.slab2Rate = "Slab 2 rate is required"
      }
      if (!formData.subsidyAmount || formData.subsidyAmount < 0) {
        errors.subsidyAmount = "Subsidy amount is required"
      }
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
      utilityType: utilityType || "Electricity",
      planName: "",
      validFrom: null,
      validTo: null,
      description: "",
      installationCharge: "",
      slab1Max: "",
      slab1Rate: "",
      slab2Max: "",
      slab2Rate: "",
      slab3Rate: "",
      flatRate: "",
      fixedCharge: "",
      subsidyAmount: "",
    })
    setFormErrors({})
  }

  const handleSubmit = () => {
    if (validateForm()) {
      if (onSuccess) {
        // Convert Date objects to YYYY-MM-DD format for API
        const submitData = {
          ...formData,
          validFrom: formData.validFrom ? format(formData.validFrom, "yyyy-MM-dd") : null,
          validTo: formData.validTo ? format(formData.validTo, "yyyy-MM-dd") : null,
        }
        onSuccess(submitData)
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
          <DialogTitle className="text-2xl">
            {isEdit ? "Edit Tariff" : `Add ${formData.utilityType} Tariff`}
          </DialogTitle>
        </DialogHeader>

        <div className="px-16 pt-6 pb-16 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tariff Information</h3>

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="utilityType">
                  Utility Type<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.utilityType}
                  onValueChange={(value) => handleInputChange("utilityType", value)}
                  disabled={isEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select utility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="planName">
                Plan Name<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.planName}
                onValueChange={(value) => handleInputChange("planName", value)}
              >
                <SelectTrigger className={formErrors.planName ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Household">Household</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.planName && (
                <p className="text-sm text-red-500">{formErrors.planName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">
                  Valid From<span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.validFrom && "text-muted-foreground",
                        formErrors.validFrom && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validFrom ? format(formData.validFrom, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.validFrom}
                      onSelect={(date) => handleInputChange("validFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.validFrom && (
                  <p className="text-sm text-red-500">{formErrors.validFrom}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="validTo">Valid To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.validTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validTo ? format(formData.validTo, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.validTo}
                      onSelect={(date) => handleInputChange("validTo", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installationCharge">
                Installation Charge ($)
              </Label>
              <Input
                id="installationCharge"
                type="number"
                step="0.01"
                value={formData.installationCharge}
                onChange={(e) => handleInputChange("installationCharge", e.target.value)}
                className={formErrors.installationCharge ? "border-red-500" : ""}
                placeholder="e.g., 100.00"
              />
              {formErrors.installationCharge && (
                <p className="text-sm text-red-500">{formErrors.installationCharge}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Utility-specific fields */}
          {formData.utilityType === "Electricity" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Electricity Tariff Slabs</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slab1Max">
                    Slab 1 Max (kWh)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab1Max"
                    type="number"
                    value={formData.slab1Max}
                    onChange={(e) => handleInputChange("slab1Max", e.target.value)}
                    className={formErrors.slab1Max ? "border-red-500" : ""}
                    placeholder="e.g., 100"
                  />
                  {formErrors.slab1Max && (
                    <p className="text-sm text-red-500">{formErrors.slab1Max}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slab1Rate">
                    Slab 1 Rate ($/kWh)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab1Rate"
                    type="number"
                    step="0.01"
                    value={formData.slab1Rate}
                    onChange={(e) => handleInputChange("slab1Rate", e.target.value)}
                    className={formErrors.slab1Rate ? "border-red-500" : ""}
                    placeholder="e.g., 0.10"
                  />
                  {formErrors.slab1Rate && (
                    <p className="text-sm text-red-500">{formErrors.slab1Rate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slab2Max">
                    Slab 2 Max (kWh)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab2Max"
                    type="number"
                    value={formData.slab2Max}
                    onChange={(e) => handleInputChange("slab2Max", e.target.value)}
                    className={formErrors.slab2Max ? "border-red-500" : ""}
                    placeholder="e.g., 200"
                  />
                  {formErrors.slab2Max && (
                    <p className="text-sm text-red-500">{formErrors.slab2Max}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slab2Rate">
                    Slab 2 Rate ($/kWh)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab2Rate"
                    type="number"
                    step="0.01"
                    value={formData.slab2Rate}
                    onChange={(e) => handleInputChange("slab2Rate", e.target.value)}
                    className={formErrors.slab2Rate ? "border-red-500" : ""}
                    placeholder="e.g., 0.15"
                  />
                  {formErrors.slab2Rate && (
                    <p className="text-sm text-red-500">{formErrors.slab2Rate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slab3Rate">
                    Slab 3 Rate ($/kWh)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab3Rate"
                    type="number"
                    step="0.01"
                    value={formData.slab3Rate}
                    onChange={(e) => handleInputChange("slab3Rate", e.target.value)}
                    className={formErrors.slab3Rate ? "border-red-500" : ""}
                    placeholder="e.g., 0.20"
                  />
                  {formErrors.slab3Rate && (
                    <p className="text-sm text-red-500">{formErrors.slab3Rate}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.utilityType === "Water" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Water Tariff Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flatRate">
                    Flat Rate ($/unit)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="flatRate"
                    type="number"
                    step="0.01"
                    value={formData.flatRate}
                    onChange={(e) => handleInputChange("flatRate", e.target.value)}
                    className={formErrors.flatRate ? "border-red-500" : ""}
                    placeholder="e.g., 1.50"
                  />
                  {formErrors.flatRate && (
                    <p className="text-sm text-red-500">{formErrors.flatRate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixedCharge">
                    Fixed Charge ($)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fixedCharge"
                    type="number"
                    step="0.01"
                    value={formData.fixedCharge}
                    onChange={(e) => handleInputChange("fixedCharge", e.target.value)}
                    className={formErrors.fixedCharge ? "border-red-500" : ""}
                    placeholder="e.g., 10.00"
                  />
                  {formErrors.fixedCharge && (
                    <p className="text-sm text-red-500">{formErrors.fixedCharge}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.utilityType === "Gas" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gas Tariff Slabs</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slab1Max">
                    Slab 1 Max (units)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab1Max"
                    type="number"
                    value={formData.slab1Max}
                    onChange={(e) => handleInputChange("slab1Max", e.target.value)}
                    className={formErrors.slab1Max ? "border-red-500" : ""}
                    placeholder="e.g., 50"
                  />
                  {formErrors.slab1Max && (
                    <p className="text-sm text-red-500">{formErrors.slab1Max}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slab1Rate">
                    Slab 1 Rate ($/unit)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab1Rate"
                    type="number"
                    step="0.01"
                    value={formData.slab1Rate}
                    onChange={(e) => handleInputChange("slab1Rate", e.target.value)}
                    className={formErrors.slab1Rate ? "border-red-500" : ""}
                    placeholder="e.g., 0.50"
                  />
                  {formErrors.slab1Rate && (
                    <p className="text-sm text-red-500">{formErrors.slab1Rate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slab2Rate">
                    Slab 2 Rate ($/unit)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slab2Rate"
                    type="number"
                    step="0.01"
                    value={formData.slab2Rate}
                    onChange={(e) => handleInputChange("slab2Rate", e.target.value)}
                    className={formErrors.slab2Rate ? "border-red-500" : ""}
                    placeholder="e.g., 0.75"
                  />
                  {formErrors.slab2Rate && (
                    <p className="text-sm text-red-500">{formErrors.slab2Rate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subsidyAmount">
                    Subsidy Amount ($)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subsidyAmount"
                    type="number"
                    step="0.01"
                    value={formData.subsidyAmount}
                    onChange={(e) => handleInputChange("subsidyAmount", e.target.value)}
                    className={formErrors.subsidyAmount ? "border-red-500" : ""}
                    placeholder="e.g., 50.00"
                  />
                  {formErrors.subsidyAmount && (
                    <p className="text-sm text-red-500">{formErrors.subsidyAmount}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Update Tariff" : "Add Tariff"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
