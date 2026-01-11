import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllPayments, getPaymentById } from "@/services/paymentService"
import {
  AppSidebar,
  SiteHeader,
  SidebarProvider,
  DataTable,
  Button,
  RecordPaymentForm,
  PaymentDetailsDialog,
  createPaymentColumns,
} from "@/components"
import { Plus, Loader2 } from "lucide-react"

export default function Payments() {
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false)
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false)
  const [selectedPaymentData, setSelectedPaymentData] = useState(null)
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch
  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      const data = await getAllPayments()
      setPayments(data)
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      toast.error("Failed to load payments. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPayment = async (payment) => {
    try {
      const data = await getPaymentById(payment.id)
      setSelectedPaymentData(data)
      setIsPaymentDetailsOpen(true)
    } catch (error) {
      console.error("Failed to fetch payment details:", error)
      toast.error("Failed to load payment details. Please try again.")
    }
  }

  const handlePrintPayment = async (payment) => {
    try {
      const data = await getPaymentById(payment.id)
      setSelectedPaymentData(data)
      setIsPaymentDetailsOpen(true)

      // Trigger print delay
      setTimeout(() => {
        window.print()
      }, 100)
    } catch (error) {
      console.error("Failed to fetch payment details:", error)
      toast.error("Failed to load payment details for printing. Please try again.")
    }
  }

  // Create columns with action handlers
  const paymentColumns = createPaymentColumns(
    handleViewPayment,
    handlePrintPayment
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
                  <h1 className="text-3xl font-bold">Payments</h1>
                  <p className="text-muted-foreground">
                    Record and view customer payments
                  </p>
                </div>
                <div className="flex w-full gap-2 pt-4 lg:pt-0 sm:w-auto">
                  <Button onClick={() => setIsRecordPaymentOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : payments.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No payments found...</p>
                </div>
              ) : (
                <div className="border rounded-lg bg-card">
                  <div className="p-6">
                    <p className="text-lg font-medium">Payment History</p>
                    <p className="pb-3 text-sm text-muted-foreground">
                      A list of all recorded payments
                    </p>
                    <DataTable
                      columns={paymentColumns}
                      data={payments}
                      filterColumn="customerName"
                      filterPlaceholder="Search payments..."
                      filterConfig={[
                        {
                          id: 'method',
                          label: 'Payment Method',
                          options: ['Cash', 'Card', 'Online', 'Cheque']
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

      {/* Record Payment Form Dialog */}
      <RecordPaymentForm
        open={isRecordPaymentOpen}
        onOpenChange={setIsRecordPaymentOpen}
        onSuccess={fetchPayments}
      />

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog
        open={isPaymentDetailsOpen}
        onOpenChange={setIsPaymentDetailsOpen}
        payment={selectedPaymentData}
      />
    </SidebarProvider>
  )
}
