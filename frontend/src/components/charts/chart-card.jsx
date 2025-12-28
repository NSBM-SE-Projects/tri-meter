import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ChartCard({ title, description, children, className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px]">{children}</CardContent>
    </Card>
  )
}
