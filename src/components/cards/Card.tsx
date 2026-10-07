import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-card border border-border text-card-foreground rounded-xl shadow-subtle',
    glass: 'glass-card rounded-xl text-foreground',
    outlined: 'bg-transparent border border-border text-foreground rounded-xl',
    interactive: 'bg-card border border-border text-card-foreground rounded-xl glass-card-hover cursor-pointer',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-5 sm:p-8',
  };

  return (
    <div className={cn(variants[variant], paddings[padding], className)} {...props}>
      {children}
    </div>
  );
};

export const GlassCard: React.FC<CardProps> = (props) => <Card variant="glass" {...props} />;
