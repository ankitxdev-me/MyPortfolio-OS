import React from 'react';
import { cn } from '@/lib/utils';

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  status?: 'Planned' | 'In Progress' | 'Completed' | 'Missed';
  tags?: string[];
}

export interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ entries, className }) => {
  const statusColors = {
    Completed: 'bg-emerald-500 text-emerald-400 border-emerald-500/30',
    'In Progress': 'bg-primary text-primary-foreground border-primary',
    Planned: 'bg-surface text-muted-foreground border-border',
    Missed: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <div className={cn('relative border-l-0 pl-0 ml-0 md:border-l-2 md:border-border/80 md:pl-6 md:ml-3 space-y-4 sm:space-y-6 md:space-y-8', className)}>
      {entries.map((entry) => (
        <div key={entry.id} className="relative group">
          {/* Marker Dot (hidden on mobile phone view, preserved on desktop) */}
          <div
            className={cn(
              'hidden md:block absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125',
              entry.status ? statusColors[entry.status] : 'bg-primary border-background'
            )}
          />

          <div className="space-y-1.5 bg-card border border-border p-4 md:p-5 rounded-xl glass-card-hover">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold text-primary">{entry.date}</span>
              {entry.status && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface border border-border text-muted-foreground">
                  {entry.status}
                </span>
              )}
            </div>
            <h4 className="text-base font-bold text-foreground">{entry.title}</h4>
            <p className="text-sm text-muted-foreground">{entry.description}</p>
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {entry.tags.map((t) => (
                  <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
