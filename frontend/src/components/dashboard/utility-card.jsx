import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function UtilityCard({ title, icon: Icon, usage, unit, cost, link, iconColor }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {usage} {unit}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Cost: ${cost.toFixed(2)}
        </p>
        <Link to={link} className="mt-4 block">
          <Button variant="outline" size="sm" className="w-full">
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
