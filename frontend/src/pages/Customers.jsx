import { useState } from "react"
import {
  AppSidebar,
  SiteHeader,
  DataTable,
  customerColumns,
  SidebarProvider,
  Button,
} from "@/components"
import { CustomerForm } from "@/components"
import { UserPlus } from "lucide-react"

// Sample customer data
const customersData = [
  {
    id: "001",
    name: "John Smith",
    type: "Household",
    phone: "2321-232323",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: "002",
    name: "Jane Doe",
    type: "Business",
    phone: "2321-232324",
    email: "jane@example.com",
    status: "Active",
  },
  {
    id: "003",
    name: "ABC Corp",
    type: "Business",
    phone: "2321-232325",
    email: "abc@example.com",
    status: "Active",
  },
  {
    id: "004",
    name: "Sarah Wilson",
    type: "Household",
    phone: "2321-232326",
    email: "sarah@example.com",
    status: "Inactive",
  },
  {
    id: "005",
    name: "Michael Brown",
    type: "Household",
    phone: "2321-232327",
    email: "michael@example.com",
    status: "Pending",
  },
  {
    id: "006",
    name: "XYZ Ltd",
    type: "Business",
    phone: "2321-232328",
    email: "xyz@example.com",
    status: "Active",
  },
]

export default function Customers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleCustomerAdded = (formData, uploadedFile) => {
    // Handle the customer data here (e.g., add to table, send to backend)
    console.log("Customer added:", formData, uploadedFile)
    // TODO: Add customer to customersData state when backend is integrated
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-7">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Customers</h1>
                  <p className="text-muted-foreground">
                    Manage all customer accounts
                  </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>

              <div className="border rounded-lg bg-card">
                <div className="p-6">
                  <p className="text-lg font-medium">Customer List</p>
                  <p className="text-sm text-muted-foreground pb-3">
                    A list of all registered customers in the system
                  </p>
                  <div className="overflow-x-auto px-6">
                    <DataTable
                      columns={customerColumns}
                      data={customersData}
                      filterColumn="name"
                      filterPlaceholder="Search customers..."
                      filterConfig={[
                        {
                          id: 'type',
                          label: 'Type',
                          options: ['Household', 'Business', 'Government']
                        },
                        {
                          id: 'status',
                          label: 'Status',
                          options: ['Active', 'Pending', 'Inactive']
                        }
                      ]}
                      showColumnToggle={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Customer Dialog */}
      <CustomerForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleCustomerAdded}
      />
    </SidebarProvider>
  )
}
