"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components"
import { getRevenueTrends } from "@/services/dashboardService"

const chartConfig = {
  electricity: {
    label: "Electricity",
    color: "hsl(43, 96%, 56%)", // Yellow/Amber
  },
  water: {
    label: "Water",
    color: "hsl(217, 91%, 60%)", // Blue
  },
  gas: {
    label: "Gas",
    color: "hsl(0, 84%, 60%)", // Red
  },
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true)
        const data = await getRevenueTrends(timeRange)
        setChartData(data)
      } catch (error) {
        console.error('Revenue trends error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [timeRange])

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>
          Performance data
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden lg:flex">
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex lg:hidden w-40" aria-label="Select a value">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[275px]">
            <Loader2 className="h-8 w-8 mb-10 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ChartContainer
            key={`${timeRange}-${chartData.length}`}
            config={chartConfig}
            className="aspect-auto h-[275px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillElectricity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-electricity)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-electricity)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-water)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-water)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-gas)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-gas)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={15}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }} />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const date = new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div className="rounded-lg border bg-background p-4 shadow-sm">
                      <div className="mb-2 font-medium text-sm">{date}</div>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.electricity.color }} />
                          <span className="text-xs text-muted-foreground">Electricity:</span>
                          <span className="text-xs font-medium">${payload[0].payload.electricity || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.water.color }} />
                          <span className="text-xs text-muted-foreground">Water:</span>
                          <span className="text-xs font-medium">${payload[0].payload.water || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.gas.color }} />
                          <span className="text-xs text-muted-foreground">Gas:</span>
                          <span className="text-xs font-medium">${payload[0].payload.gas || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                dataKey="gas"
                type="natural"
                fill="url(#fillGas)"
                stroke="var(--color-gas)"
                strokeWidth={2} />
              <Area
                dataKey="water"
                type="natural"
                fill="url(#fillWater)"
                stroke="var(--color-water)"
                strokeWidth={2} />
              <Area
                dataKey="electricity"
                type="natural"
                fill="url(#fillElectricity)"
                stroke="var(--color-electricity)"
                strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
