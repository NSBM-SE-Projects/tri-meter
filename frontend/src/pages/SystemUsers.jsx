import { useState, useEffect } from "react"
import { toast } from "sonner"
import { apiRequest } from "@/lib/api"
import {
  AppSidebar,
  SiteHeader,
  DataTable,
  SidebarProvider,
  Button,
  DeleteDialog,
  ViewDialog,
  Separator,
  Badge,
  UserForm,
} from "@/components"
import { createUserColumns } from "@/components/tables/user-columns"
import { Plus, Loader2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SystemUsers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [imageViewerSrc, setImageViewerSrc] = useState("")
  const [imageViewerTitle, setImageViewerTitle] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await apiRequest('/users')
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserAdded = async (formData, idCardFile, profilePhotoFile) => {
    try {
      setIsLoading(true)

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData()

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key])
        }
      })

      // Append files if they exist
      if (idCardFile) {
        formDataToSend.append('idCard', idCardFile)
      }
      if (profilePhotoFile) {
        formDataToSend.append('profilePhoto', profilePhotoFile)
      }

      const response = await apiRequest('/users', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.success) {
        toast.success("User added successfully!")
        await fetchUsers()
      } else {
        toast.error(response.message || "Failed to add user")
      }
    } catch (error) {
      console.error("Failed to create user:", error)
      toast.error(error.message || "Failed to add user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const openImageViewer = (src, title) => {
    setImageViewerSrc(src)
    setImageViewerTitle(title)
    setIsImageViewerOpen(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleResetPassword = (user) => {
    setSelectedUser(user)
    setNewPassword("")
    setConfirmNewPassword("")
    setPasswordError("")
    setIsResetPasswordDialogOpen(true)
  }

  const handleDeactivate = (user) => {
    setSelectedUser(user)
    setIsDeactivateDialogOpen(true)
  }

  const confirmResetPassword = async () => {
    // Validate password
    if (!newPassword) {
      setPasswordError("Password is required")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    try {
      setIsLoading(true)
      const response = await apiRequest(`/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      })

      if (response.success) {
        toast.success("Password reset successfully!")
        setIsResetPasswordDialogOpen(false)
        setSelectedUser(null)
        setNewPassword("")
        setConfirmNewPassword("")
      } else {
        toast.error(response.message || "Failed to reset password")
      }
    } catch (error) {
      console.error("Failed to reset password:", error)
      toast.error(error.message || "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeactivate = async () => {
    if (!selectedUser) return

    try {
      setIsLoading(true)
      const response = await apiRequest(`/users/${selectedUser.id}/deactivate`, {
        method: 'PUT'
      })

      if (response.success) {
        toast.success("User deactivated successfully!")
        await fetchUsers()
        setIsDeactivateDialogOpen(false)
        setSelectedUser(null)
      } else {
        toast.error(response.message || "Failed to deactivate user")
      }
    } catch (error) {
      console.error("Failed to deactivate user:", error)
      toast.error(error.message || "Failed to deactivate user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSuccess = async (formData, idCardFile, profilePhotoFile) => {
    try {
      setIsLoading(true)

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData()

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key])
        }
      })

      // Append files if they exist
      if (idCardFile) {
        formDataToSend.append('idCard', idCardFile)
      }
      if (profilePhotoFile) {
        formDataToSend.append('profilePhoto', profilePhotoFile)
      }

      const response = await apiRequest(`/users/${selectedUser.id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (response.success) {
        toast.success("User updated successfully!")
        await fetchUsers()
        setIsEditDialogOpen(false)
        setSelectedUser(null)
      } else {
        toast.error(response.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Failed to update user:", error)
      toast.error(error.message || "Failed to update user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Create columns with action handlers
  const userColumns = createUserColumns(
    handleViewDetails,
    handleEdit,
    handleResetPassword,
    handleDeactivate
  )

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background overflow-x-hidden max-w-[100vw]">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-x-hidden max-w-full">
          <SiteHeader />
          <main className="flex-1 p-6 overflow-x-hidden max-w-full">
            <div className="space-y-6 max-w-full overflow-x-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">System Users</h1>
                  <p className="text-muted-foreground">
                    Manage system users and permissions
                  </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : users.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No users found...</p>
                </div>
              ) : (
                <div className="border rounded-lg bg-card max-w-full overflow-x-hidden">
                  <div className="p-6 max-w-full overflow-x-hidden">
                    <div>
                      <p className="text-lg font-medium">User List</p>
                      <p className="text-sm text-muted-foreground">
                        A list of all system users
                      </p>
                    </div>
                    <div className="mt-4">
                    <DataTable
                      columns={userColumns}
                      data={users}
                      filterColumn="fullName"
                      filterPlaceholder="Search users..."
                      filterConfig={[
                        {
                          id: 'role',
                          label: 'Role',
                          options: ['Admin', 'Cashier', 'Field Officer', 'Manager']
                        },
                        {
                          id: 'status',
                          label: 'Status',
                          options: ['Working', 'On Leave', 'Resigned']
                        }
                      ]}
                      showColumnToggle={true}
                    />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add User Dialog */}
      <UserForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleUserAdded}
      />

      {/* View Details Dialog */}
      <ViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="User Details"
        description="View system user information"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <p className="text-sm font-normal text-muted-foreground">User ID</p>
                <p className="text-base">{selectedUser.userId}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Status</p>
                <Badge
                  className={
                    selectedUser.status === 'Working'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : selectedUser.status === 'On Leave'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }
                >
                  {selectedUser.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">User Information</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Full Name</p>
                  <p className="text-base">{selectedUser.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Username</p>
                  <p className="text-base">{selectedUser.username}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Role</p>
                  <Badge
                    className={
                      selectedUser.role === 'Admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : selectedUser.role === 'Cashier'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : selectedUser.role === 'Field Officer'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Registration Date</p>
                  <p className="text-base">{selectedUser.registrationDate}</p>
                </div>
              </div>
            </div>

            {(selectedUser.idCard || selectedUser.profilePhoto) && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-3">Documents</h3>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <p className="text-sm font-normal text-muted-foreground">Identity Validation</p>
                      {selectedUser.idCard ? (
                        <button
                          onClick={() => openImageViewer(selectedUser.idCard, 'Identity Validation')}
                          className="text-sm text-blue-700 hover:underline text-left"
                        >
                          View Document
                        </button>
                      ) : (
                        <p className="text-base text-muted-foreground">Not uploaded</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-normal text-muted-foreground">Profile Photo</p>
                      {selectedUser.profilePhoto ? (
                        <button
                          onClick={() => openImageViewer(selectedUser.profilePhoto, 'Profile Photo')}
                          className="text-sm text-blue-700 hover:underline text-left"
                        >
                          View Photo
                        </button>
                      ) : (
                        <p className="text-base text-muted-foreground">Not uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedUser.profilePhoto && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
                  <div className="flex justify-center">
                    <button
                      onClick={() => openImageViewer(selectedUser.profilePhoto, 'Profile Photo')}
                      className="border rounded-lg overflow-hidden bg-muted/10 shadow-sm max-w-md w-full hover:shadow-md transition-shadow"
                    >
                      <img
                        src={selectedUser.profilePhoto}
                        alt="User Profile"
                        className="w-full h-auto object-contain cursor-pointer"
                        style={{ maxHeight: '280px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not available</text></svg>';
                        }}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Phone</p>
                  <p className="text-base">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Email</p>
                  <p className="text-base">{selectedUser.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Address</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">House No.</p>
                  <p className="text-base">{selectedUser.houseNo}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Street</p>
                  <p className="text-base">{selectedUser.street}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">City</p>
                  <p className="text-base">{selectedUser.city}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewDialog>

      {/* Edit User Dialog */}
      {selectedUser && (
        <UserForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          initialData={selectedUser}
          isEdit={true}
        />
      )}

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setPasswordError("")
                }}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value)
                  setPasswordError("")
                }}
                placeholder="Confirm new password"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmResetPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <DeleteDialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
        title="Deactivate User"
        description="Are you sure you want to deactivate this user? This will set their status to 'Resigned'."
        itemName={selectedUser?.fullName}
        itemId={selectedUser?.userId}
        onConfirm={confirmDeactivate}
        isLoading={isLoading}
        confirmText="Deactivate"
      />

      {/* Image Viewer Dialog */}
      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{imageViewerTitle}</DialogTitle>
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="absolute right-4 top-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
            >
            </button>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <img
              src={imageViewerSrc}
              alt={imageViewerTitle}
              className="max-h-[60vh] max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not available</text></svg>';
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
