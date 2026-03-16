import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-brand-black text-white hover:bg-brand-dark': variant === 'primary',
            'bg-surface-muted text-text-primary hover:bg-surface-border': variant === 'secondary',
            'border border-surface-border text-text-primary hover:bg-surface-muted': variant === 'outline',
            'text-text-secondary hover:text-text-primary hover:bg-surface-muted': variant === 'ghost',
            'bg-danger text-white hover:bg-red-700': variant === 'danger',
          },
          {
            'text-xs px-3 py-1.5': size === 'sm',
            'text-sm px-4 py-2.5': size === 'md',
            'text-base px-6 py-3': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
export { Button }