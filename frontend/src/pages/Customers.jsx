import { useState, useEffect } from "react"
import { getAllCustomers, createCustomer, deleteCustomer, updateCustomer } from "@/services/customerService"
import {
  AppSidebar,
  SiteHeader,
  DataTable,
  SidebarProvider,
  Button,
} from "@/components"
import { CustomerForm } from "@/components"
import { createCustomerColumns } from "@/components/tables/customer-columns"
import { UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Customers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const data = await getAllCustomers()
      setCustomers(data)
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      alert("Failed to load customers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomerAdded = async (formData, uploadedFile) => {
    try {
      setIsLoading(true)

      // Create customer
      const newCustomer = await createCustomer(formData)

      // Add to customers list
      setCustomers(prev => [newCustomer, ...prev])

      // Show success message
      alert("Customer added successfully!")

      // Refresh customer list
      await fetchCustomers()
    } catch (error) {
      console.error("Failed to create customer:", error)
      alert(error.message || "Failed to add customer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Action handlers
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCustomer) return

    try {
      setIsLoading(true)
      await deleteCustomer(selectedCustomer.id)

      // Remove from customers list
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id))

      alert("Customer deleted successfully!")
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
    } catch (error) {
      console.error("Failed to delete customer:", error)
      alert(error.message || "Failed to delete customer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSuccess = async (formData) => {
    try {
      setIsLoading(true)

      // Update customer
      const updatedCustomer = await updateCustomer(selectedCustomer.id, {
        ...formData,
        status: selectedCustomer.status
      })

      // Update in customers list
      setCustomers(prev => prev.map(c =>
        c.id === selectedCustomer.id ? updatedCustomer : c
      ))

      alert("Customer updated successfully!")

      setIsEditDialogOpen(false)
      setSelectedCustomer(null)

      // Refresh customer list
      await fetchCustomers()
    } catch (error) {
      console.error("Failed to update customer:", error)
      alert(error.message || "Failed to update customer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Create columns with action handlers
  const customerColumns = createCustomerColumns(
    handleViewDetails,
    handleEdit,
    handleDelete
  )

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-7">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Customers</h1>
                  <p className="text-muted-foreground">
                    Manage all customer accounts
                  </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>

              <div className="border rounded-lg bg-card">
                <div className="p-6">
                  <p className="text-lg font-medium">Customer List</p>
                  <p className="text-sm text-muted-foreground pb-3">
                    A list of all registered customers in the system
                  </p>
                  <div className="overflow-x-auto px-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">Loading customers...</p>
                      </div>
                    ) : customers.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">No customers found. Add your first customer!</p>
                      </div>
                    ) : (
                      <DataTable
                        columns={customerColumns}
                        data={customers}
                        filterColumn="name"
                        filterPlaceholder="Search customers..."
                        filterConfig={[
                          {
                            id: 'type',
                            label: 'Type',
                            options: ['Household', 'Business', 'Government']
                          },
                          {
                            id: 'status',
                            label: 'Status',
                            options: ['Active', 'Pending', 'Inactive']
                          }
                        ]}
                        showColumnToggle={true}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Customer Dialog */}
      <CustomerForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleCustomerAdded}
      />

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Customer ID</p>
                  <p className="text-base">{selectedCustomer.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Status</p>
                  <p className="text-base">{selectedCustomer.status}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Full Name</p>
                    <p className="text-base">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Customer Type</p>
                    <p className="text-base">{selectedCustomer.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Identity Proof</p>
                    <p className="text-base">{selectedCustomer.idProof}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                    <p className="text-base">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Email</p>
                    <p className="text-base">{selectedCustomer.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">House No.</p>
                    <p className="text-base">{selectedCustomer.houseNo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Street</p>
                    <p className="text-base">{selectedCustomer.street}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">City</p>
                    <p className="text-base">{selectedCustomer.city}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      {selectedCustomer && (
        <CustomerForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          initialData={{
            fullName: selectedCustomer.name || "",
            customerType: selectedCustomer.type || "Household",
            identityValidation: selectedCustomer.idProof || "",
            phone: selectedCustomer.phone?.replace("+94", "") || "",
            email: selectedCustomer.email || "",
            houseNo: selectedCustomer.houseNo || "",
            street: selectedCustomer.street || "",
            city: selectedCustomer.city || ""
          }}
          isEdit={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer?
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This will permanently delete <span className="font-semibold">{selectedCustomer.name}</span> (ID: {selectedCustomer.id}) from the system.
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
