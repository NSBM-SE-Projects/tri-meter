import { TrendingDownIcon, TrendingUpIcon, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-background dark:bg-neutral-900 shadow-base">
            <CardHeader className="relative pb-6 flex items-center justify-center h-36">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const cards = [
    {
      id: 1,
      title: "Total Customers",
      value: formatNumber(stats.totalCustomers),
      description: "Customers in the system",
    },
    {
      id: 2,
      title: "Revenue",
      value: formatCurrency(stats.currentRevenue),
      trend: stats.revenueChange !== 0 ? {
        value: Math.abs(stats.revenueChange),
        direction: stats.revenueChange > 0 ? "up" : "down"
      } : null,
      description: "Revenue this period",
    },
    {
      id: 3,
      title: "Meter Readings",
      value: formatNumber(stats.meterReadings),
      description: "Meter Readings this period",
    },
    {
      id: 4,
      title: "Active Meters",
      value: formatNumber(stats.activeMeters),
      description: "Active Meters in the system",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const TrendIcon = card.trend?.direction === "up" ? TrendingUpIcon : TrendingDownIcon
        const trendColor = card.trend?.direction === "up"
          ? "text-green-600 dark:text-green-500"
          : "text-red-600 dark:text-red-500"

        return (
          <Card
            key={card.id}
            className="bg-background dark:bg-neutral-900 shadow-base"
          >
            <CardHeader className="relative pb-2">
              <CardDescription className="text-sm">{card.title}</CardDescription>
              <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
                {card.value}
              </CardTitle>
              {card.trend && (
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className={`flex gap-1 text-xs rounded-lg ${trendColor}`}>
                    <TrendIcon className="size-3" />
                    {card.trend.direction === "up" ? "+" : ""}{card.trend.value}%
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
              <div className="text-muted-foreground line-clamp-1">
                {card.description}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
