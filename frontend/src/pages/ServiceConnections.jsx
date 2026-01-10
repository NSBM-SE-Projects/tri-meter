import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllServiceConnections, createServiceConnection, deleteServiceConnection, updateServiceConnection } from "@/services/serviceConnectionService"
import { getAllCustomers } from "@/services/customerService"
import {
  AppSidebar,
  SiteHeader,
  DataTable,
  SidebarProvider,
  Button,
  createServiceConnectionColumns,
  ServiceConnectionForm,
  ViewDialog,
  DeleteDialog,
  Separator
} from "@/components"
import { Plus, Loader2 } from "lucide-react"

export default function ServiceConnections() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connections, setConnections] = useState([])
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch service connections and customers on component mount
  useEffect(() => {
    fetchConnections()
    fetchCustomers()
  }, [])

  const fetchConnections = async () => {
    try {
      setIsLoading(true)
      const data = await getAllServiceConnections()
      // Deduplicate service connections by ID
      const uniqueConnections = data.filter((connection, index, self) =>
        index === self.findIndex((c) => c.id === connection.id)
      )
      setConnections(uniqueConnections)
    } catch (error) {
      console.error("Failed to fetch service connections:", error)
      toast.error("Failed to load service connections. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers()
      // Deduplicate customers by ID
      const uniqueCustomers = data.filter((customer, index, self) =>
        index === self.findIndex((c) => c.id === customer.id)
      )
      setCustomers(uniqueCustomers)
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      toast.error("Failed to load customers.")
    }
  }

  const handleConnectionAdded = async (formData) => {
    try {
      setIsLoading(true)

      await createServiceConnection(formData)

      // Refresh connections list
      await fetchConnections()

      toast.success("Service connection registered successfully!")
    } catch (error) {
      console.error("Failed to create service connection:", error)
      toast.error(error.message || "Failed to register service connection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Action handlers
  const handleViewDetails = (connection) => {
    setSelectedConnection(connection)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (connection) => {
    setSelectedConnection(connection)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (connection) => {
    setSelectedConnection(connection)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedConnection) return

    try {
      setIsLoading(true)

      await deleteServiceConnection(selectedConnection.id)

      await fetchConnections()

      setIsDeleteDialogOpen(false)
      setSelectedConnection(null)

      toast.success("Service connection deleted successfully!")
    } catch (error) {
      console.error("Failed to delete service connection:", error)
      toast.error(error.message || "Failed to delete service connection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSuccess = async (formData) => {
    try {
      setIsLoading(true)

      await updateServiceConnection(selectedConnection.id, formData)

      await fetchConnections()

      setIsEditDialogOpen(false)
      setSelectedConnection(null)

      toast.success("Service connection updated successfully!")
    } catch (error) {
      console.error("Failed to update service connection:", error)
      toast.error(error.message || "Failed to update service connection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Create columns with action handlers
  const connectionColumns = createServiceConnectionColumns(
    handleViewDetails,
    handleEdit,
    handleDelete
  )

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <SiteHeader />
          <main className="flex-1 p-7">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Service Connections</h1>
                  <p className="text-muted-foreground">
                    Manage customer utility service connections
                  </p>
                </div>
                <div className="flex pt-4 lg:pt-0 gap-2 w-full sm:w-auto">
                  <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Register Connection
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : connections.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No service connections found...</p>
                </div>
              ) : (
                <div className="border rounded-lg bg-card">
                  <div className="p-6">
                    <p className="text-lg font-medium">Service Connection List</p>
                    <p className="text-sm text-muted-foreground pb-3">
                      A list of all service connections in the system
                    </p>
                    <DataTable
                      columns={connectionColumns}
                      data={connections}
                      filterColumn="customerName"
                      filterPlaceholder="Search connections..."
                      filterConfig={[
                        {
                          id: 'utilityType',
                          label: 'Utility Type',
                          options: ['Electricity', 'Water', 'Gas']
                        },
                        {
                          id: 'status',
                          label: 'Status',
                          options: ['Active', 'Disconnected']
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

      {/* Add Service Connection Dialog */}
      <ServiceConnectionForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleConnectionAdded}
        customers={customers}
      />

      {/* View Details Dialog */}
      <ViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="Service Connection Details"
        description="View service connection information"
      >
        {selectedConnection && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Connection ID</p>
                <p className="text-base">{selectedConnection.id}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Status</p>
                <p className="text-base">{selectedConnection.status}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Connection Information</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Customer Name</p>
                  <p className="text-base">{selectedConnection.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Utility Type</p>
                  <p className="text-base">{selectedConnection.utilityType}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Meter Number</p>
                  <p className="text-base">{selectedConnection.meterNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Installation Date</p>
                  <p className="text-base">{selectedConnection.installationDate}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Tariff Plan</p>
                  <p className="text-base">{selectedConnection.tariffPlan}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Service Address</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">House No.</p>
                  <p className="text-base">{selectedConnection.serviceHouseNo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Street</p>
                  <p className="text-base">{selectedConnection.serviceStreet || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">City</p>
                  <p className="text-base">{selectedConnection.serviceCity || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewDialog>

      {/* Edit Service Connection Dialog */}
      {selectedConnection && (
        <ServiceConnectionForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          customers={customers}
          initialData={{
            customer: selectedConnection.customerName || "",
            utilityType: selectedConnection.utilityType || "",
            meterNumber: selectedConnection.meterNumber || "",
            tariffPlan: selectedConnection.tariffPlan || "",
            status: selectedConnection.status || "Active"
          }}
          isEdit={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Service Connection"
        description="Are you sure you want to delete this service connection?"
        itemName={`${selectedConnection?.customerName}'s ${selectedConnection?.utilityType} Connection`}
        itemId={selectedConnection?.id}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </SidebarProvider>
  )
}
