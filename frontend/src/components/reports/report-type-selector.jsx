import { Button } from '@/components/ui/button'
import { FileText, TrendingUp, Users, Award } from 'lucide-react'

export default function ReportTypeSelector({ selectedReport, onSelectReport }) {
  const reportTypes = [
    {
      id: 'unpaid-bills',
      label: 'Unpaid Bills',
      description: 'View overdue bills summary',
      icon: FileText
    },
    {
      id: 'revenue',
      label: 'Revenue',
      description: 'Monthly revenue trends',
      icon: TrendingUp
    },
    {
      id: 'customer',
      label: 'Customer',
      description: 'Customer billing summary',
      icon: Users
    },
    {
      id: 'top-consumers',
      label: 'Top Consumers',
      description: 'Highest consumption customers',
      icon: Award
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {reportTypes.map((report) => {
        const Icon = report.icon
        const isSelected = selectedReport === report.id

        return (
          <Button
            key={report.id}
            variant={isSelected ? 'default' : 'outline'}
            className={`h-auto flex-col items-start p-4 ${
              isSelected ? '' : 'hover:bg-accent'
            }`}
            onClick={() => onSelectReport(report.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5" />
              <span className="font-semibold">{report.label}</span>
            </div>
            <p className="text-xs text-left text-muted-foreground">
              {report.description}
            </p>
          </Button>
        )
      })}
    </div>
  )
}
