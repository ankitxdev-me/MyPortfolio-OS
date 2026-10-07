import React from 'react';
import type { WorkExperience } from '@/data/resumeData';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export interface ResumeExperienceProps {
  experience: WorkExperience;
}

export const ResumeExperience: React.FC<ResumeExperienceProps> = ({ experience }) => {
  return (
    <Card variant="glass" padding="md" className="space-y-4 border-primary/20">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-foreground">{experience.role}</h3>
          <p className="text-sm font-semibold text-primary flex items-center gap-1.5 mt-0.5">
            <Briefcase className="w-3.5 h-3.5" /> {experience.company}
          </p>
        </div>

        <div className="text-right space-y-1">
          <Badge variant="primary" size="sm">{experience.type}</Badge>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {experience.period}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {experience.location}</span>
          </div>
        </div>
      </div>

      {/* Highlights List */}
      <div className="space-y-2 pt-1">
        {experience.highlights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Tech Stack Pills */}
      <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5">
        {experience.technologies.map((tech) => (
          <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-foreground">
            {tech}
          </span>
        ))}
      </div>
    </Card>
  );
};
