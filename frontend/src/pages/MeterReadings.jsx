import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Plus, MoreHorizontal, Filter, Calendar as CalendarIcon } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

// Sample meter readings data
const meterReadingsData = [
  {
    id: "1",
    meter: "E-12345",
    date: "Dec 26",
    value: "1250",
    previousValue: "1150",
    consumption: "100kWh",
    tampered: false,
    fieldOfficer: "John Doe",
    utilityType: "Electricity",
    month: "December",
  },
  {
    id: "2",
    meter: "W-67890",
    date: "Dec 26",
    value: "850",
    previousValue: "800",
    consumption: "50m³",
    tampered: false,
    fieldOfficer: "Jane Smith",
    utilityType: "Water",
    month: "December",
  },
  {
    id: "3",
    meter: "G-34567",
    date: "Dec 29",
    value: "420",
    previousValue: "400",
    consumption: "20m³",
    tampered: false,
    fieldOfficer: "Mike Johnson",
    utilityType: "Gas",
    month: "December",
  },
  {
    id: "4",
    meter: "E-23456",
    date: "Dec 27",
    value: "2100",
    previousValue: "2000",
    consumption: "100kWh",
    tampered: true,
    fieldOfficer: "Sarah Lee",
    utilityType: "Electricity",
    month: "December",
  },
  {
    id: "5",
    meter: "W-78901",
    date: "Dec 28",
    value: "950",
    previousValue: "920",
    consumption: "30m³",
    tampered: false,
    fieldOfficer: "David Chen",
    utilityType: "Water",
    month: "December",
  },
  {
    id: "6",
    meter: "E-34567",
    date: "Nov 25",
    value: "1100",
    previousValue: "1000",
    consumption: "100kWh",
    tampered: false,
    fieldOfficer: "John Doe",
    utilityType: "Electricity",
    month: "November",
  },
  {
    id: "7",
    meter: "G-45678",
    date: "Nov 26",
    value: "380",
    previousValue: "360",
    consumption: "20m³",
    tampered: false,
    fieldOfficer: "Jane Smith",
    utilityType: "Gas",
    month: "November",
  },
  {
    id: "8",
    meter: "W-89012",
    date: "Dec 30",
    value: "720",
    previousValue: "680",
    consumption: "40m³",
    tampered: false,
    fieldOfficer: "Mike Johnson",
    utilityType: "Water",
    month: "December",
  },
  {
    id: "9",
    meter: "E-45678",
    date: "Dec 29",
    value: "1800",
    previousValue: "1700",
    consumption: "100kWh",
    tampered: true,
    fieldOfficer: "Sarah Lee",
    utilityType: "Electricity",
    month: "December",
  },
  {
    id: "10",
    meter: "G-56789",
    date: "Dec 27",
    value: "500",
    previousValue: "480",
    consumption: "20m³",
    tampered: false,
    fieldOfficer: "David Chen",
    utilityType: "Gas",
    month: "December",
  },
]

// Sample meter data for the form
const metersList = [
  {
    id: "E-12345",
    customer: "John Smith",
    utility: "Electricity",
    lastReading: "1150",
    lastReadingDate: "Nov 26, 2024",
  },
  {
    id: "W-67890",
    customer: "Jane Doe",
    utility: "Water",
    lastReading: "800",
    lastReadingDate: "Nov 25, 2024",
  },
  {
    id: "G-34567",
    customer: "ABC Corp",
    utility: "Gas",
    lastReading: "400",
    lastReadingDate: "Nov 27, 2024",
  },
]

