import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: string
  trendPositive?: boolean
  icon?: React.ReactNode
  iconBg?: string
}

export function MetricCard({ label, value, trend, trendPositive, icon, iconBg }: MetricCardProps) {
  return (
    <Card className="p-6">
      {icon && (
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', iconBg)}>
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      <div className="text-sm text-text-faint">{label}</div>
      {trend && (
        <div className={cn('text-xs mt-2', trendPositive ? 'text-success' : 'text-text-faint')}>
          {trend}
        </div>
      )}
    </Card>
  )
}