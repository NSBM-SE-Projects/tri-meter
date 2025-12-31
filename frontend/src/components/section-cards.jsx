import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const cards = [
  {
    id: 1,
    title: "Total Customers",
    value: "2756",
    description: "Customers in the system",
  },
  {
    id: 2,
    title: "Revenue",
    value: "$1,234.00",
    trend: { value: 20, direction: "down" },
    description: "Revenue this period",
  },
  {
    id: 3,
    title: "Meter Readings",
    value: "45,678",
    description: "Meter Readings this period",
  },
  {
    id: 4,
    title: "Meters",
    value: "4.5%",
    description: "Active Meters in the system",
  },
]

export function SectionCards() {
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
                    {card.trend.direction === "up" ? "+" : "-"}{card.trend.value}%
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
