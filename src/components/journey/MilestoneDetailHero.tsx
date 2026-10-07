import React from 'react';
import type { DetailedMilestone } from '@/data/journeyData';
import { Badge } from '@/components/ui/Badge';
import { Calendar } from 'lucide-react';

export interface MilestoneDetailHeroProps {
  milestone: DetailedMilestone;
}

export const MilestoneDetailHero: React.FC<MilestoneDetailHeroProps> = ({ milestone }) => {
  return (
    <div className="space-y-6">
      {/* Hero Content Shell */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="md">{milestone.category}</Badge>
          <Badge variant={milestone.status === 'Completed' ? 'success' : 'outline'} size="md">
            {milestone.status}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary" /> {milestone.date}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          {milestone.title}
        </h1>
        <p className="text-lg font-semibold text-primary">{milestone.subtitle}</p>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">{milestone.summary}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {milestone.tags.map((t) => (
            <span key={t} className="text-xs font-mono px-2.5 py-1 rounded bg-surface border border-border text-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
