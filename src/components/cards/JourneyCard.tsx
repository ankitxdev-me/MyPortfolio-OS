import React from 'react';
import { Card } from './Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar } from 'lucide-react';

export interface JourneyCardProps {
  title: string;
  subtitle: string;
  date: string;
  description: string;
  tags?: string[];
  type?: 'milestone' | 'education' | 'career';
}

export const JourneyCard: React.FC<JourneyCardProps> = ({
  title,
  subtitle,
  date,
  description,
  tags = [],
  type = 'milestone',
}) => {
  return (
    <Card variant="glass" padding="md" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant={type === 'career' ? 'primary' : 'outline'}>{type}</Badge>
        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {date}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm font-medium text-primary">{subtitle}</p>
      </div>

      <p className="text-sm text-muted-foreground">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};

export const TimelineCard = JourneyCard;
