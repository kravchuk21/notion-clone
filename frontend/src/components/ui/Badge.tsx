import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority-high' | 'priority-medium' | 'priority-low';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-bg-tertiary text-text-secondary',
    'priority-high': 'bg-priority-high/10 text-priority-high',
    'priority-medium': 'bg-priority-medium/10 text-priority-medium',
    'priority-low': 'bg-priority-low/10 text-priority-low',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

