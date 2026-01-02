import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"

export function BillDetailsDialog({ open, onOpenChange, billData }) {
  if (!billData) return null

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmail = () => {
    console.log("Send email:", billData)
    // Implement send email functionality
  }

  const handleRecordPayment = () => {
    console.log("Record payment:", billData)
    // Implement record payment functionality
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto gap-0 print:max-w-full print:max-h-full print:overflow-visible print:shadow-none">
        <DialogHeader className="border-b pb-4 print:border-b-2">
          <DialogTitle className="text-2xl print:text-3xl print:text-center">Bill Details - {billData.billId}</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Bill Information */}
          <div className="border-2 rounded-lg p-4 space-y-1 bg-background">
            <p className="text-base">
              <span className="font-medium">Customer:</span> {billData.customerName} ({billData.customerId})
            </p>
            <p className="text-base">
              <span className="font-medium">Utility:</span> {billData.utility}
            </p>
            <p className="text-base">
              <span className="font-medium">Meter:</span> {billData.meter}
            </p>
            <p className="text-base">
              <span className="font-medium">Billing Period:</span> {billData.billingPeriod}
            </p>
          </div>

          {/* Consumption Details */}
          <div className="border-2 rounded-lg p-4 bg-background">
            <h3 className="text-lg font-semibold mb-3">Consumption Details</h3>
            <div className="space-y-1">
              <p className="text-base">
                <span className="font-medium">Previous Reading:</span> {billData.previousReading} {billData.unit}
              </p>
              <p className="text-base">
                <span className="font-medium">Current Reading:</span> {billData.currentReading} {billData.unit}
              </p>
              <p className="text-base">
                <span className="font-medium">Consumption:</span> {billData.consumption} {billData.unit}
              </p>
            </div>
          </div>

          {/* Charges Breakdown */}
          <div className="border-2 rounded-lg p-4 bg-background">
            <h3 className="text-lg font-semibold mb-4">Charges Breakdown</h3>
            <div className="space-y-2">
              {billData.charges.map((charge, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-base">{charge.description}</span>
                  <span className="text-base font-medium">${charge.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount Due</span>
                  <span className="text-lg font-bold">${billData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Due Date and Status */}
          <div className="space-y-1">
            <p className="text-base">
              <span className="font-medium">Due Date:</span> {billData.dueDate}
            </p>
            <p className="text-base">
              <span className="font-medium">Status:</span> {billData.status}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t print:hidden">
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            Print Bill
          </Button>
          <Button variant="outline" onClick={handleSendEmail} className="flex-1">
            Send Email
          </Button>
          <Button onClick={handleRecordPayment} className="flex-1">
            Record Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
