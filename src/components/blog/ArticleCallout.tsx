import React from 'react';
import { AlertCircle, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArticleCalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'important';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ArticleCallout: React.FC<ArticleCalloutProps> = ({
  type = 'note',
  title,
  children,
  className,
}) => {
  const icons = {
    note: <Info className="w-5 h-5 text-sky-400" />,
    tip: <Lightbulb className="w-5 h-5 text-emerald-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    important: <AlertCircle className="w-5 h-5 text-primary" />,
  };

  const styles = {
    note: 'bg-sky-500/10 border-sky-500/30 text-sky-200',
    tip: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
    important: 'bg-primary/10 border-primary/30 text-primary-foreground',
  };

  return (
    <div className={cn('p-4 my-6 rounded-xl border flex items-start gap-3 text-sm', styles[type], className)}>
      <span className="shrink-0 mt-0.5">{icons[type]}</span>
      <div className="space-y-1">
        {title && <h5 className="font-bold text-foreground">{title}</h5>}
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
};
