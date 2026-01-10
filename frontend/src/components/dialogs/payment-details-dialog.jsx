import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Separator } from "@/components"
import { Printer } from "lucide-react"

export function PaymentDetailsDialog({ open, onOpenChange, payment }) {
  if (!payment) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-y-auto md:max-w-2xl lg:max-w-2xl max-h-[90vh] print:max-w-full print:max-h-full print:overflow-visible print:shadow-none">
        <DialogHeader className="pb-4 border-b print:border-b-2">
          <DialogTitle className="print:text-center print:text-2xl">Payment Details - {payment.paymentId}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-6">
          {/* Payment Information */}
          <div>
            <p className="mb-3 text-lg font-medium">Payment Information</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Amount</p>
                <p className="text-base font-semibold text-green-600">${payment.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Method</p>
                <p className="text-base">{payment.method}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Date</p>
                <p className="text-base">{payment.paymentDate}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Reference</p>
                <p className="text-base">{payment.referenceNo}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <p className="mb-3 text-lg font-medium">Customer Information</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Customer</p>
                <p className="text-base">{payment.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Email</p>
                <p className="text-base break-all">{payment.customerEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bill Information */}
          <div>
            <p className="mb-3 text-lg font-medium">Bill Information</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Bill ID</p>
                <p className="text-base">{payment.billId}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Bill Amount</p>
                <p className="text-base">${payment.billAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Billing Period</p>
                <p className="text-base">{payment.billingPeriod}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-muted-foreground">Bill Status</p>
                <p className="text-base">{payment.billStatus}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Recorded By */}
          <div>
            <p className="text-sm font-normal text-muted-foreground">Recorded By</p>
            <p className="text-base">{payment.cashierName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-6 py-4 border-t pt-7 print:hidden">
          <Button onClick={handlePrint} className="flex-1" variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
