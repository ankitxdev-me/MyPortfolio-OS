import React from 'react';
import type { DetailedClientWork } from '@/data/freelanceData';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Building2, Clock } from 'lucide-react';

export interface ClientWorkCardProps {
  work: DetailedClientWork;
}

export const ClientWorkCard: React.FC<ClientWorkCardProps> = ({ work }) => {
  return (
    <Card
      variant="glass"
      padding="md"
      className="group cursor-pointer space-y-4 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
      onClick={() => (window.location.href = `/freelancing/${work.slug}`)}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="primary" size="sm">{work.industry}</Badge>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" /> {work.duration}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
            <span>{work.title}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-xs font-semibold text-primary flex items-center gap-1 mt-0.5">
            <Building2 className="w-3.5 h-3.5" /> {work.clientName}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">{work.description}</p>
        </div>

        {/* Impact Highlights */}
        {work.businessImpact && work.businessImpact.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center font-mono">
            {(work.businessImpact || []).map((imp, idx) => (
              <div key={idx} className="p-1.5 rounded bg-surface border border-border">
                <span className="text-xs font-bold text-foreground block">{imp.metric}</span>
                <span className="text-[9px] text-muted-foreground uppercase">{imp.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>{work.projectType}</span>
        <span className="text-primary group-hover:underline">View Case Study &rarr;</span>
      </div>
    </Card>
  );
};
