import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllCustomers, createCustomer, updateCustomer } from "@/services/customerService"
import {
  AppSidebar,
  SiteHeader,
  DataTable,
  SidebarProvider,
  Button,
  createCustomerColumns,
  CustomerForm,
  ViewDialog,
  Separator
} from "@/components"
import { UserPlus, Loader2 } from "lucide-react"

export default function Customers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
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
      toast.error("Failed to load customers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomerAdded = async (formData, uploadedFile) => {
    try {
      setIsLoading(true)

      const newCustomer = await createCustomer(formData, uploadedFile)

      // Add to customers list
      setCustomers(prev => [newCustomer, ...prev])

      // Show success toast
      toast.success("Customer added successfully!")

      // Refresh customer list
      await fetchCustomers()
    } catch (error) {
      console.error("Failed to create customer:", error)
      toast.error(error.message || "Failed to add customer. Please try again.")
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
    // Parse phone numbers from comma-separated string
    const phoneNumbers = customer.phones
      ? customer.phones.split(', ').map(p => p.replace('+94', ''))
      : []

    setSelectedCustomer({
      ...customer,
      parsedPhone: phoneNumbers[0] || '',
      parsedPhone2: phoneNumbers[1] || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = async (formData, uploadedFile) => {
    try {
      setIsLoading(true)

      const updatedCustomer = await updateCustomer(
        selectedCustomer.id,
        {
          ...formData,
          status: formData.status
        },
        uploadedFile
      )

      // Update in customers list
      setCustomers(prev => prev.map(c =>
        c.id === selectedCustomer.id ? updatedCustomer : c
      ))

      setIsEditDialogOpen(false)
      setSelectedCustomer(null)

      // Show success toast
      toast.success("Customer updated successfully!")

      // Refresh customer list
      await fetchCustomers()
    } catch (error) {
      console.error("Failed to update customer:", error)
      toast.error(error.message || "Failed to update customer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Create columns with action handlers
  const customerColumns = createCustomerColumns(
    handleViewDetails,
    handleEdit
  )

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <SiteHeader />
          <main className="flex-1 p-7">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold">Customers</h1>
                  <p className="text-muted-foreground">
                    Manage all customer accounts
                  </p>
                </div>
                <div className="flex w-full gap-2 pt-4 lg:pt-0 sm:w-auto">
                  <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : customers.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No customers found...</p>
                </div>
              ) : (
                <div className="border rounded-lg bg-card">
                  <div className="p-6">
                    <p className="text-lg font-medium">Customer List</p>
                    <p className="pb-3 text-sm text-muted-foreground">
                      A list of all registered customers in the system
                    </p>
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
                          options: ['Active', 'Inactive']
                        }
                      ]}
                      showColumnToggle={true}
                    />
                  </div>
                </div>
              )}
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
      <ViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="Customer Details"
        description="View customer information"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Customer ID</p>
                <p className="text-base">{selectedCustomer.id}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Status</p>
                <p className="text-base">{selectedCustomer.status}</p>
              </div>
            </div>

            <Separator />
            <div>
              <h3 className="mb-3 text-lg font-medium">Customer Information</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Full Name</p>
                  <p className="text-base">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Customer Type</p>
                  <p className="text-base">{selectedCustomer.type}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Identity Proof</p>
                  <p className="text-base">{selectedCustomer.idProof}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">ID Image</p>
                  {selectedCustomer.idImageUrl ? (
                    <a
                      href={selectedCustomer.idImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:underline"
                    >
                      View Image
                    </a>
                  ) : (
                    <p className="text-base text-muted-foreground">No image uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {selectedCustomer.idImageUrl && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-4 text-lg font-medium">Identity Document</h3>
                  <div className="flex justify-center">
                    <div className="w-full max-w-md overflow-hidden border rounded-lg shadow-sm bg-muted/10">
                      <img
                        src={selectedCustomer.idImageUrl}
                        alt="Customer ID Document"
                        className="object-contain w-full h-auto"
                        style={{ maxHeight: '280px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not available</text></svg>';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Phone Number(s)</p>
                  <p className="text-base">{selectedCustomer.phones || selectedCustomer.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Email</p>
                  <p className="text-base">{selectedCustomer.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <Separator />
            <div>
              <h3 className="mb-3 text-lg font-medium">Address</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">House No.</p>
                  <p className="text-base">{selectedCustomer.houseNo}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Street</p>
                  <p className="text-base">{selectedCustomer.street}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">City</p>
                  <p className="text-base">{selectedCustomer.city}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewDialog>

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
            phone: selectedCustomer.parsedPhone || "",
            phone2: selectedCustomer.parsedPhone2 || "",
            email: selectedCustomer.email || "",
            houseNo: selectedCustomer.houseNo || "",
            street: selectedCustomer.street || "",
            city: selectedCustomer.city || "",
            status: selectedCustomer.status || "Active"
          }}
          isEdit={true}
        />
      )}
    </SidebarProvider>
  )
}
