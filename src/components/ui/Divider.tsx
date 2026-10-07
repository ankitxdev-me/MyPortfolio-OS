import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
  ...props
}) => {
  if (orientation === 'vertical') {
    return <div className={cn('w-px bg-border self-stretch my-1', className)} {...props} />;
  }

  if (label) {
    return (
      <div className={cn('flex items-center w-full my-4', className)} {...props}>
        <div className="flex-1 h-px bg-border"></div>
        <span className="px-3 text-xs font-mono text-muted-foreground uppercase">{label}</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>
    );
  }

  return <div className={cn('w-full h-px bg-border my-4', className)} {...props} />;
};

export const Separator = Divider;
