import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Button,
  Label,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  RadioGroup,
  RadioGroupItem,
  Card,
  Badge,
  Separator,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { recordPayment, getBillsForPayment, getCustomersWithUnpaidBills } from "@/services/paymentService"

export function RecordPaymentForm({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    customer: "",
    billId: "",
    amount: "",
    method: "Cash",
    referenceNo: "",
    paymentDate: new Date(),
  })

  const [formErrors, setFormErrors] = useState({})
  const [customers, setCustomers] = useState([])
  const [bills, setBills] = useState([])
  const [selectedBill, setSelectedBill] = useState(null)
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingBills, setLoadingBills] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch customers on mount
  useEffect(() => {
    if (open) {
      fetchCustomers()
    }
  }, [open])

  // Fetch bills when customer changes
  useEffect(() => {
    if (formData.customer) {
      fetchBills(formData.customer)
      setFormData(prev => ({ ...prev, billId: "" }))
      setSelectedBill(null)
    } else {
      setBills([])
    }
  }, [formData.customer])

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const data = await getCustomersWithUnpaidBills()
      setCustomers(data)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
      toast.error('Failed to load customers')
    } finally {
      setLoadingCustomers(false)
    }
  }

  const fetchBills = async (customerId) => {
    try {
      setLoadingBills(true)
      const data = await getBillsForPayment(customerId)
      setBills(data)
    } catch (err) {
      console.error('Failed to fetch bills:', err)
      toast.error('Failed to load bills')
    } finally {
      setLoadingBills(false)
    }
  }

  // Load bill details when bill is selected
  const handleBillChange = (billId) => {
    setFormData(prev => ({ ...prev, billId }))
    const bill = bills.find(b => b.id.toString() === billId)
    setSelectedBill(bill)
    setFormData(prev => ({ ...prev, amount: "" }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.customer) {
      errors.customer = "Customer is required"
    }

    if (!formData.billId) {
      errors.billId = "Bill is required"
    }

    if (!formData.amount) {
      errors.amount = "Payment amount is required"
    } else if (isNaN(parseFloat(formData.amount))) {
      errors.amount = "Payment amount must be a valid number"
    } else if (parseFloat(formData.amount) <= 0) {
      errors.amount = "Payment amount must be greater than 0"
    } else if (selectedBill && parseFloat(formData.amount) > selectedBill.outstandingAmount) {
      errors.amount = `Amount cannot exceed outstanding balance of $${selectedBill.outstandingAmount.toFixed(2)}`
    }

    if (!formData.method) {
      errors.method = "Payment method is required"
    }

    // Reference required for non-cash payments
    if (formData.method !== 'Cash' && !formData.referenceNo) {
      errors.referenceNo = "Reference number is required for this payment method"
    }

    if (!formData.paymentDate) {
      errors.paymentDate = "Payment date is required"
    } else if (formData.paymentDate > new Date()) {
      errors.paymentDate = "Payment date cannot be in the future"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      await recordPayment({
        billId: parseInt(formData.billId),
        amount: parseFloat(formData.amount),
        method: formData.method,
        referenceNo: formData.referenceNo || null,
        paymentDate: format(formData.paymentDate, 'yyyy-MM-dd')
      })

      toast.success('Payment recorded successfully!')
      onOpenChange(false)
      setFormData({
        customer: "",
        billId: "",
        amount: "",
        method: "Cash",
        referenceNo: "",
        paymentDate: new Date(),
      })
      setFormErrors({})
      onSuccess?.()
    } catch (error) {
      console.error('Failed to record payment:', error)
      toast.error(error.message || 'Failed to record payment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">Customer<span className="text-red-500">*</span></Label>
            <Select
              value={formData.customer}
              onValueChange={(value) => setFormData(prev => ({ ...prev, customer: value }))}
              disabled={loadingCustomers}
            >
              <SelectTrigger id="customer" className={formErrors.customer ? 'border-red-500' : ''}>
                <SelectValue placeholder={loadingCustomers ? "Loading customers..." : "Select a customer"} />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.customer && <p className="text-xs text-red-500">{formErrors.customer}</p>}
          </div>

          {/* Bill Selection */}
          <div className="space-y-2">
            <Label htmlFor="bill">Bill<span className="text-red-500">*</span></Label>
            <Select
              value={formData.billId}
              onValueChange={handleBillChange}
              disabled={!formData.customer || loadingBills}
            >
              <SelectTrigger id="bill" className={formErrors.billId ? 'border-red-500' : ''}>
                <SelectValue placeholder={loadingBills ? "Loading bills..." : !formData.customer ? "Select a customer first" : "Select a bill"} />
              </SelectTrigger>
              <SelectContent>
                {bills.map(bill => (
                  <SelectItem key={bill.id} value={bill.id.toString()}>
                    {bill.billId} - ${bill.totalAmount.toFixed(2)} (Outstanding: ${bill.outstandingAmount.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.billId && <p className="text-xs text-red-500">{formErrors.billId}</p>}
          </div>

          {/* Bill Details */}
          {selectedBill && (
            <Card className="p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Bill Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Bill ID</span>
                  <p className="font-medium">{selectedBill.billId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Period</span>
                  <p className="font-medium text-xs">{selectedBill.billingPeriod}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Amount</span>
                  <p className="font-medium">${selectedBill.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Paid</span>
                  <p className="font-medium">${selectedBill.paidAmount.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Outstanding Balance</span>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-semibold text-lg text-red-600">${selectedBill.outstandingAmount.toFixed(2)}</p>
                    <Badge variant="destructive" className="text-xs">
                      Max: ${selectedBill.outstandingAmount.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Separator />

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount<span className="text-red-500">*</span></Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={selectedBill?.outstandingAmount}
              placeholder="Enter payment amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={formErrors.amount ? 'border-red-500' : ''}
            />
            {selectedBill && (
              <p className="text-xs text-muted-foreground">
                Max payment: ${selectedBill.outstandingAmount.toFixed(2)}
              </p>
            )}
            {formErrors.amount && <p className="text-xs text-red-500">{formErrors.amount}</p>}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method<span className="text-red-500">*</span></Label>
            <RadioGroup value={formData.method} onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}>
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="Cash" id="method-cash" />
                <Label htmlFor="method-cash" className="flex-1 cursor-pointer mb-0">Cash</Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="Card" id="method-card" />
                <Label htmlFor="method-card" className="flex-1 cursor-pointer mb-0">Card</Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="Online" id="method-online" />
                <Label htmlFor="method-online" className="flex-1 cursor-pointer mb-0">Online Transfer</Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="Cheque" id="method-cheque" />
                <Label htmlFor="method-cheque" className="flex-1 cursor-pointer mb-0">Cheque</Label>
              </div>
            </RadioGroup>
            {formErrors.method && <p className="text-xs text-red-500">{formErrors.method}</p>}
          </div>

          {/* Reference Number */}
          {formData.method !== 'Cash' && (
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number<span className="text-red-500">*</span></Label>
              <Input
                id="reference"
                placeholder={`${formData.method} reference number`}
                value={formData.referenceNo}
                onChange={(e) => setFormData(prev => ({ ...prev, referenceNo: e.target.value }))}
                className={formErrors.referenceNo ? 'border-red-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Required for {formData.method} payments
              </p>
              {formErrors.referenceNo && <p className="text-xs text-red-500">{formErrors.referenceNo}</p>}
            </div>
          )}

          {/* Payment Date */}
          <div className="space-y-2">
            <Label>Payment Date<span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.paymentDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1 mt-1" align="start">
                <Calendar
                  mode="single"
                  selected={formData.paymentDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, paymentDate: date }))}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formErrors.paymentDate && <p className="text-xs text-red-500">{formErrors.paymentDate}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
