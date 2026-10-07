import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ className, required, children, ...props }) => {
  return (
    <label className={cn('block text-sm font-medium text-foreground select-none', className)} {...props}>
      {children}
      {required && <span className="ml-1 text-primary">*</span>}
    </label>
  );
};

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

export const FieldGroup: React.FC<FieldGroupProps> = ({
  label,
  required,
  error,
  hint,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-1.5 w-full', className)} {...props}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
};
