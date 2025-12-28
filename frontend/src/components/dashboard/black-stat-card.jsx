import { Card, CardContent } from '@/components/ui/card'

export function BlackStatCard({ title, value, change }) {
  const isPositive = change > 0
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'

  return (
    <Card className="gap-24 text-white transition-all duration-300 bg-gray-800 border-0 cursor-pointer dark:bg-slate-900 dark:border dark:border-slate-700 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
      <CardContent className="p-8">
        <p className="mb-4 text-sm text-gray-400 dark:text-gray-300">{title}</p>
        <div className="mb-2 text-4xl font-bold">{value}</div>
        <p className={`text-sm ${changeColor}`}>
          {isPositive ? '+' : ''}{change}%
        </p>
      </CardContent>
    </Card>
  )
}
