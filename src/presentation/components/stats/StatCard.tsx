import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  highlight = false,
  className,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground';

  return (
    <div
      className={cn(
        'bg-card border border-white/5 rounded-xl p-4 flex flex-col gap-2',
        highlight && 'border-mufc-red/30 bg-mufc-red/5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {title}
        </p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {trend && (
          <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
