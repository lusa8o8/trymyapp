import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-card border border-surface-border shadow-card',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'
export { Card }