import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatsCard({ title, value, unit, change, icon: Icon }) {
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            {isPositive && <ArrowUp className="w-3 h-3 text-red-500" />}
            {isNegative && <ArrowDown className="w-3 h-3 text-green-500" />}
            <span
              className={cn(
                isPositive && 'text-red-500',
                isNegative && 'text-green-500'
              )}
            >
              {Math.abs(change).toFixed(1)}%
            </span>
            <span>from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
