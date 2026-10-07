import React from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  icon,
  trend = 'neutral',
  className,
}) => {
  return (
    <Card variant="glass" padding="md" className={cn('flex items-center justify-between', className)}>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold text-foreground font-mono">{value}</span>
          {change && (
            <span
              className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded',
                trend === 'up' && 'text-emerald-400 bg-emerald-500/10',
                trend === 'down' && 'text-rose-400 bg-rose-500/10',
                trend === 'neutral' && 'text-muted-foreground bg-surface'
              )}
            >
              {change}
            </span>
          )}
        </div>
      </div>
      {icon && <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">{icon}</div>}
    </Card>
  );
};

export const MetricCard = StatsCard;
