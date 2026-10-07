import React from 'react';
import { FolderOpen, AlertOctagon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface StateDisplayProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<StateDisplayProps> = ({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl bg-surface/50 border border-border border-dashed space-y-4', className)}>
      <div className="p-4 rounded-full bg-surface border border-border text-muted-foreground">
        {icon || <FolderOpen className="w-8 h-8 text-primary" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<StateDisplayProps> = ({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading content.',
  actionLabel = 'Try Again',
  onAction,
  className,
}) => (
  <EmptyState
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    icon={<AlertOctagon className="w-8 h-8 text-rose-500" />}
    className={className}
  />
);

export const SuccessState: React.FC<StateDisplayProps> = ({
  title = 'Action Completed',
  description = 'Operation was executed successfully.',
  actionLabel,
  onAction,
  className,
}) => (
  <EmptyState
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    icon={<CheckCircle className="w-8 h-8 text-emerald-500" />}
    className={className}
  />
);
