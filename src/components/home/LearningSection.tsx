import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  ArrowRight,
  Flame,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Code,
  Code2,
  Database,
  Server,
  Box,
  Brain,
  Calendar,
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface LearningTrackItem {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  category?: string;
  proficiency?: number;
  progressPercent?: number;
  progress?: number;
  status?: string;
  startDate?: string;
  startedDate?: string;
  targetCompletion?: string;
  completedDate?: string;
  topics?: string[];
  description?: string;
  hoursSpent?: number;
  iconName?: string;
  featured?: boolean;
}

interface LearningSectionProps {
  tracks?: LearningTrackItem[];
  courses?: LearningTrackItem[];
  featuredTracks?: LearningTrackItem[];
  certificates?: any[];
  authorAvatar?: string;
  streakDays?: number;
}

export const LearningSection: React.FC<LearningSectionProps> = ({
  tracks,
  courses,
  featuredTracks,
  authorAvatar = '/images/ankit_hero_avatar.jpg',
  streakDays = 42,
}) => {
  // Support both tracks and courses prop for backward compatibility
  const rawList = tracks && tracks.length > 0 ? tracks : courses || [];

  // Filter published / active tracks (status !== Draft) for metrics, totals & overview
  const activeTracks = rawList.filter(
    (t) => (t as any).published !== false && t.status !== 'Draft' && t.status !== 'draft'
  );

  // STRICT: Display ONLY tracks marked as featured on homepage cards
  const sourceForCards = featuredTracks !== undefined ? featuredTracks : activeTracks;
  const cardTracks = sourceForCards.filter((t) => (t as any).featured === true);

  const [activeScrollIdx, setActiveScrollIdx] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const scrollDesktop = (direction: 'left' | 'right') => {
    if (!desktopScrollRef.current) return;
    const scrollAmount = 230; // card width + gap
    desktopScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const el = mobileScrollRef.current;
    const scrollLeft = el.scrollLeft;
    const cardWidth = 132; // approximate snap item width (120px) + gap (12px)
    const index = Math.round(scrollLeft / cardWidth);
    setActiveScrollIdx(Math.max(0, Math.min(index, cardTracks.length - 1)));
  };

  // ─── MATHEMATICAL RULES (STRICT SPEC COMPLIANCE) ───
  // Overall Progress = SUM(all active track percentages) / number of active tracks
  const totalTracks = activeTracks.length;
  const sumProgress = activeTracks.reduce((acc, t) => {
    const val = t.progressPercent ?? t.proficiency ?? t.progress ?? 0;
    return acc + Number(val);
  }, 0);

  const overallProgress = totalTracks > 0 ? Math.round(sumProgress / totalTracks) : 0;

  // Counts based on normalized status across all active tracks
  const completedCount = activeTracks.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'completed' || s === 'mastered' || (t.progressPercent ?? t.proficiency ?? 0) >= 100;
  }).length;

  const plannedCount = activeTracks.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'planned' || s === 'planning';
  }).length;

  const inProgressCount = Math.max(0, totalTracks - completedCount - plannedCount);

  // Responsive rectangular grid matching the second image (height larger than width)
  const desktopGridClass =
    cardTracks.length === 5
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      : cardTracks.length <= 4
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6';

  // Helper to normalize status & color theme
  const getTrackStatusMeta = (track: LearningTrackItem) => {
    const s = (track.status || '').toLowerCase();
    const percent = track.progressPercent ?? track.proficiency ?? track.progress ?? 0;

    if (s === 'completed' || s === 'mastered' || percent >= 100) {
      return {
        label: 'Completed',
        color: '#10B981', // emerald-500
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-950/40',
        dotColor: 'bg-emerald-400',
        icon: CheckCircle2,
      };
    }
    if (s === 'planned' || s === 'planning') {
      return {
        label: 'Planned',
        color: '#38BDF8', // sky-400
        textColor: 'text-sky-400',
        borderColor: 'border-sky-500/30',
        bgColor: 'bg-sky-950/40',
        dotColor: 'bg-sky-400',
        icon: Clock,
      };
    }
    return {
      label: 'In Progress',
      color: '#F97316', // orange-500
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-950/40',
      dotColor: 'bg-orange-400',
      icon: Play,
    };
  };

  // Helper to pick category icon
  const getCategoryIcon = (track: LearningTrackItem) => {
    const title = (track.title || track.name || '').toLowerCase();
    const cat = (track.category || '').toLowerCase();

    if (title.includes('langchain') || title.includes('ai') || cat.includes('ai') || cat.includes('ml')) {
      return { Icon: Brain, color: 'text-purple-400' };
    }
    if (title.includes('postgres') || title.includes('sql') || cat.includes('database')) {
      return { Icon: Database, color: 'text-emerald-400' };
    }
    if (title.includes('redis') || title.includes('queue') || cat.includes('backend')) {
      return { Icon: Server, color: 'text-amber-400' };
    }
    if (title.includes('docker') || title.includes('container') || cat.includes('devops')) {
      return { Icon: Box, color: 'text-orange-400' };
    }
    if (title.includes('next') || title.includes('react') || cat.includes('web')) {
      return { Icon: Code2, color: 'text-orange-400' };
    }
    return { Icon: Code, color: 'text-orange-400' };
  };

  // Extract real topics strictly from database (NO HARDCODED DEFAULTS)
  const getTrackTopics = (track: LearningTrackItem): string | null => {
    if (track.topics && Array.isArray(track.topics) && track.topics.length > 0) {
      const valid = track.topics.filter(Boolean);
      if (valid.length > 0) return valid.slice(0, 3).join(' • ');
    }
    return null;
  };

  // Helper to format dates
  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return 'Aug 15, 2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Aug 15, 2026';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Aug 15, 2026';
    }
  };

  // Activity bars for 7 days (M, T, W, T, F, S, S)
  const weeklyDays = [
    { day: 'M', height: '40%' },
    { day: 'T', height: '65%' },
    { day: 'W', height: '50%' },
    { day: 'T', height: '80%' },
    { day: 'F', height: '60%' },
    { day: 'S', height: '90%' },
    { day: 'S', height: '100%' },
  ];

  // SVG Circular Math for Main Dial
  const mainRadius = 70;
  const mainCircumference = 2 * Math.PI * mainRadius;
  const mainOffset = totalTracks > 0 ? mainCircumference - (overallProgress / 100) * mainCircumference : mainCircumference;

  // SVG Circular Math for Mobile Dial
  const mobileRadius = 48;
  const mobileCircumference = 2 * Math.PI * mobileRadius;
  const mobileOffset = totalTracks > 0 ? mobileCircumference - (overallProgress / 100) * mobileCircumference : mobileCircumference;

  return (
    <section className="py-16 md:py-24 border-t border-border/80 relative overflow-hidden bg-neutral-950/60">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            DESKTOP COMPOSITION (hidden md:block) — MATCHING IMAGE 1
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:block space-y-12">
          {/* Top 3-Column Overview Header */}
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Column: Title & Headline (4 Cols) */}
            <div className="col-span-4 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-orange-500 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>MY LEARNING JOURNEY</span>
                <span className="w-12 h-px bg-orange-500/40 ml-1" />
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
                Learning <br />
                <span className="orange-gradient-text">Never Stops</span>
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
                Exploring new technologies, building real projects, and growing a little every day.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <a
                  href="/learning"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold transition-all duration-200 shadow-sm hover:border-orange-500/50"
                >
                  <span>Explore Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="/learning"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  <span>View All Tracks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Center Column: Large Circular Progress Dial (4 Cols) */}
            <div className="col-span-4 flex flex-col items-center justify-center">
              {totalTracks === 0 ? (
                <div className="text-center p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <p className="text-sm text-neutral-400">No learning tracks yet.</p>
                </div>
              ) : (
                <div className="relative flex flex-col items-center">
                  <div className="relative w-52 h-52 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 160 160">
                      <defs>
                        <linearGradient id="desktopOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF7D33" />
                          <stop offset="100%" stopColor="#FF5722" />
                        </linearGradient>
                        <filter id="desktopGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Track background */}
                      <circle
                        cx="80"
                        cy="80"
                        r={mainRadius}
                        stroke="rgba(255, 255, 255, 0.07)"
                        strokeWidth="12"
                        fill="transparent"
                      />

                      {/* Progress filled ring */}
                      <circle
                        cx="80"
                        cy="80"
                        r={mainRadius}
                        stroke="url(#desktopOrangeGrad)"
                        strokeWidth="12"
                        strokeDasharray={mainCircumference}
                        strokeDashoffset={mainOffset}
                        strokeLinecap="round"
                        fill="transparent"
                        filter="url(#desktopGlow)"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    {/* Inside Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                      <span className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
                        {overallProgress}%
                      </span>
                      <div className="flex flex-col items-center mt-2 leading-none">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          OVERALL
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                          PROGRESS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Under Dial Summary across all active tracks */}
                  <div className="flex items-center justify-center flex-wrap gap-2 text-xs font-mono text-neutral-400 mt-4 text-center">
                    <span>
                      <strong className="text-white font-semibold">{totalTracks}</strong> Tracks
                    </span>
                    <span className="text-neutral-600">•</span>
                    {inProgressCount > 0 && (
                      <>
                        <span>
                          <strong className="text-white font-semibold">{inProgressCount}</strong> In Progress
                        </span>
                        <span className="text-neutral-600">•</span>
                      </>
                    )}
                    {plannedCount > 0 && (
                      <>
                        <span>
                          <strong className="text-white font-semibold">{plannedCount}</strong> Planned
                        </span>
                        <span className="text-neutral-600">•</span>
                      </>
                    )}
                    <span>
                      <strong className="text-white font-semibold">{completedCount}</strong> Completed
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Track Stats Summary (4 Cols) */}
            <div className="col-span-4 space-y-3">
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 shadow-xl flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{totalTracks}</div>
                  <div className="text-xs text-neutral-400 font-medium">Total Courses</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 shadow-xl flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{inProgressCount > 0 ? inProgressCount : plannedCount}</div>
                  <div className="text-xs text-neutral-400 font-medium">{inProgressCount > 0 ? 'In Progress' : 'Planned'}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 shadow-xl flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{completedCount}</div>
                  <div className="text-xs text-neutral-400 font-medium">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area: Featured Learning Tracks Horizontal Scroll Row */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
              <div className="flex items-center gap-2 text-lg font-bold text-white">
                <Layers className="w-5 h-5 text-orange-500" />
                <span>Featured Learning Tracks</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Scroll Chevrons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollDesktop('left')}
                    className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-all shadow-sm active:scale-95"
                    aria-label="Scroll left"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollDesktop('right')}
                    className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-all shadow-sm active:scale-95"
                    aria-label="Scroll right"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <a
                  href="/learning"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors ml-2"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Horizontal Scroll Track */}
            {cardTracks.length > 0 ? (
              <div
                ref={desktopScrollRef}
                className="flex items-stretch overflow-x-auto gap-4 pb-3 pt-1 scroll-smooth scrollbar-thin scrollbar-thumb-neutral-800/80 scrollbar-track-transparent"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {cardTracks.map((track, idx) => {
                  const percent = track.progressPercent ?? track.proficiency ?? track.progress ?? 0;
                  const meta = getTrackStatusMeta(track);
                  const { Icon, color: iconColor } = getCategoryIcon(track);
                  const topicsText = getTrackTopics(track);
                  const categoryName = track.category || 'General';
                  const dateLabel = meta.label === 'Planned' ? 'Target' : 'Started';
                  const dateValue = formatDateDisplay(
                    meta.label === 'Planned'
                      ? track.targetCompletion || track.completedDate
                      : track.startDate || track.startedDate
                  );

                  // Compact mini progress dial (radius 18 in 44x44 viewBox)
                  const miniRadius = 18;
                  const miniCircumference = 2 * Math.PI * miniRadius;
                  const miniOffset = miniCircumference - (percent / 100) * miniCircumference;

                  return (
                    <a
                      key={track.slug || track.id || idx}
                      href={track.slug ? `/learning/${track.slug}` : '/learning'}
                      className="w-[215px] min-w-[215px] shrink-0 p-4 rounded-2xl bg-neutral-900/85 border border-neutral-800/90 hover:border-orange-500/40 hover:bg-neutral-900 transition-all duration-200 flex flex-col justify-between space-y-3 group shadow-lg"
                    >
                      {/* Top Row: Category Icon & Category Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>

                        {/* Prominent Category Pill */}
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-orange-400">
                          {categoryName}
                        </span>
                      </div>

                      {/* Title & Real Topics (NO HARDCODED DEFAULT STRINGS) */}
                      <div className="space-y-1 min-h-[36px]">
                        <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1 leading-snug">
                          {track.title || track.name}
                        </h4>
                        {topicsText ? (
                          <p className="text-[11px] text-neutral-400 line-clamp-1">{topicsText}</p>
                        ) : (
                          <p className="text-[11px] text-neutral-600/70 italic line-clamp-1">
                            No topics defined
                          </p>
                        )}
                      </div>

                      {/* Center: Sleek Mini Progress Ring */}
                      <div className="flex items-center justify-center py-0.5">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 44 44">
                            <circle
                              cx="22"
                              cy="22"
                              r={miniRadius}
                              stroke="rgba(255, 255, 255, 0.08)"
                              strokeWidth="3.5"
                              fill="transparent"
                            />
                            <circle
                              cx="22"
                              cy="22"
                              r={miniRadius}
                              stroke={meta.color}
                              strokeWidth="3.5"
                              strokeDasharray={miniCircumference}
                              strokeDashoffset={miniOffset}
                              strokeLinecap="round"
                              fill="transparent"
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-white">
                            {percent}%
                          </span>
                        </div>
                      </div>

                      {/* Status Pill Badge */}
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${meta.bgColor} ${meta.borderColor} ${meta.textColor}`}
                        >
                          <meta.icon className="w-2.5 h-2.5" />
                          <span>{meta.label}</span>
                        </span>
                      </div>

                      {/* Footer: Started/Target Date */}
                      <div className="pt-2 border-t border-neutral-800/70 flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                        <Calendar className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span className="truncate">
                          {dateLabel} {dateValue}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 text-center space-y-2">
                <p className="text-sm text-neutral-400">No tracks are currently marked as featured for the homepage.</p>
                <a href="/learning" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-medium">
                  Explore all learning tracks &rarr;
                </a>
              </div>
            )}

            {/* Bottom Helen Hayes Quote Strip */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/90 flex items-center justify-between text-xs text-neutral-300 shadow-md">
              <div className="flex items-center gap-2.5 italic">
                <Quote className="w-4 h-4 text-orange-500 shrink-0" />
                <span>“The expert in anything was once a beginner.”</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-medium">— Helen Hayes</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MOBILE COMPOSITION (block md:hidden) — MATCHING IMAGE 2
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="block md:hidden space-y-6">
          {/* Mobile Header: Headline + Celestial Avatar */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-orange-500 uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>CONTINUOUS SKILL GROWTH</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Learning <br />
                <span className="orange-gradient-text">Never Stops</span>
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed pr-2">
                Exploring new technologies, building real projects, and growing a little every day.
              </p>
            </div>

            {/* Top Right: Glowing Avatar Frame */}
            <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24">
              <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md pointer-events-none" />
              <div className="relative w-full h-full rounded-full p-0.5 border border-orange-500/40 overflow-hidden bg-neutral-900 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <img
                  src={authorAvatar}
                  alt="Ankit Gupta"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Overview Card (Progress Dial + Categories Breakdown + 3 Stats) */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4 shadow-xl">
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Left: Circular Progress Ring */}
              <div className="col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 110 110">
                    <defs>
                      <linearGradient id="mobileOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF7D33" />
                        <stop offset="100%" stopColor="#FF5722" />
                      </linearGradient>
                    </defs>

                    <circle
                      cx="55"
                      cy="55"
                      r={mobileRadius}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="9"
                      fill="transparent"
                    />

                    <circle
                      cx="55"
                      cy="55"
                      r={mobileRadius}
                      stroke="url(#mobileOrangeGrad)"
                      strokeWidth="9"
                      strokeDasharray={mobileCircumference}
                      strokeDashoffset={mobileOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                    <span className="text-2xl font-black text-white tracking-tight leading-none">
                      {overallProgress}%
                    </span>
                    <div className="flex flex-col items-center mt-1 leading-none">
                      <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-wider">
                        OVERALL
                      </span>
                      <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">
                        PROGRESS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Category List with Colored Bullets & Percentages across active tracks */}
              <div className="col-span-7 space-y-1.5 pl-1">
                {activeTracks.length > 0 ? (
                  activeTracks.slice(0, 6).map((track, idx) => {
                    const percent = track.progressPercent ?? track.proficiency ?? track.progress ?? 0;
                    const meta = getTrackStatusMeta(track);
                    const name = track.title || track.name;

                    return (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dotColor}`} />
                          <span className="text-neutral-300 truncate text-[11px]">{name}</span>
                        </div>
                        <span className="text-white font-mono font-semibold text-[11px] shrink-0">
                          {percent}%
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[11px] text-neutral-500 italic py-2">
                    No learning tracks yet
                  </div>
                )}
              </div>
            </div>

            {/* Bottom 3-Stat Pill Cards */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-800/80">
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{totalTracks}</div>
                  <div className="text-[9px] text-neutral-400 leading-tight">Total Tracks</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                {inProgressCount > 0 ? (
                  <>
                    <Play className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">{inProgressCount}</div>
                      <div className="text-[9px] text-neutral-400 leading-tight">In Progress</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">{plannedCount}</div>
                      <div className="text-[9px] text-neutral-400 leading-tight">Planned</div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{completedCount}</div>
                  <div className="text-[9px] text-neutral-400 leading-tight">Completed</div>
                </div>
              </div>
            </div>
          </div>


          {/* Section 3: Mobile Learning Tracks (Only Featured Cards, Compact) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Learning Tracks</span>
              </div>

              <a
                href="/learning"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Swipeable Track Row */}
            {cardTracks.length > 0 ? (
              <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4 scrollbar-none scroll-smooth"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {cardTracks.map((track, idx) => {
                  const percent = track.progressPercent ?? track.proficiency ?? track.progress ?? 0;
                  const meta = getTrackStatusMeta(track);
                  const { Icon, color: iconColor } = getCategoryIcon(track);
                  const shortName = track.title || track.name;
                  const categoryName = track.category || 'General';

                  // Compact mobile ring
                  const miniRadius = 14;
                  const miniCircumference = 2 * Math.PI * miniRadius;
                  const miniOffset = miniCircumference - (percent / 100) * miniCircumference;

                  return (
                    <a
                      key={track.slug || track.id || idx}
                      href={track.slug ? `/learning/${track.slug}` : '/learning'}
                      className="snap-start shrink-0 w-[120px] min-w-[120px] max-w-[120px] rounded-xl bg-neutral-900/90 border border-neutral-800 p-2.5 flex flex-col items-center justify-between text-center space-y-2 hover:border-orange-500/40 active:scale-95 transition-all shadow-md"
                    >
                      {/* Top: Icon & Category */}
                      <div className="w-full flex items-center justify-between gap-1">
                        <div className="w-6.5 h-6.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center p-1">
                          <Icon className={`w-3 h-3 ${iconColor}`} />
                        </div>
                        <span className="text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-orange-400/90 truncate max-w-[56px]">
                          {categoryName}
                        </span>
                      </div>

                      {/* Track Title */}
                      <h5 className="text-[10.5px] font-bold text-white truncate w-full px-0.5 leading-tight" title={shortName}>
                        {shortName}
                      </h5>

                      {/* Mini Ring Meter */}
                      <div className="relative w-9.5 h-9.5 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r={miniRadius}
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="2.5"
                            fill="transparent"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r={miniRadius}
                            stroke={meta.color}
                            strokeWidth="2.5"
                            strokeDasharray={miniCircumference}
                            strokeDashoffset={miniOffset}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-white">
                          {percent}%
                        </span>
                      </div>

                      {/* Status Dot */}
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                        <span>{meta.label}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center space-y-1">
                <p className="text-xs text-neutral-400">No tracks marked as featured.</p>
                <a href="/learning" className="inline-flex items-center gap-1 text-[11px] text-orange-400">
                  View all tracks &rarr;
                </a>
              </div>
            )}

            {/* Swipe Indicator Dots */}
            {cardTracks.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {cardTracks.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeScrollIdx === i ? 'w-5 bg-orange-500' : 'w-1.5 bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Bottom Callout Banner */}
          <a
            href="/learning"
            className="p-3 rounded-2xl bg-gradient-to-r from-neutral-900/90 to-neutral-900/70 border border-neutral-800/90 flex items-center justify-between gap-3 group active:scale-95 transition-all shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                  Keep Learning, Keep Growing!
                </h5>
                <p className="text-[10px] text-neutral-400">Better skills. Brighter opportunities.</p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-neutral-800 group-hover:bg-neutral-700 flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors shrink-0">
              <ArrowRight className="w-3 h-3" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
