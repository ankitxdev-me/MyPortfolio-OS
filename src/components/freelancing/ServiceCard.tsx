import React from 'react';
import type { ServiceItem } from '@/data/freelanceData';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Code2 } from 'lucide-react';

export interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card variant="glass" padding="md" className="space-y-4 border-primary/20 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="primary" size="sm">{service.category}</Badge>
          <Code2 className="w-4 h-4 text-primary" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">{service.description}</p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-1.5 pt-2">
          {(service.features || []).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div className="pt-3 border-t border-border/60 flex flex-wrap gap-1">
        {(service.techStack || []).map((tech) => (
          <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-foreground">
            {tech}
          </span>
        ))}
      </div>
    </Card>
  );
};
