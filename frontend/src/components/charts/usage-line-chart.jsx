import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format } from 'date-fns'

export function UsageLineChart({ data, dataKeys, colors }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
          <Line
            key={key.dataKey}
            type="monotone"
            dataKey={key.dataKey}
            name={key.name}
            stroke={colors[index] || 'hsl(var(--primary))'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