export default function MeterReadings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [utilityFilter, setUtilityFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    meter: "",
    currentReading: "",
    readingDate: null,
    authorizedReset: false,
    notes: ""
  })

  const [formErrors, setFormErrors] = useState({})

  const selectedMeter = metersList.find(m => m.id === formData.meter)

  const calculatedConsumption = () => {
    if (!selectedMeter || !formData.currentReading) return "0"
    const consumption = parseInt(formData.currentReading) - parseInt(selectedMeter.lastReading)
    if (consumption < 0 && !formData.authorizedReset) return "Invalid"
    return consumption
  }

  const handleNumberPadClick = (num) => {
    setFormData(prev => ({
      ...prev,
      currentReading: prev.currentReading + num.toString()
    }))
  }

  const handleClear = () => {
    setFormData(prev => ({ ...prev, currentReading: "" }))
  }

  const handleEnter = () => {
    // You can add any enter logic here if needed
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.meter) {
      errors.meter = "Meter is required"
    }

    if (!formData.currentReading) {
      errors.currentReading = "Current reading is required"
    } else if (selectedMeter && parseInt(formData.currentReading) < parseInt(selectedMeter.lastReading) && !formData.authorizedReset) {
      errors.currentReading = "Must be greater than previous reading unless reset"
    }

    if (!formData.readingDate) {
      errors.readingDate = "Reading date is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData)
      // Reset form
      setFormData({
        meter: "",
        currentReading: "",
        readingDate: null,
        authorizedReset: false,
        notes: ""
      })
      setFormErrors({})
      setIsAddDialogOpen(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      meter: "",
      currentReading: "",
      readingDate: null,
      authorizedReset: false,
      notes: ""
    })
    setFormErrors({})
    setIsAddDialogOpen(false)
  }

  const filteredReadings = meterReadingsData.filter(reading => {
    const matchesSearch = reading.meter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reading.fieldOfficer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesUtility = utilityFilter === "all" || reading.utilityType === utilityFilter
    const matchesMonth = monthFilter === "all" || reading.month === monthFilter

    return matchesSearch && matchesUtility && matchesMonth
  })

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SiteHeader />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Meter Readings</h1>
                  <p className="text-muted-foreground">
                    Record and view meter consumption data
                  </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reading
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search:"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filters:
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="p-2 space-y-2">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Utility</label>
                        <Select value={utilityFilter} onValueChange={setUtilityFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Electricity">Electricity</SelectItem>
                            <SelectItem value="Water">Water</SelectItem>
                            <SelectItem value="Gas">Gas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Month</label>
                        <Select value={monthFilter} onValueChange={setMonthFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="December">December</SelectItem>
                            <SelectItem value="November">November</SelectItem>
                            <SelectItem value="October">October</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Meter Readings List</CardTitle>
                  <CardDescription>
                    A list of all meter readings in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Meter</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Previous Value</TableHead>
                          <TableHead>Consumption</TableHead>
                          <TableHead>Tampered</TableHead>
                          <TableHead>Field Officer</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReadings.length > 0 ? (
                          filteredReadings.map((reading) => (
                            <TableRow key={reading.id}>
                              <TableCell className="font-medium">
                                {reading.meter}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {reading.date}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {reading.value}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {reading.previousValue}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {reading.consumption}
                              </TableCell>
                              <TableCell>
                                {reading.tampered ? (
                                  <Badge variant="destructive">Yes</Badge>
                                ) : (
                                  <span className="text-muted-foreground">No</span>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {reading.fieldOfficer}
                              </TableCell>
                              <TableCell className="text-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View</DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                              No meter readings found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="flex justify-end">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    &lt;
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span className="px-2">...</span>
                  <Button variant="outline" size="sm">
                    123
                  </Button>
                  <Button variant="outline" size="sm">
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Record Meter Reading Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto gap-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl">Record Meter Reading</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-8 p-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Meter Selection */}
              <div className="space-y-2">
                <Label htmlFor="meter">
                  Meter<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.meter}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, meter: value }))}
                >
                  <SelectTrigger className={formErrors.meter ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select meter" />
                  </SelectTrigger>
                  <SelectContent>
                    {metersList.map(meter => (
                      <SelectItem key={meter.id} value={meter.id}>
                        {meter.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.meter && (
                  <p className="text-sm text-red-500">{formErrors.meter}</p>
                )}
              </div>

              {/* Meter Details */}
              <div>
                <Label className="mb-2 block">Meter Details</Label>
                {selectedMeter ? (
                  <div className="border-2 border-gray-300 rounded-md p-4 space-y-1 bg-background">
                    <p className="text-sm"><span className="font-medium">Customer:</span> {selectedMeter.customer}</p>
                    <p className="text-sm"><span className="font-medium">Utility:</span> {selectedMeter.utility}</p>
                    <p className="text-sm"><span className="font-medium">Last Reading:</span> {selectedMeter.lastReading} {selectedMeter.utility === "Electricity" ? "kWh" : "m³"}</p>
                    <p className="text-sm"><span className="font-medium">Date:</span> {selectedMeter.lastReadingDate}</p>
                    <p className="text-sm"><span className="font-medium">Meter:</span></p>
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 rounded-md p-4 bg-background h-32 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Select a meter to view details</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes here..."
                  rows={5}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Current Reading */}
              <div className="space-y-2">
                <Label htmlFor="currentReading">
                  Current Reading<span className="text-red-500">*</span>
                </Label>
                <div className="text-6xl font-bold text-center py-8 border rounded-lg bg-background">
                  {formData.currentReading || "0"}
                </div>
                {formErrors.currentReading && (
                  <p className="text-sm text-red-500">{formErrors.currentReading}</p>
                )}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3].map(num => (
                  <Button
                    key={num}
                    variant="outline"
                    size="lg"
                    className="h-16 text-2xl"
                    onClick={() => handleNumberPadClick(num)}
                    type="button"
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="default"
                  size="lg"
                  className="h-16 bg-green-600 hover:bg-green-700"
                  onClick={handleEnter}
                  type="button"
                >
                  Enter
                </Button>

                {[4, 5, 6].map(num => (
                  <Button
                    key={num}
                    variant="outline"
                    size="lg"
                    className="h-16 text-2xl"
                    onClick={() => handleNumberPadClick(num)}
                    type="button"
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="destructive"
                  size="lg"
                  className="h-16"
                  onClick={handleClear}
                  type="button"
                >
                  Clear
                </Button>

                {[7, 8, 9, 0].map(num => (
                  <Button
                    key={num}
                    variant="outline"
                    size="lg"
                    className="h-16 text-2xl"
                    onClick={() => handleNumberPadClick(num)}
                    type="button"
                  >
                    {num}
                  </Button>
                ))}
              </div>

              {/* Authorized Reset Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="authorizedReset"
                  checked={formData.authorizedReset}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, authorizedReset: checked }))}
                />
                <label htmlFor="authorizedReset" className="text-sm font-medium cursor-pointer">
                  Authorized Meter Reset
                </label>
              </div>

              {/* Reading Date */}
              <div className="space-y-2">
                <Label htmlFor="readingDate">
                  Reading Date<span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${formErrors.readingDate ? "border-red-500" : ""} ${!formData.readingDate ? "text-muted-foreground" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.readingDate ? format(formData.readingDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.readingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, readingDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.readingDate && (
                  <p className="text-sm text-red-500">{formErrors.readingDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Calculated Consumption */}
          <div className="mx-6 mb-6">
            <div className="border rounded-lg p-6 text-center bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Calculated Consumption</h3>
              <p className="text-4xl font-bold">
                {calculatedConsumption()} {selectedMeter ? (selectedMeter.utility === "Electricity" ? "kWh" : "m³") : ""}
              </p>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Reading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
