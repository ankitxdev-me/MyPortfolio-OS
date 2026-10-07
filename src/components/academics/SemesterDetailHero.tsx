import React from 'react';
import type { DetailedSemester } from '@/data/academicsData';
import { Badge } from '@/components/ui/Badge';

export interface SemesterDetailHeroProps {
  semester: DetailedSemester;
}

export const SemesterDetailHero: React.FC<SemesterDetailHeroProps> = ({ semester }) => {
  return (
    <div className="space-y-6">
      {/* Hero Shell */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="md">{semester.term}</Badge>
          <Badge variant={semester.status === 'Completed' ? 'success' : 'outline'} size="md">
            {semester.status}
          </Badge>
          <span className="text-xs font-mono text-primary font-bold">
            SGPA: {semester.sgpa}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          {semester.title}
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">{semester.summary}</p>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1 text-center font-mono">
          <span className="text-xs text-muted-foreground uppercase">Semester SGPA</span>
          <p className="text-xl font-bold text-primary">{semester.sgpa}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1 text-center font-mono">
          <span className="text-xs text-muted-foreground uppercase">Credits Earned</span>
          <p className="text-xl font-bold text-foreground">{semester.credits}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1 text-center font-mono">
          <span className="text-xs text-muted-foreground uppercase">Courses Taken</span>
          <p className="text-xl font-bold text-foreground">{(semester.subjects || semester.courses || []).length}</p>
        </div>
      </div>
    </div>
  );
};
