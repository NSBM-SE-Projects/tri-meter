import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format } from 'date-fns'

export function UsageAreaChart({ data, dataKeys, colors }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          {dataKeys.map((key, index) => (
            <linearGradient key={key.dataKey} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[index]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors[index]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tickFormatter={(value) => format(new Date(value), 'MMM dd')}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Area
            key={key.dataKey}
            type="monotone"
            dataKey={key.dataKey}
            name={key.name}
            stroke={colors[index]}
            fillOpacity={1}
            fill={`url(#color${index})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
