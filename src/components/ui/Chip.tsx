import React from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onRemove,
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer select-none',
        active
          ? 'bg-primary/15 text-primary border-primary/30 shadow-glow'
          : 'bg-surface text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-muted-foreground hover:text-foreground rounded-full p-0.5"
          aria-label="Remove chip"
        >
          ✕
        </button>
      )}
    </div>
  );
};
