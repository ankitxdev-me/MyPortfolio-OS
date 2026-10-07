import React from 'react';
import type { DetailedClientWork } from '@/data/freelanceData';
import { Badge } from '@/components/ui/Badge';
import { Building2, Clock } from 'lucide-react';

export interface ClientDetailHeroProps {
  work: DetailedClientWork;
}

export const ClientDetailHero: React.FC<ClientDetailHeroProps> = ({ work }) => {
  return (
    <div className="space-y-6">
      {/* Hero Shell */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="md">{work.industry}</Badge>
          <Badge variant="success" size="md">{work.status}</Badge>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" /> {work.duration}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          {work.title}
        </h1>
        <p className="text-lg font-semibold text-primary flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Client: {work.clientName}
        </p>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">{work.description}</p>

        {/* Tech Stack */}
        {work.techStack && work.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {(work.techStack || []).map((tech) => (
              <span key={tech} className="text-xs font-mono px-2.5 py-1 rounded bg-surface border border-border text-foreground">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Business Impact Metrics */}
      {work.businessImpact && work.businessImpact.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border text-center font-mono">
          {(work.businessImpact || []).map((imp, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-xs text-muted-foreground uppercase">{imp.label}</span>
              <p className="text-xl font-bold text-primary">{imp.metric}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
