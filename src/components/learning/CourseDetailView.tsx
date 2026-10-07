import React from 'react';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Sparkles,
  Milestone,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export interface CourseDetailDTO {
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  description?: string;
  whyLearning?: string;
  platform?: string;
  instructor?: string;
  category?: string;
  status?: string;
  progressPercent?: number;
  proficiency?: number;
  startDate?: string;
  startedDate?: string;
  targetCompletion?: string;
  completedDate?: string;
  topics?: string[];
  timeline?: { date?: string; title?: string; description?: string }[];
  url?: string;
}

export interface CourseDetailViewProps {
  course: CourseDetailDTO;
  relatedCourses?: CourseDetailDTO[];
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

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, relatedCourses = [] }) => {
  const displayTitle = course.title || course.name || 'Continuous Learning Deep Dive';
  const displayPercent = course.progressPercent ?? course.proficiency ?? 50;
  const normalizedStatus = (course.status || 'In Progress').toLowerCase();

  const formattedStart = formatDate(course.startDate || course.startedDate);
  const formattedTarget = formatDate(course.completedDate || course.targetCompletion);

  const motivationText =
    course.description ||
    course.whyLearning ||
    'Mastering core foundations and production-grade architectures to design resilient, scalable software systems.';

  return (
    <div className="space-y-10">
      {/* Hero Header Section */}
      <Card variant="glass" padding="lg" className="space-y-6 border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md" className="font-mono">
                {course.platform || 'Self-Paced Track'}
              </Badge>
              {course.category && (
                <Badge variant="outline" size="md" className="font-mono">
                  {course.category}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {normalizedStatus.includes('master') || normalizedStatus.includes('complete') ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mastered (Completed)
                </span>
              ) : normalizedStatus.includes('plan') ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-semibold font-mono">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Planned Roadmap
                </span>
              ) : normalizedStatus.includes('explor') ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-semibold font-mono">
                  <Compass className="w-3.5 h-3.5 text-purple-400" /> Exploring & Research
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-semibold font-mono">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Active Learning
                </span>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            {displayTitle}
          </h1>
        </div>

        {/* Progress & Quick Metrics Bar */}
        <div className="pt-4 border-t border-border/80 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground uppercase flex items-center gap-1.5 font-bold">
              <GraduationCap className="w-4 h-4 text-primary" /> Track Mastery & Completion Progress
            </span>
            <span className="text-primary font-extrabold text-base">{displayPercent}%</span>
          </div>

          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/80 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-primary via-orange-400 to-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, displayPercent))}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Main Grid: Description / Motivation & Visual Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Why Started / Motivation & Key Topics (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Motivation & Why I Started Card */}
          <Card variant="glass" padding="md" className="space-y-4 border-primary/20">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Why I Started & Learning Objective</h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {motivationText}
            </p>
          </Card>

          {/* Key Topics & Syllabus Modules */}
          {course.topics && course.topics.length > 0 && (
            <Card variant="glass" padding="md" className="space-y-4 border-primary/20">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Key Topics & Modules Explored</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-surface/80 border border-border/60 text-xs font-mono text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Visual Timeline & Meta Specs (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Timeline Card */}
          <Card variant="glass" padding="md" className="space-y-5 border-primary/20">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Milestone className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Learning Timeline</h2>
            </div>

            {course.timeline && course.timeline.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
                {course.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary text-primary flex items-center justify-center shrink-0 z-10">
                      <Milestone className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5 pt-0.5">
                      {item.date && (
                        <span className="text-[11px] font-mono text-primary font-bold block">
                          {formatDate(item.date)}
                        </span>
                      )}
                      <h3 className="text-xs font-bold text-foreground">{item.title}</h3>
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 rounded-xl bg-surface/40 border border-dashed border-border text-center space-y-2">
                <Milestone className="w-5 h-5 text-muted-foreground/60 mx-auto" />
                <p className="text-xs font-mono text-muted-foreground">
                  Milestones / Timeline is not added yet.
                </p>
              </div>
            )}
          </Card>

          {/* Quick Details Card */}
          <Card variant="glass" padding="md" className="space-y-3 border-primary/20 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Platform</span>
              <span className="font-bold text-foreground">{course.platform || 'Self-Paced'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Category</span>
              <span className="font-bold text-foreground">{course.category || 'Engineering'}</span>
            </div>
            {formattedStart && (
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-bold text-foreground">{formattedStart}</span>
              </div>
            )}
            {formattedTarget && (
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">
                  {normalizedStatus.includes('master') || normalizedStatus.includes('complete') ? 'Completed Date' : 'Target Date'}
                </span>
                <span className="font-bold text-foreground">{formattedTarget}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Status</span>
              <span className="font-bold text-primary capitalize">{course.status || 'In Progress'}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Related / Other Courses Section */}
      {relatedCourses && relatedCourses.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-border/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Other Learning Tracks
            </h3>
            <a
              href="/learning"
              className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1"
            >
              View All Tracks <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedCourses.map((rel) => (
              <Card
                key={rel.id || rel.slug}
                variant="glass"
                padding="md"
                className="space-y-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => (window.location.href = `/learning/${rel.slug || rel.id}`)}
              >
                <div className="flex justify-between items-center">
                  <Badge variant="primary" size="sm" className="font-mono text-[10px]">
                    {rel.platform || 'Self-Paced'}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-primary">
                    {rel.progressPercent ?? rel.proficiency ?? 50}%
                  </span>
                </div>
                <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors">
                  {rel.title || rel.name}
                </h4>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
