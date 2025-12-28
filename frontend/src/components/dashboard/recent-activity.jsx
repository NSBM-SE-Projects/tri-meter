import { mockRecentActivity } from '@/lib/mock-data'

export function RecentActivity() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-2">
        {mockRecentActivity.map((activity) => (
          <div key={activity.id} className="flex items-start gap-6">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
