import React from 'react';
import type { DetailedMilestone } from '@/data/journeyData';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Calendar } from 'lucide-react';

export interface MilestoneCardProps {
  milestone: DetailedMilestone;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  return (
    <Card
      variant="glass"
      padding="md"
      className="group cursor-pointer space-y-3 hover:border-primary/50 transition-all duration-300"
      onClick={() => (window.location.href = `/journey/${milestone.slug}`)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="primary" size="sm">{milestone.category}</Badge>
        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-primary" /> {milestone.date}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
          <span>{milestone.title}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </h4>
        <p className="text-xs font-semibold text-primary">{milestone.subtitle}</p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{milestone.summary}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
        {milestone.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
};
