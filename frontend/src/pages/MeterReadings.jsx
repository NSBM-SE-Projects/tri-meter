import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllMeterReadings, createMeterReading, deleteMeterReading, updateMeterReading } from "@/services/meterReadingService"
import {
  AppSidebar,
  SiteHeader,
  DataTable,
  SidebarProvider,
  Button,
  createMeterReadingColumns,
  MeterReadingForm,
  ViewDialog,
  DeleteDialog,
  Separator
} from "@/components"
import { Plus, Loader2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MeterReadings() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedReading, setSelectedReading] = useState(null)
  const [readings, setReadings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch meter readings on component mount
  useEffect(() => {
    fetchReadings()
  }, [])

  const fetchReadings = async () => {
    try {
      setIsLoading(true)
      const data = await getAllMeterReadings()
      setReadings(data)
    } catch (error) {
      console.error("Failed to fetch meter readings:", error)
      toast.error("Failed to load meter readings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReadingAdded = async (formData) => {
    try {
      setIsLoading(true)

      const newReading = await createMeterReading(formData)

      // Add to readings list
      setReadings(prev => [newReading, ...prev])

      toast.success("Meter reading added successfully!")

      await fetchReadings()
    } catch (error) {
      console.error("Failed to create meter reading:", error)
      // Check for 403
      if (error.statusCode === 403) {
        window.location.href = '/#/access-denied'
        return
      }
      toast.error(error.message || "Failed to add meter reading. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Action handlers
  const handleViewDetails = (reading) => {
    setSelectedReading(reading)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (reading) => {
    setSelectedReading(reading)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (reading) => {
    setSelectedReading(reading)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedReading) return

    try {
      setIsLoading(true)
      await deleteMeterReading(selectedReading.id)

      // Remove from readings list
      setReadings(prev => prev.filter(r => r.id !== selectedReading.id))

      setIsDeleteDialogOpen(false)
      setSelectedReading(null)

      toast.success("Meter reading deleted successfully!")
    } catch (error) {
      console.error("Failed to delete meter reading:", error)
      // Check 403
      if (error.statusCode === 403) {
        window.location.href = '/#/access-denied'
        return
      }
      toast.error(error.message || "Failed to delete meter reading. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSuccess = async (formData) => {
    try {
      setIsLoading(true)

      const updatedReading = await updateMeterReading(
        selectedReading.id,
        formData
      )

      // Update in readings list
      setReadings(prev => prev.map(r =>
        r.id === selectedReading.id ? updatedReading : r
      ))

      setIsEditDialogOpen(false)
      setSelectedReading(null)

      toast.success("Meter reading updated successfully!")

      await fetchReadings()
    } catch (error) {
      console.error("Failed to update meter reading:", error)
      // Check 403
      if (error.statusCode === 403) {
        window.location.href = '/#/access-denied'
        return
      }
      toast.error(error.message || "Failed to update meter reading. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const readingColumns = createMeterReadingColumns(
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
                  <h1 className="text-3xl font-bold">Meter Readings</h1>
                  <p className="text-muted-foreground">
                    Record and view meter consumption data
                  </p>
                </div>
                <div className="flex pt-4 lg:pt-0 gap-2 w-full sm:w-auto">
                  <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reading
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : readings.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No meter readings found...</p>
                </div>
              ) : (
                <div className="border rounded-lg bg-card">
                  <div className="p-6">
                    <p className="text-lg font-medium">Meter Reading List</p>
                    <p className="text-sm text-muted-foreground pb-3">
                      A list of all recorded meter readings in the system
                    </p>
                    <DataTable
                      columns={readingColumns}
                      data={readings}
                      filterColumn="meterNumber"
                      filterPlaceholder="Search readings..."
                      filterConfig={[
                        {
                          id: 'utilityType',
                          label: 'Utility',
                          options: ['Electricity', 'Water', 'Gas']
                        },
                        {
                          id: 'month',
                          label: 'Period',
                          options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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

      {/* Add Meter Reading Dialog */}
      <MeterReadingForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleReadingAdded}
      />

      {/* View Details Dialog */}
      <ViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="Meter Reading Details"
        description="View meter reading information"
      >
        {selectedReading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Reading ID</p>
                <p className="text-base">{selectedReading.id}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Meter Number</p>
                <p className="text-base">{selectedReading.meterNumber}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Reading Information</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Date</p>
                  <p className="text-base">{selectedReading.date}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Utility Type</p>
                  <p className="text-base">{selectedReading.utilityType}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Current Value</p>
                  <p className="text-base">{selectedReading.value}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Previous Value</p>
                  <p className="text-base">{selectedReading.previousValue}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Consumption</p>
                  <p className="text-base">{selectedReading.consumption}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Tampered</p>
                  {selectedReading.tampered ? (
                    <Badge variant="destructive" className="mt-1">
                      <AlertTriangle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1">No</Badge>
                  )}
                </div>
              </div>
            </div>

            {selectedReading.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-3">Notes</h3>
                  <p className="text-base text-muted-foreground">{selectedReading.notes}</p>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Field Officer</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-sm font-normal text-muted-foreground">Officer Name</p>
                  <p className="text-base">{selectedReading.fieldOfficer || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewDialog>

      {/* Edit Meter Reading Dialog */}
      {selectedReading && (
        <MeterReadingForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          initialData={{
            meterNumber: selectedReading.meterId?.toString() || "",
            date: selectedReading.date || "",
            value: selectedReading.value || "",
            previousValue: selectedReading.previousValue || "",
            tampered: selectedReading.tampered || false,
            notes: selectedReading.notes || "",
            fieldOfficer: selectedReading.fieldOfficer || ""
          }}
          isEdit={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Meter Reading"
        description="Are you sure you want to delete this meter reading?"
        itemName={`Reading for ${selectedReading?.meterNumber}`}
        itemId={selectedReading?.id}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </SidebarProvider>
  )
}
