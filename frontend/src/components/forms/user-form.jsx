import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export function UserForm({ open, onOpenChange, onSuccess, initialData, isEdit = false }) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
    email: "",
    houseNo: "",
    street: "",
    city: "",
    status: "Working",
  })

  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [idCardFile, setIdCardFile] = useState(null)
  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [idCardFileName, setIdCardFileName] = useState("")
  const [profilePhotoFileName, setProfilePhotoFileName] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        username: initialData.username || "",
        password: "",
        confirmPassword: "",
        role: initialData.role || "",
        phone: initialData.phone?.replace("+94", "") || "",
        email: initialData.email || "",
        houseNo: initialData.houseNo || "",
        street: initialData.street || "",
        city: initialData.city || "",
        status: initialData.status || "Working",
      })
    } else {
      resetForm()
    }
  }, [initialData, open])

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName) {
      errors.fullName = "Full name is required"
    } else if (formData.fullName.length > 100) {
      errors.fullName = "Full name must be less than 100 characters"
    }

    if (!isEdit) {
      if (!formData.username) {
        errors.username = "Username is required"
      } else if (formData.username.length > 50) {
        errors.username = "Username must be less than 50 characters"
      }

      if (!formData.password) {
        errors.password = "Password is required"
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm password"
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    if (!formData.role) {
      errors.role = "Role is required"
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{9}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 9 digits"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format"
    }

    if (!formData.houseNo) {
      errors.houseNo = "House number is required"
    }

    if (!formData.street) {
      errors.street = "Street is required"
    }

    if (!formData.city) {
      errors.city = "City is required"
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (type === 'idCard') {
        setIdCardFile(file)
        setIdCardFileName(file.name)
      } else if (type === 'profilePhoto') {
        setProfilePhotoFile(file)
        setProfilePhotoFileName(file.name)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
      phone: "",
      email: "",
      houseNo: "",
      street: "",
      city: "",
      status: "Working",
    })
    setFormErrors({})
    setIdCardFile(null)
    setProfilePhotoFile(null)
    setIdCardFileName("")
    setProfilePhotoFileName("")
  }

  const handleSubmit = () => {
    if (validateForm()) {
      if (onSuccess) {
        const submitData = {
          ...formData,
          phone: `+94${formData.phone}`,
        }
        // Remove password fields if editing
        if (isEdit) {
          delete submitData.password
          delete submitData.confirmPassword
          delete submitData.username
        } else {
          delete submitData.confirmPassword
        }
        onSuccess(submitData, idCardFile, profilePhotoFile)
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
      <DialogContent className="max-w-[80vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto gap-7 md:gap-0 lg:gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-background">
        <DialogHeader className="px-3 sm:px-6 md:px-3">
          <DialogTitle className="text-2xl">
            {isEdit ? "Edit User" : "New User"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit ? "Update user information" : "Fill in the user information below"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-3 space-y-4 sm:px-14 md:px-16 lg:px-20 sm:pt-6 md:pt-8 sm:space-y-7">
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">User Information</h3>

            <div className="pb-1 space-y-2">
              <Label htmlFor="fullName">
                Full Name<span className="text-red-700">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={formErrors.fullName ? "border-red-700" : ""}
                placeholder="Enter full name"
                maxLength={100}
              />
              {formErrors.fullName && (
                <p className="text-sm text-red-700">{formErrors.fullName}</p>
              )}
            </div>

            {!isEdit && (
              <div className="pb-1 space-y-2">
                <Label htmlFor="username">
                  Username<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={formErrors.username ? "border-red-700" : ""}
                  placeholder="Enter username"
                  maxLength={50}
                />
                {formErrors.username && (
                  <p className="text-sm text-red-700">{formErrors.username}</p>
                )}
              </div>
            )}

            {!isEdit && (
              <>
                <div className="pb-1 space-y-2">
                  <Label htmlFor="password">
                    Password<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={formErrors.password ? "border-red-700" : ""}
                    placeholder="Enter password"
                  />
                  {formErrors.password && (
                    <p className="text-sm text-red-700">{formErrors.password}</p>
                  )}
                </div>

                <div className="pb-1 space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={formErrors.confirmPassword ? "border-red-700" : ""}
                    placeholder="Confirm password"
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-700">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            <div className="pb-1 space-y-2">
              <Label htmlFor="role">
                Role<span className="text-red-700">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className={formErrors.role ? "border-red-700" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Field Officer">Field Officer</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && (
                <p className="text-sm text-red-700">{formErrors.role}</p>
              )}
            </div>

            {isEdit && (
              <div className="pb-1 space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Working">Working</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Resigned">Resigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="pb-1 space-y-2">
                <Label htmlFor="phone">
                  Phone No.<span className="text-red-700">*</span>
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    +94
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className={`rounded-l-none ${formErrors.phone ? "border-red-700" : ""}`}
                    placeholder="771234567"
                    maxLength={9}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-sm text-red-700">{formErrors.phone}</p>
                )}
              </div>

              <div className="pb-1 space-y-2">
                <Label htmlFor="email">
                  Email<span className="text-red-700">*</span>
                </Label>
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
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="pb-1 space-y-2">
                <Label htmlFor="houseNo">
                  House No.<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="houseNo"
                  value={formData.houseNo}
                  onChange={(e) => handleInputChange("houseNo", e.target.value)}
                  className={formErrors.houseNo ? "border-red-700" : ""}
                  placeholder="123"
                />
                {formErrors.houseNo && (
                  <p className="text-sm text-red-700">{formErrors.houseNo}</p>
                )}
              </div>

              <div className="pb-1 space-y-2">
                <Label htmlFor="street">
                  Street<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className={formErrors.street ? "border-red-700" : ""}
                  placeholder="Main Street"
                />
                {formErrors.street && (
                  <p className="text-sm text-red-700">{formErrors.street}</p>
                )}
              </div>

              <div className="pb-1 space-y-2">
                <Label htmlFor="city">
                  City<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={formErrors.city ? "border-red-700" : ""}
                  placeholder="Colombo"
                />
                {formErrors.city && (
                  <p className="text-sm text-red-700">{formErrors.city}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documents</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="pb-1 space-y-2">
                <Label htmlFor="idCard">Identity Validation (NIC/BRN)</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="idCard"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'idCard')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('idCard').click()}
                    className="w-full"
                  >
                    Upload File
                  </Button>
                  {idCardFileName && (
                    <p className="text-sm truncate text-muted-foreground">
                      Selected: {idCardFileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="pb-1 space-y-2">
                <Label htmlFor="profilePhoto">Profile Picture</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profilePhoto')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('profilePhoto').click()}
                    className="w-full"
                  >
                    Upload File
                  </Button>
                  {profilePhotoFileName && (
                    <p className="text-sm truncate text-muted-foreground">
                      Selected: {profilePhotoFileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-5 px-10 pb-2 pt-7 lg:pt-10 md:px-5 sm:flex-row lg:gap-3">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
