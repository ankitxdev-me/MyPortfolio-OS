import React from 'react';
import { Card } from '@/components/cards/Card';
import { Layers, Server, Database, Cloud } from 'lucide-react';

export interface TechStackGroup {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
}

export interface ArchitectureCardProps {
  overview: string;
  architectureOverview: string;
  techStack: TechStackGroup;
}

export const ArchitectureCard: React.FC<ArchitectureCardProps> = ({
  overview,
  architectureOverview,
  techStack,
}) => {
  return (
    <Card variant="glass" padding="lg" className="space-y-6">
      <div className="space-y-2 border-b border-border/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
          <Layers className="w-4 h-4" /> System Architecture & Overview
        </div>
        <h3 className="text-xl font-bold text-foreground">Project Foundation</h3>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h4 className="font-semibold text-foreground mb-1">Problem Statement & Scope</h4>
          <p>{overview}</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">Architectural Design</h4>
          <p>{architectureOverview}</p>
        </div>
      </div>

      {/* Tech Stack Group Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Layers className="w-4 h-4 text-primary shrink-0" /> Frontend
          </div>
          <div className="flex flex-wrap gap-1">
            {techStack.frontend.map((t) => (
              <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-card border border-border text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Server className="w-4 h-4 text-primary shrink-0" /> Backend
          </div>
          <div className="flex flex-wrap gap-1">
            {techStack.backend.map((t) => (
              <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-card border border-border text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Database className="w-4 h-4 text-primary shrink-0" /> Database
          </div>
          <div className="flex flex-wrap gap-1">
            {techStack.database.map((t) => (
              <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-card border border-border text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Cloud className="w-4 h-4 text-primary shrink-0" /> Infrastructure
          </div>
          <div className="flex flex-wrap gap-1">
            {techStack.infrastructure.map((t) => (
              <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-card border border-border text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
