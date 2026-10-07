import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  onClose,
  children,
  className,
  ...props
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-sky-400" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
  };

  const variants = {
    info: 'bg-sky-500/10 border-sky-500/20 text-sky-200',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-200',
  };

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border text-sm', variants[variant], className)} {...props}>
      <span className="shrink-0 mt-0.5">{icons[variant]}</span>
      <div className="flex-1">
        {title && <h4 className="font-semibold text-foreground mb-1">{title}</h4>}
        <div className="text-muted-foreground">{children}</div>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      )}
    </div>
  );
};
