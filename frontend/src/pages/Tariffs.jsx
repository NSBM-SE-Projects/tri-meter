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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components"
import { TariffForm } from "@/components/forms/tariff-form"
import {
  createElectricityTariffColumns,
  createWaterTariffColumns,
  createGasTariffColumns
} from "@/components/tables/tariff-columns"
import { Plus, Loader2 } from "lucide-react"

export default function Tariffs() {
  const [activeTab, setActiveTab] = useState("electricity")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTariff, setSelectedTariff] = useState(null)
  const [tariffs, setTariffs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tariffs on component mount and when tab changes
  useEffect(() => {
    fetchTariffs()
  }, [])

  const fetchTariffs = async () => {
    try {
      setIsLoading(true)
      const response = await apiRequest('/tariffs')
      if (response.success) {
        setTariffs(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch tariffs:", error)
      toast.error("Failed to load tariffs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTariffAdded = async (formData) => {
    try {
      setIsLoading(true)

      const response = await apiRequest('/tariffs', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.success) {
        toast.success("Tariff added successfully!")
        await fetchTariffs()
      } else {
        toast.error(response.message || "Failed to add tariff")
      }
    } catch (error) {
      console.error("Failed to create tariff:", error)
      toast.error(error.message || "Failed to add tariff. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (tariff) => {
    // Convert tariff data to form format
    // Use raw date values if available, otherwise use formatted dates
    const formData = {
      utilityType: tariff.utilityType,
      planName: tariff.planName,
      validFrom: tariff.validFromRaw ? tariff.validFromRaw : tariff.validFrom,
      validTo: tariff.validToRaw ? tariff.validToRaw : (tariff.validTo === 'Present' ? null : tariff.validTo),
      description: tariff.description || "",
      installationCharge: tariff.installationCharge || "",
      // Electricity fields
      slab1Max: tariff.slab1Max || "",
      slab1Rate: tariff.slab1Rate || "",
      slab2Max: tariff.slab2Max || "",
      slab2Rate: tariff.slab2Rate || "",
      slab3Rate: tariff.slab3Rate || "",
      // Water fields
      flatRate: tariff.flatRate || "",
      fixedCharge: tariff.fixedCharge || "",
      // Gas fields
      subsidyAmount: tariff.subsidyAmount || "",
    }

    setSelectedTariff({ ...tariff, ...formData })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (tariff) => {
    setSelectedTariff(tariff)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedTariff) return

    try {
      setIsLoading(true)
      const response = await apiRequest(`/tariffs/${selectedTariff.id}`, {
        method: 'DELETE'
      })

      if (response.success) {
        toast.success("Tariff deleted successfully!")
        await fetchTariffs()
        setIsDeleteDialogOpen(false)
        setSelectedTariff(null)
      } else {
        toast.error(response.message || "Failed to delete tariff")
      }
    } catch (error) {
      console.error("Failed to delete tariff:", error)
      toast.error(error.message || "Failed to delete tariff. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSuccess = async (formData) => {
    try {
      setIsLoading(true)

      const response = await apiRequest(`/tariffs/${selectedTariff.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      })

      if (response.success) {
        toast.success("Tariff updated successfully!")
        await fetchTariffs()
        setIsEditDialogOpen(false)
        setSelectedTariff(null)
      } else {
        toast.error(response.message || "Failed to update tariff")
      }
    } catch (error) {
      console.error("Failed to update tariff:", error)
      toast.error(error.message || "Failed to update tariff. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter tariffs by utility type
  const electricityTariffs = tariffs.filter(t => t.utilityType === "Electricity")
  const waterTariffs = tariffs.filter(t => t.utilityType === "Water")
  const gasTariffs = tariffs.filter(t => t.utilityType === "Gas")

  // Create columns with action handlers
  const electricityColumns = createElectricityTariffColumns(handleEdit, handleDelete)
  const waterColumns = createWaterTariffColumns(handleEdit, handleDelete)
  const gasColumns = createGasTariffColumns(handleEdit, handleDelete)

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
                  <h1 className="text-3xl font-bold">Tariffs</h1>
                  <p className="text-muted-foreground">
                    Configure tariffs for different utility types
                  </p>
                </div>
                <div className="flex pt-4 lg:pt-0 gap-2 w-full sm:w-auto">
                  <Button onClick={() => {
                    setSelectedTariff(null)
                    setIsAddDialogOpen(true)
                  }} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="electricity">Electricity</TabsTrigger>
                    <TabsTrigger value="water">Water</TabsTrigger>
                    <TabsTrigger value="gas">Gas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="electricity" className="space-y-4">
                    {electricityTariffs.length === 0 ? (
                      <div className="flex items-center justify-center py-8 border rounded-lg bg-card">
                        <p className="text-muted-foreground">No electricity tariffs found...</p>
                      </div>
                    ) : (
                      <div className="border rounded-lg bg-card">
                        <div className="p-6">
                          <p className="text-lg font-medium">Electricity Tariffs</p>
                          <p className="text-sm text-muted-foreground pb-3">
                            Manage electricity tariff plans
                          </p>
                          <DataTable
                            columns={electricityColumns}
                            data={electricityTariffs}
                            filterColumn="planName"
                            filterPlaceholder="Search plans..."
                            showColumnToggle={true}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="water" className="space-y-4">
                    {waterTariffs.length === 0 ? (
                      <div className="flex items-center justify-center py-8 border rounded-lg bg-card">
                        <p className="text-muted-foreground">No water tariffs found...</p>
                      </div>
                    ) : (
                      <div className="border rounded-lg bg-card">
                        <div className="p-6">
                          <p className="text-lg font-medium">Water Tariffs</p>
                          <p className="text-sm text-muted-foreground pb-3">
                            Manage water tariff plans
                          </p>
                          <DataTable
                            columns={waterColumns}
                            data={waterTariffs}
                            filterColumn="planName"
                            filterPlaceholder="Search plans..."
                            showColumnToggle={true}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="gas" className="space-y-4">
                    {gasTariffs.length === 0 ? (
                      <div className="flex items-center justify-center py-8 border rounded-lg bg-card">
                        <p className="text-muted-foreground">No gas tariffs found...</p>
                      </div>
                    ) : (
                      <div className="border rounded-lg bg-card">
                        <div className="p-6">
                          <p className="text-lg font-medium">Gas Tariffs</p>
                          <p className="text-sm text-muted-foreground pb-3">
                            Manage gas tariff plans
                          </p>
                          <DataTable
                            columns={gasColumns}
                            data={gasTariffs}
                            filterColumn="planName"
                            filterPlaceholder="Search plans..."
                            showColumnToggle={true}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Tariff Dialog */}
      <TariffForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleTariffAdded}
        utilityType={
          activeTab === "electricity" ? "Electricity" :
          activeTab === "water" ? "Water" : "Gas"
        }
      />

      {/* Edit Tariff Dialog */}
      {selectedTariff && (
        <TariffForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          initialData={selectedTariff}
          isEdit={true}
          utilityType={selectedTariff.utilityType}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Tariff"
        description="Are you sure you want to delete this tariff? This action cannot be undone."
        itemName={selectedTariff?.planName}
        itemId={selectedTariff?.id}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </SidebarProvider>
  )
}
