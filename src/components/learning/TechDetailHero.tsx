import React from 'react';
import type { TechnologyDetail } from '@/data/learningData';
import { Badge } from '@/components/ui/Badge';
import { Clock, FolderGit2, BookOpen } from 'lucide-react';

export interface TechDetailHeroProps {
  tech: TechnologyDetail;
}

export const TechDetailHero: React.FC<TechDetailHeroProps> = ({ tech }) => {
  return (
    <div className="space-y-6">
      {/* Title & Badges */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="md">{tech.category}</Badge>
          <Badge variant="outline" size="md">{tech.level}</Badge>
          <Badge variant={tech.status === 'Mastered' ? 'success' : 'outline'} size="md">
            {tech.status}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          {tech.name}
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">{tech.description}</p>
      </div>

      {/* Quick Metrics & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-border">
        <div className="md:col-span-6 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground uppercase">Skill Mastery Index</span>
            <span className="text-primary font-bold">{tech.progress}%</span>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${tech.progress}%` }} />
          </div>
        </div>

        <div className="md:col-span-6 grid grid-cols-3 gap-3 text-center font-mono text-xs">
          <div className="p-3 rounded-xl bg-surface border border-border">
            <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
            <span className="font-bold text-foreground block text-sm">{tech.hoursInvested}h</span>
            <span className="text-[10px] text-muted-foreground uppercase">Invested</span>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border">
            <FolderGit2 className="w-4 h-4 text-primary mx-auto mb-1" />
            <span className="font-bold text-foreground block text-sm">{tech.projectsCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Projects</span>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border">
            <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
            <span className="font-bold text-foreground block text-sm">{tech.blogsCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Articles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
