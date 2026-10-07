import React from 'react';
import type { DetailedSemester } from '@/data/academicsData';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';

export interface SemesterCardProps {
  semester: DetailedSemester;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({ semester }) => {
  return (
    <Card
      variant="glass"
      padding="md"
      className="space-y-4 border-primary/20 flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="primary" size="sm">{semester.term}</Badge>
          <span className="text-xs font-mono text-primary font-bold">
            SGPA: {semester.sgpa}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-extrabold text-foreground">
            {semester.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{semester.summary}</p>
        </div>

        {/* Core Subjects List Preview */}
        {semester.subjects && semester.subjects.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Key Courses:</span>
            <div className="space-y-1">
              {(semester.subjects || []).slice(0, 3).map((sub) => (
                <div key={sub.code || sub.name} className="flex items-center justify-between text-xs p-1.5 rounded bg-surface border border-border">
                  <span className="text-foreground font-medium truncate max-w-[200px]">{sub.name}</span>
                  <span className="text-primary font-mono font-bold text-[11px]">{sub.grade}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>{semester.credits || 24} Total Credits</span>
        <span className="text-primary font-semibold">Semester Performance</span>
      </div>
    </Card>
  );
};
