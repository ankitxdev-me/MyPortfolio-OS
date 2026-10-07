import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'published' | 'draft' | 'in_progress' | 'completed' | 'archived';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const map = {
    published: { variant: 'success' as const, label: 'Published' },
    completed: { variant: 'success' as const, label: 'Completed' },
    draft: { variant: 'secondary' as const, label: 'Draft' },
    in_progress: { variant: 'primary' as const, label: 'In Progress' },
    archived: { variant: 'outline' as const, label: 'Archived' },
  };

  const item = map[status] || { variant: 'outline' as const, label: status };

  return (
    <Badge variant={item.variant} size="sm" className={cn('capitalize font-mono', className)}>
      {item.label}
    </Badge>
  );
};
