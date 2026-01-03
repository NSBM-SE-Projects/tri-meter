import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function MonthYearPicker({
  className,
  classNames,
  selected,
  onSelect,
  fromYear = 2020,
  toYear = new Date().getFullYear() + 5,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  )

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(currentMonth.getFullYear(), parseInt(monthIndex), 1)
    setCurrentMonth(newDate)
    if (onSelect) {
      onSelect(newDate)
    }
  }

  const handleYearChange = (year) => {
    const newDate = new Date(parseInt(year), currentMonth.getMonth(), 1)
    setCurrentMonth(newDate)
    if (onSelect) {
      onSelect(newDate)
    }
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-center gap-2 mb-4">
        <Select
          value={currentMonth.getMonth().toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentMonth.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

MonthYearPicker.displayName = "MonthYearPicker"

export { MonthYearPicker }
