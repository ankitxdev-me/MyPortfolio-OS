import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, disabled, id, ...props }, ref) => {
    const generatedId = id || React.useId();

    return (
      <label htmlFor={generatedId} className={cn('inline-flex items-center gap-2 cursor-pointer select-none', disabled && 'cursor-not-allowed opacity-50')}>
        <input
          type="checkbox"
          id={generatedId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'h-4 w-4 rounded border border-border bg-surface text-primary accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            className
          )}
          {...props}
        />
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
