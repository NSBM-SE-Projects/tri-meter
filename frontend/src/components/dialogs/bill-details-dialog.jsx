import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Separator } from "@/components"
import { Printer, Mail } from "lucide-react"

export function BillDetailsDialog({ open, onOpenChange, billData, onSendEmail }) {
  if (!billData) return null

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmailClick = () => {
    if (onSendEmail) {
      onSendEmail()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-y-auto md:max-w-2xl lg:max-w-2xl max-h-[90vh] print:max-w-full print:max-h-full print:overflow-visible print:shadow-none">
        <DialogHeader className="pb-4 border-b print:border-b-2">
          <DialogTitle className="print:text-center print:text-2xl">Bill Details - {billData.billId}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-6">
          {/* Bill Information */}
          <div>
            <p className="mb-3 text-lg font-medium">Bill Information</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Customer</p>
                <p className="text-base">{billData.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Utility</p>
                <p className="text-base">{billData.utility}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Meter</p>
                <p className="text-base">{billData.meter}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Billing Period</p>
                <p className="text-base">{billData.billingPeriod}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Consumption Details */}
          <div>
            <p className="mb-3 text-lg font-medium">Consumption Details</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Previous Reading</p>
                <p className="text-base">{billData.previousReading || 0} {billData.unit || ''}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Current Reading</p>
                <p className="text-base">{billData.currentReading || 0} {billData.unit || ''}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Consumption</p>
                <p className="text-base">{billData.consumption || 0} {billData.unit || ''}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Charges Breakdown */}
          <div>
            <p className="mb-4 text-lg font-medium">Charges Breakdown</p>
            <div className="space-y-2">
              {billData.charges && Array.isArray(billData.charges) && billData.charges.length > 0 ? (
                billData.charges.map((charge, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-base">{charge.description}</span>
                    <span className="text-base font-normal">${charge.amount.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-base text-muted-foreground">No charges found</p>
              )}
              <div className="pt-5 mt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total Amount Due</span>
                  <span className="text-base font-bold">${(billData.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Due Date and Status */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <p className="text-sm font-normal text-muted-foreground">Due Date</p>
              <p className="text-base">{billData.dueDate}</p>
            </div>
            <div>
              <p className="text-sm font-normal text-muted-foreground">Status</p>
              <p className="text-base">{billData.status}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-16 px-6 py-4 border-t pt-7 print:hidden">
          <Button onClick={handlePrint} className="flex-1" variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Bill
          </Button>
          <Button onClick={handleSendEmailClick} className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
