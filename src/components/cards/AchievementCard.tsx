import React from 'react';
import { Card } from './Card';
import { Trophy } from 'lucide-react';

export interface AchievementCardProps {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  icon?: React.ReactNode;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  issuer,
  date,
  description,
  icon,
}) => {
  return (
    <Card variant="glass" padding="md" className="flex gap-4 items-start">
      <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
        {icon || <Trophy className="w-5 h-5" />}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="text-xs font-mono text-muted-foreground">{date}</span>
        </div>
        <p className="text-xs text-primary font-medium">{issuer}</p>
        {description && <p className="text-sm text-muted-foreground pt-1">{description}</p>}
      </div>
    </Card>
  );
};
