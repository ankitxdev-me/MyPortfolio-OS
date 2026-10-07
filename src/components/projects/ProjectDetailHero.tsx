import React from 'react';
import type { DetailedProject } from '@/data/projectsData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Github, ExternalLink, Calendar } from 'lucide-react';

export interface ProjectDetailHeroProps {
  project: DetailedProject;
}

export const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      {/* Hero Content Shell */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="primary" size="md">{project.category}</Badge>
          <Badge variant={project.status === 'Completed' ? 'success' : 'outline'} size="md">
            {project.status}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary" /> {project.startDate} — {project.deadline}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          {project.title}
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-primary">{project.subtitle}</p>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">{project.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="md" rightIcon={<ExternalLink className="w-4 h-4" />}>
                Launch Live Demo
              </Button>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="md" leftIcon={<Github className="w-4 h-4" />}>
                View Source Code
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
        {project.metrics.map((m, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
            <span className="text-xs font-mono text-muted-foreground uppercase">{m.label}</span>
            <p className="text-lg font-bold text-foreground font-mono">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
