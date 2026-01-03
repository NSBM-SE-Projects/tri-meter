import { useState, useEffect } from "react"
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
} from "@/components"
import { Upload } from "lucide-react"

export function CustomerForm({ open, onOpenChange, onSuccess, initialData = null, isEdit = false }) {
  const [uploadedFile, setUploadedFile] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    customerType: "Household",
    identityValidation: "",
    phone: "",
    phone2: "",
    email: "",
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
      // Reset to default when adding new customer
      setFormData({
        fullName: "",
        customerType: "Household",
        identityValidation: "",
        phone: "",
        phone2: "",
        email: "",
        houseNo: "",
        street: "",
        city: "",
        status: "Active"
      })
    }
  }, [initialData, open])

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
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Primary phone number is required"
    } else if (!/^\d{9}$/.test(formData.phone)) {
      errors.phone = "Phone must be 9 digits"
    }

    // Phone2 validation
    if (formData.phone2 && formData.phone2.trim()) {
      if (!/^\d{9}$/.test(formData.phone2)) {
        errors.phone2 = "Phone must be 9 digits"
      } else if (formData.phone2 === formData.phone) {
        errors.phone2 = "Secondary phone must be different from primary"
      }
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
      // Code to send file to database
    }
  }

  const triggerFileUpload = () => {
    document.getElementById("idFileUpload").click()
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      customerType: "Household",
      identityValidation: "",
      phone: "",
      phone2: "",
      email: "",
      houseNo: "",
      street: "",
      city: "",
      status: "Active"
    })
    setFormErrors({})
    setUploadedFile(null)
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const submissionData = {
        ...formData,
        phone: `+94${formData.phone}`,
        phone2: formData.phone2 ? `+94${formData.phone2}` : null
      };

      console.log("Form submitted:", submissionData);
      console.log("Uploaded file:", uploadedFile);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(submissionData, uploadedFile);
      }

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-7 md:gap-0 lg:gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-background">
        <DialogHeader className="px-3 sm:px-6 md:px-3">
          <DialogTitle className="text-2xl">{isEdit ? "Edit Customer" : "New Customer"}</DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit ? "Update customer information" : "Fill in the customer information below"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-3 sm:px-14 md:px-16 lg:px-20 sm:pt-6 md:pt-8 space-y-4 sm:space-y-7">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>

            <div className="space-y-2 pb-1">
              <Label htmlFor="fullName">
                Full Name<span className="text-red-700">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={formErrors.fullName ? "border-red-700" : ""}
              />
              {formErrors.fullName && (
                <p className="text-sm text-red-700">{formErrors.fullName}</p>
              )}
            </div>

            <div className="space-y-4 pb-1">
              <Label>
                Customer Type<span className="text-red-700">*</span>
              </Label>
              <RadioGroup
                value={formData.customerType}
                onValueChange={(value) => handleInputChange("customerType", value)}
                className="flex flex-col sm:flex-row gap-7 md:gap-24 lg:gap-28"
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

            <div className="space-y-3 pb-1">
              <Label htmlFor="identityValidation">
                Identity Validation (NIC/BRN/GOV)<span className="text-red-700">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="identityValidation"
                  value={formData.identityValidation}
                  onChange={(e) => handleInputChange("identityValidation", e.target.value)}
                  className={`flex-1 ${formErrors.identityValidation ? "border-red-700" : ""}`}
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
                <p className="text-sm text-red-700">{formErrors.identityValidation}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>

            <div className="space-y-2 pb-1">
              <Label htmlFor="phone">
                Primary Phone<span className="text-red-700">*</span>
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-4 rounded-l-lg bg-muted">
                  <span className="text-sm text-muted-foreground">+94</span>
                </div>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value.replaceAll(/\D/g, ""))}
                  className={`rounded-l-none ${formErrors.phone ? "border-red-700" : ""}`}
                  maxLength={9}
                  placeholder="771234567"
                />
              </div>
              {formErrors.phone && (
                <p className="text-sm text-red-700">{formErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2 pb-1">
              <Label htmlFor="phone2">Secondary Phone (Optional)<span className="text-red-700">*</span></Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-4 rounded-l-lg bg-muted">
                  <span className="text-sm text-muted-foreground">+94</span>
                </div>
                <Input
                  id="phone2"
                  value={formData.phone2}
                  onChange={(e) => handleInputChange("phone2", e.target.value.replaceAll(/\D/g, ""))}
                  className={`rounded-l-none ${formErrors.phone2 ? "border-red-700" : ""}`}
                  maxLength={9}
                  placeholder="112345678"
                />
              </div>
              {formErrors.phone2 && (
                <p className="text-sm text-red-700">{formErrors.phone2}</p>
              )}
            </div>

            <div className="space-y-2 pb-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={formErrors.email ? "border-red-700" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-red-700">{formErrors.email}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium">Address</h3>

            <div className="space-y-2">
              <Label htmlFor="houseNo">
                House No.<span className="text-red-700">*</span>
              </Label>
              <Input
                id="houseNo"
                value={formData.houseNo}
                onChange={(e) => handleInputChange("houseNo", e.target.value)}
                className={formErrors.houseNo ? "border-red-700" : ""}
              />
              {formErrors.houseNo && (
                <p className="text-sm text-red-700">{formErrors.houseNo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">
                Street<span className="text-red-700">*</span>
              </Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className={formErrors.street ? "border-red-700" : ""}
              />
              {formErrors.street && (
                <p className="text-sm text-red-700">{formErrors.street}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                City<span className="text-red-700">*</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={formErrors.city ? "border-red-700" : ""}
              />
              {formErrors.city && (
                <p className="text-sm text-red-700">{formErrors.city}</p>
              )}
            </div>
          </div>

          {/* Status */}
          {isEdit && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium">Status</h3>
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                    className="flex flex-col sm:flex-row gap-6 md:gap-12 lg:gap-12"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Active" id="status-active" />
                      <Label htmlFor="status-active" className="font-normal cursor-pointer">
                        Active
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Inactive" id="status-inactive" />
                      <Label htmlFor="status-inactive" className="font-normal cursor-pointer">
                        Inactive
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="pt-7 lg:pt-10 px-10 md:px-5 pb-2 flex-col-reverse sm:flex-row gap-5 lg:gap-3">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            {isEdit ? "Update Customer" : "Save Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
