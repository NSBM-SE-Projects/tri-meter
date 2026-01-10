import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllBills, getBillById, generateBill, sendBillEmail } from "@/services/billService"
import {
  AppSidebar,
  SiteHeader,
  SidebarProvider,
  DataTable,
  Button,
  GenerateBillForm,
  BillDetailsDialog,
  createBillColumns,
} from "@/components"
import { Plus, Loader2 } from "lucide-react"

export default function Bills() {
  const [isGenerateBillOpen, setIsGenerateBillOpen] = useState(false)
  const [isBillDetailsOpen, setIsBillDetailsOpen] = useState(false)
  const [selectedBillData, setSelectedBillData] = useState(null)
  const [bills, setBills] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch
  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      setIsLoading(true)
      const data = await getAllBills()
      setBills(data)
    } catch (error) {
      console.error("Failed to fetch bills:", error)
      toast.error("Failed to load bills. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewBill = async (bill) => {
    try {
      const data = await getBillById(bill.id)
      setSelectedBillData(data)
      setIsBillDetailsOpen(true)
    } catch (error) {
      console.error("Failed to fetch bill details:", error)
      toast.error("Failed to load bill details. Please try again.")
    }
  }

  const handlePrintBill = async (bill) => {
    try {
      const data = await getBillById(bill.id)
      setSelectedBillData(data)
      setIsBillDetailsOpen(true)

      // Trigger print delay
      setTimeout(() => {
        window.print()
      }, 100)
    } catch (error) {
      console.error("Failed to fetch bill details:", error)
      toast.error("Failed to load bill details for printing. Please try again.")
    }
  }

  const handleSendEmail = async (bill) => {
    try {
      await sendBillEmail(bill.id)
      toast.success("Bill sent successfully!")
    } catch (error) {
      console.error("Failed to send bill email:", error)
      toast.error("Failed to send bill email. Please try again.")
    }
  }

  // Create columns with action handlers
  const billColumns = createBillColumns(
    handleViewBill,
    handlePrintBill,
    handleSendEmail
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
                  <h1 className="text-3xl font-bold">Bills</h1>
                  <p className="text-muted-foreground">
                    Manage customer billing
                  </p>
                </div>
                <div className="flex w-full gap-2 pt-4 lg:pt-0 sm:w-auto">
                  <Button onClick={() => setIsGenerateBillOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Bill
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : bills.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No bills found...</p>
                </div>
              ) : (
                <div className="border rounded-lg bg-card">
                  <div className="p-6">
                    <p className="text-lg font-medium">Bills List</p>
                    <p className="pb-3 text-sm text-muted-foreground">
                      A list of all bills in the system
                    </p>
                    <DataTable
                      columns={billColumns}
                      data={bills}
                      filterColumn="name"
                      filterPlaceholder="Search bills..."
                      filterConfig={[
                        {
                          id: 'status',
                          label: 'Status',
                          options: ['Paid', 'Unpaid', 'Partially Paid']
                        },
                        {
                          id: 'period',
                          label: 'Period',
                          options: ['Jan 2026', 'Dec 2025', 'Nov 2025', 'Oct 2025', 'Sep 2025', 'Aug 2025']
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

      {/* Generate Bill Form Dialog */}
      <GenerateBillForm
        open={isGenerateBillOpen}
        onOpenChange={setIsGenerateBillOpen}
        onSuccess={async (formData) => {
          try {
            const billData = await generateBill({
              customerId: parseInt(formData.customer),
              serviceConnectionId: parseInt(formData.meterServiceConnection),
              periodFrom: formData.periodFrom.toISOString().split('T')[0],
              periodTo: formData.periodTo.toISOString().split('T')[0]
            })

            setSelectedBillData(billData)
            setIsBillDetailsOpen(true)
            setIsGenerateBillOpen(false)

            // Refresh bills list
            fetchBills()

            toast.success("Bill generated successfully!")
          } catch (err) {
            console.error('Failed to generate bill:', err)
            toast.error(err.message || 'Failed to generate bill')
          }
        }}
      />

      {/* Bill Details Dialog */}
      <BillDetailsDialog
        open={isBillDetailsOpen}
        onOpenChange={setIsBillDetailsOpen}
        billData={selectedBillData}
        onSendEmail={async () => {
          if (selectedBillData) {
            try {
              await sendBillEmail(selectedBillData.billId)
              toast.success("Bill sent successfully!")
            } catch (err) {
              console.error('Failed to send bill email:', err)
              toast.error(err.message || 'Failed to send bill email')
            }
          }
        }}
      />
    </SidebarProvider>
  )
}
