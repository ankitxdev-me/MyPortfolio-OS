import React from 'react';
import { Card } from './Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, CheckCircle2, Clock, Calendar, Compass } from 'lucide-react';

export interface LearningCardProps {
  category?: string;
  title?: string;
  name?: string;
  slug?: string;
  progress?: number;
  progressPercent?: number;
  proficiency?: number;
  resourcesCount?: number;
  platform?: string;
  status?: string;
  startDate?: string;
  targetCompletion?: string;
  completedDate?: string;
  topics?: string[];
  timeline?: { date?: string; title?: string; description?: string }[];
  icon?: React.ReactNode;
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

export const LearningCard: React.FC<LearningCardProps> = ({
  category,
  title,
  name,
  slug,
  progress,
  progressPercent,
  proficiency,
  platform = 'Self-Paced',
  status = 'In Progress',
  startDate,
  targetCompletion,
  completedDate,
  topics = [],
  timeline = [],
  icon,
  onClick,
}) => {
  const displayTitle = title || name || category || 'Engineering Deep Dive';
  const displayProgress = progress ?? progressPercent ?? proficiency ?? 50;
  const normalizedStatus = (status || 'In Progress').toLowerCase();

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(completedDate || targetCompletion);

  // Latest milestone if added
  const latestMilestone = timeline && timeline.length > 0
    ? timeline[timeline.length - 1]?.title
    : null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (slug) {
      window.location.href = `/learning/${slug}`;
    }
  };

  return (
    <Card
      variant="interactive"
      padding="md"
      className="space-y-4 group flex flex-col justify-between border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-primary/5 cursor-pointer"
      onClick={handleClick}
    >
      <div className="space-y-3">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="primary" size="sm" className="font-mono text-[10px]">
              {platform}
            </Badge>

            {category && (
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                {category}
              </Badge>
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

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              {icon || <BookOpen className="w-4 h-4" />}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors leading-snug">
                {displayTitle}
              </h3>
            </div>
          </div>
        </div>

        {/* Dates & Timeline (Clean & Minimal) */}
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

        {/* Topics Pills */}
        {topics && topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {topics.slice(0, 4).map((topic, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-surface border border-border/80 text-[10px] font-mono text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar Strip & Working On Milestone */}
      <div className="space-y-1.5 pt-2">
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/60">
          <div
            className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
          />
        </div>

        {latestMilestone && (
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5 font-mono">
            <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate">
              Working on: <strong className="text-foreground font-semibold">{latestMilestone}</strong>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
