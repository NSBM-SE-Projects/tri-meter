import { useState, useEffect } from "react"
import { toast } from "sonner"
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

// Sample test data for frontend testing
const sampleConnectionsData = [
  {
    id: "1",
    customerName: "John Smith",
    utilityType: "Electricity",
    meterNumber: "E-12345",
    installationDate: "11th Dec 2024",
    tariffPlan: "Residential",
    status: "Active",
  },
  {
    id: "2",
    customerName: "Dwain Dias",
    utilityType: "Water",
    meterNumber: "W-23456",
    installationDate: "15th Nov 2024",
    tariffPlan: "Commercial",
    status: "Active",
  },
  {
    id: "3",
    customerName: "Ashen",
    utilityType: "Gas",
    meterNumber: "G-34567",
    installationDate: "20th Oct 2024",
    tariffPlan: "Residential",
    status: "Disconnected",
  },
  {
    id: "4",
    customerName: "Sarah Johnson",
    utilityType: "Electricity",
    meterNumber: "E-45678",
    installationDate: "5th Dec 2024",
    tariffPlan: "Industrial",
    status: "Active",
  },
  {
    id: "5",
    customerName: "Mike Brown",
    utilityType: "Water",
    meterNumber: "W-56789",
    installationDate: "1st Nov 2024",
    tariffPlan: "Residential",
    status: "Disconnected",
  },
  {
    id: "6",
    customerName: "Emily Chen",
    utilityType: "Electricity",
    meterNumber: "E-67890",
    installationDate: "10th Dec 2024",
    tariffPlan: "Residential",
    status: "Active",
  },
  {
    id: "7",
    customerName: "David Wilson",
    utilityType: "Gas",
    meterNumber: "G-78901",
    installationDate: "25th Oct 2024",
    tariffPlan: "Commercial",
    status: "Active",
  },
  {
    id: "8",
    customerName: "Lisa Anderson",
    utilityType: "Water",
    meterNumber: "W-89012",
    installationDate: "3rd Nov 2024",
    tariffPlan: "Industrial",
    status: "Pending",
  },
  {
    id: "9",
    customerName: "Robert Taylor",
    utilityType: "Electricity",
    meterNumber: "E-90123",
    installationDate: "18th Nov 2024",
    tariffPlan: "Residential",
    status: "Disconnected",
  },
  {
    id: "10",
    customerName: "Jennifer Martinez",
    utilityType: "Gas",
    meterNumber: "G-01234",
    installationDate: "8th Dec 2024",
    tariffPlan: "Commercial",
    status: "Active",
  },
]

export default function ServiceConnections() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connections, setConnections] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch service connections on component mount
  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      setIsLoading(true)
      // TODO: Uncomment when backend is ready
      // const data = await getAllServiceConnections()
      // setConnections(data)

      // Using sample data for frontend testing
      setConnections(sampleConnectionsData)
    } catch (error) {
      console.error("Failed to fetch service connections:", error)
      toast.error("Failed to load service connections. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectionAdded = async (formData) => {
    try {
      setIsLoading(true)

      // TODO: Uncomment when backend is ready
      // const newConnection = await createServiceConnection(formData)

      // Using local data for frontend testing
      const newConnection = {
        id: String(connections.length + 1),
        customerName: formData.customer,
        utilityType: formData.utilityType,
        meterNumber: formData.meterNumber,
        installationDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        tariffPlan: formData.tariffPlan,
        status: formData.status,
      }

      // Add to connections list
      setConnections(prev => [newConnection, ...prev])

      toast.success("Service connection registered successfully!")

      // Refresh connection list
      await fetchConnections()
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

      // TODO: Uncomment when backend is ready
      // await deleteServiceConnection(selectedConnection.id)

      // Using local data for frontend testing
      // Remove from connections list
      setConnections(prev => prev.filter(c => c.id !== selectedConnection.id))

      setIsDeleteDialogOpen(false)
      setSelectedConnection(null)

      // Show success toast
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

      // TODO: Uncomment when backend is ready
      // const updatedConnection = await updateServiceConnection(
      //   selectedConnection.id,
      //   {
      //     ...formData,
      //     status: formData.status
      //   }
      // )

      // Using local data for frontend testing
      const updatedConnection = {
        ...selectedConnection,
        meterNumber: formData.meterNumber,
        tariffPlan: formData.tariffPlan,
        status: formData.status
      }

      // Update in connections list
      setConnections(prev => prev.map(c =>
        c.id === selectedConnection.id ? updatedConnection : c
      ))

      setIsEditDialogOpen(false)
      setSelectedConnection(null)

      // Show success toast
      toast.success("Service connection updated successfully!")

      // Refresh connection list
      await fetchConnections()
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
                          options: ['Active', 'Disconnected', 'Pending']
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
          </div>
        )}
      </ViewDialog>

      {/* Edit Service Connection Dialog */}
      {selectedConnection && (
        <ServiceConnectionForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
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
        itemName={selectedConnection?.meterNumber}
        itemId={selectedConnection?.id}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      >
        {selectedConnection && (
          <p className="text-sm text-muted-foreground">
            This will permanently delete service connection <span className="font-semibold">{selectedConnection.meterNumber}</span> for <span className="font-semibold">{selectedConnection.customerName}</span>.
          </p>
        )}
      </DeleteDialog>
    </SidebarProvider>
  )
}
