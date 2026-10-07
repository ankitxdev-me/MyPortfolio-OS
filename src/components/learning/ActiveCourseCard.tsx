import React from 'react';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Calendar, CheckCircle2, Compass, Clock, Pin } from 'lucide-react';

export interface ActiveCourseCardProps {
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  description?: string;
  platform?: string;
  category?: string;
  status?: string;
  progress?: number;
  progressPercent?: number;
  proficiency?: number;
  isPinned?: boolean;
  isTopSkill?: boolean;
  nextChapter?: string;
  startDate?: string;
  estimatedCompletion?: string;
  targetCompletion?: string;
  completedDate?: string;
  topics?: string[];
  onClick?: () => void;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr || dateStr.toLowerCase() === 'in progress') return '';
  try {
    const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = clean.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    }
    return clean;
  } catch {
    return dateStr.split('T')[0];
  }
};

export const ActiveCourseCard: React.FC<ActiveCourseCardProps> = ({
  id,
  slug,
  title,
  name,
  platform = 'Self-Paced',
  category,
  status = 'In Progress',
  progress,
  progressPercent,
  proficiency,
  isPinned,
  isTopSkill,
  nextChapter,
  startDate,
  estimatedCompletion,
  targetCompletion,
  completedDate,
  topics = [],
  onClick,
}) => {
  const displayTitle = title || name || 'Advanced Engineering Course';
  const displayProgress = progress ?? progressPercent ?? proficiency ?? 50;
  const normalizedStatus = (status || 'In Progress').toLowerCase();

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(completedDate || targetCompletion || estimatedCompletion);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const targetSlug = slug || id;
      if (targetSlug) {
        window.location.href = `/learning/${targetSlug}`;
      }
    }
  };

  return (
    <Card
      variant="glass"
      padding="md"
      className="space-y-4 border-primary/20 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="primary" size="sm" className="font-mono text-[10px]">{platform}</Badge>
            {category && (
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">{category}</Badge>
            )}

            {(isPinned || isTopSkill) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold font-mono">
                <Pin className="w-3 h-3 text-amber-400 fill-amber-400" /> Pinned
              </span>
            )}

            {/* Dynamic Status Badges */}
            {normalizedStatus.includes('master') || normalizedStatus.includes('complete') ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mastered
              </span>
            ) : normalizedStatus.includes('plan') ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-semibold font-mono">
                <Calendar className="w-3 h-3 text-blue-400" /> Planned
              </span>
            ) : normalizedStatus.includes('explor') ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-semibold font-mono">
                <Compass className="w-3 h-3 text-purple-400" /> Exploring
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[10px] font-semibold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" /> In Progress
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground flex items-start gap-2 group-hover:text-primary transition-colors">
            <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{displayTitle}</span>
          </h4>
          {nextChapter && (
            <p className="text-xs text-muted-foreground font-mono">Next: {nextChapter}</p>
          )}
        </div>

        {/* Dates */}
        {(formattedStart || formattedEnd) && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground pt-0.5">
            {formattedStart && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" /> Started: {formattedStart}
              </span>
            )}
            {formattedEnd && (
              <span>Target: {formattedEnd}</span>
            )}
          </div>
        )}

        {/* Topics Badges */}
        {topics && topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topics.slice(0, 4).map((topic, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-3 border-t border-border/60">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-muted-foreground">Course Completion</span>
          <span className="text-primary font-bold">{displayProgress}%</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/60">
          <div
            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
