import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Play,
  LayoutGrid,
  TrendingUp,
  Brain,
  Database,
  Server,
  Box,
  Code2,
  Code,
  Layers,
  Sparkles,
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
  keyTakeaways?: string[];
  architectureNotes?: string;
  recommendedResources?: any[];
  iconName?: string;
  featured?: boolean;
}

export interface LearningProgressViewProps {
  initialCourses: LearningTrackItem[];
  streakDays?: number;
}

export const LearningProgressView: React.FC<LearningProgressViewProps> = ({
  initialCourses = [],
  streakDays = 42,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter published / active tracks from database
  const tracks = useMemo(() => {
    return initialCourses.filter(
      (t) => (t as any).published !== false && t.status !== 'Draft' && t.status !== 'draft'
    );
  }, [initialCourses]);

  // Dynamic calculations directly from active MongoDB learning tracks
  const totalCourses = tracks.length;

  const totalHours = useMemo(() => {
    return tracks.reduce((acc, t) => acc + (Number(t.hoursSpent) || 0), 0);
  }, [tracks]);

  const sumProgress = useMemo(() => {
    return tracks.reduce((acc, t) => {
      const val = Number(t.proficiency ?? t.progressPercent ?? t.progress ?? 0);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [tracks]);

  const overallProgress = totalCourses > 0 ? Math.round(sumProgress / totalCourses) : 0;

  // Real count of mastered and in-progress tracks
  const completedCount = useMemo(() => {
    return tracks.filter((t) => {
      const s = (t.status || '').toLowerCase();
      const val = Number(t.proficiency ?? t.progressPercent ?? t.progress ?? 0);
      return s === 'completed' || s === 'mastered' || val >= 100;
    }).length;
  }, [tracks]);

  const inProgressCount = Math.max(0, totalCourses - completedCount);

  // Dynamic Domain Breakdown based on real database records
  const categoryBreakdown = useMemo(() => {
    if (!tracks || tracks.length === 0) return [];

    const domainColors: Record<string, string> = {
      'Web Dev': '#F97316',
      'Frontend': '#F97316',
      'Backend': '#FB923C',
      'Database': '#2DD4BF',
      'DevOps': '#38BDF8',
      'AI / ML': '#A855F7',
      'AI': '#A855F7',
      'Cloud': '#0EA5E9',
      'Security': '#EC4899',
    };

    const fallbackColors = ['#F97316', '#2DD4BF', '#38BDF8', '#A855F7', '#FB923C', '#EC4899', '#EAB308'];
    const categoryMap: Record<string, { total: number; count: number }> = {};

    tracks.forEach((track) => {
      const cat = track.category?.trim() || 'General';
      const val = Number(track.proficiency ?? track.progressPercent ?? track.progress ?? 0);
      if (!categoryMap[cat]) {
        categoryMap[cat] = { total: 0, count: 0 };
      }
      categoryMap[cat].total += isNaN(val) ? 0 : val;
      categoryMap[cat].count += 1;
    });

    return Object.entries(categoryMap).map(([name, { total, count }], idx) => {
      const percentage = Math.round(total / count);
      return {
        name,
        percentage,
        count,
        color: domainColors[name] || fallbackColors[idx % fallbackColors.length],
      };
    });
  }, [tracks]);

  // Unique list of categories for interactive tab bar
  const categories = useMemo(() => {
    const set = new Set<string>();
    tracks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['all', ...Array.from(set)];
  }, [tracks]);

  // Filtered tracks based on active interactive tab
  const filteredTracks = useMemo(() => {
    if (activeCategory === 'all') return tracks;
    return tracks.filter((t) => (t.category || '').toLowerCase() === activeCategory.toLowerCase());
  }, [tracks, activeCategory]);

  // Helper for status meta styling
  const getStatusMeta = (track: LearningTrackItem) => {
    const s = (track.status || '').toLowerCase();
    const percent = Number(track.proficiency ?? track.progressPercent ?? track.progress ?? 0);

    if (s === 'completed' || s === 'mastered' || percent >= 100) {
      return {
        label: 'Mastered',
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

  // Helper for category icon
  const getCategoryIcon = (category?: string, name?: string) => {
    const cat = (category || '').toLowerCase();
    const n = (name || '').toLowerCase();

    if (cat.includes('ai') || cat.includes('ml') || n.includes('langchain')) {
      return { Icon: Brain, color: 'text-purple-400' };
    }
    if (cat.includes('database') || n.includes('postgres') || n.includes('sql')) {
      return { Icon: Database, color: 'text-teal-400' };
    }
    if (cat.includes('backend') || n.includes('redis')) {
      return { Icon: Server, color: 'text-amber-400' };
    }
    if (cat.includes('devops') || n.includes('docker') || n.includes('container')) {
      return { Icon: Box, color: 'text-sky-400' };
    }
    if (cat.includes('web') || n.includes('react') || n.includes('next') || n.includes('typescript')) {
      return { Icon: Code2, color: 'text-orange-400' };
    }
    return { Icon: Code, color: 'text-orange-400' };
  };

  // SVG Gauge Math for Hero Circle
  const heroRadius = 52;
  const heroCircumference = 2 * Math.PI * heroRadius;
  const heroOffset = heroCircumference - (overallProgress / 100) * heroCircumference;

  return (
    <div className="space-y-10 sm:space-y-14 pb-20">
      {/* ═══════════════════════════════════════════════════════════════════
          1. DYNAMIC LEARNING HERO SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-3xl bg-neutral-900/60 border border-neutral-800/80 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Description & Key Stats */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>ENGINEERING KNOWLEDGE BASE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Continuous Skill <br />
              <span className="orange-gradient-text">& Architecture Growth</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
              Live tracking of real-world technical proficiency, deep architecture principles, and ongoing engineering mastery across systems, databases, and AI.
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/90 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-white">{totalCourses}</div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Active Tracks</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/90 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-white">{totalHours > 0 ? `${totalHours}+` : '800+'}</div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Hours Invested</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/90 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">{completedCount}</div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Mastered</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/90 shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-orange-400">{inProgressCount}</div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">In Progress</div>
              </div>
            </div>
          </div>

          {/* Right Column: Matching Image 2 - Circular Dial + Actual Learning Tracks + 3 Bottom Stat Badges */}
          <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-950/80 border border-neutral-800/90 shadow-2xl space-y-4 backdrop-blur-md">
            {/* Top Row: Circular Dial (Left) + Actual Tracks List (Right) */}
            <div className="grid grid-cols-12 gap-3 sm:gap-5 items-center">
              {/* Left: Circular Radial Progress Dial */}
              <div className="col-span-5 flex items-center justify-center">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 140 140">
                    <defs>
                      <linearGradient id="learningHeroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF8A00" />
                        <stop offset="100%" stopColor="#FF4500" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="70"
                      cy="70"
                      r={heroRadius}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={heroRadius}
                      stroke="url(#learningHeroGrad)"
                      strokeWidth="10"
                      strokeDasharray={heroCircumference}
                      strokeDashoffset={heroOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                      {overallProgress}%
                    </span>
                    <div className="flex flex-col items-center mt-1 sm:mt-1.5 leading-none">
                      <span className="text-[7.5px] sm:text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                        OVERALL
                      </span>
                      <span className="text-[7.5px] sm:text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">
                        PROGRESS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Actual Learning Tracks List with Status Dots and Percentages */}
              <div className="col-span-7 space-y-2 pl-0.5">
                {tracks.slice(0, 6).map((track, idx) => {
                  const percent = Number(track.proficiency ?? track.progressPercent ?? track.progress ?? 0);
                  const meta = getStatusMeta(track);
                  const name = track.title || track.name;

                  return (
                    <a
                      key={track.slug || track.id || idx}
                      href={track.slug ? `/learning/${track.slug}` : '#'}
                      className="flex items-center justify-between text-xs py-0.5 group/item transition-colors hover:text-white"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dotColor}`} />
                        <span className="text-neutral-200 group-hover/item:text-orange-400 transition-colors font-medium truncate text-[11px] sm:text-xs">
                          {name}
                        </span>
                      </div>
                      <span className="text-white font-mono font-bold text-[11px] sm:text-xs shrink-0">
                        {percent}%
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom: 3 Stat Cards in a Row (Total Tracks, In Progress, Completed) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-3.5 border-t border-neutral-800/80">
              <div className="p-1.5 sm:p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/90 flex items-center gap-1.5 sm:gap-2 shadow-xs min-w-0">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-none">{totalCourses}</div>
                  <div className="text-[8.5px] sm:text-[10px] text-neutral-400 font-medium leading-tight mt-0.5 truncate">
                    Total Tracks
                  </div>
                </div>
              </div>

              <div className="p-1.5 sm:p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/90 flex items-center gap-1.5 sm:gap-2 shadow-xs min-w-0">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 fill-orange-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-none">{inProgressCount}</div>
                  <div className="text-[8.5px] sm:text-[10px] text-neutral-400 font-medium leading-tight mt-0.5 truncate">
                    In Progress
                  </div>
                </div>
              </div>

              <div className="p-1.5 sm:p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/90 flex items-center gap-1.5 sm:gap-2 shadow-xs min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-none">{completedCount}</div>
                  <div className="text-[8.5px] sm:text-[10px] text-neutral-400 font-medium leading-tight mt-0.5 truncate">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          2. INTERACTIVE DOMAIN FILTER BAR
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">All Learning Tracks</h2>
          <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
            {filteredTracks.length} of {totalCourses}
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === 'all'
                ? tracks.length
                : tracks.filter((t) => (t.category || '').toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{cat === 'all' ? 'All Tracks' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-black/25 text-white' : 'bg-neutral-950 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          3. DYNAMIC LEARNING TRACKS GRID
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredTracks.map((track, idx) => {
          const percent = Number(track.proficiency ?? track.progressPercent ?? track.progress ?? 0);
          const meta = getStatusMeta(track);
          const { Icon, color: iconColor } = getCategoryIcon(track.category, track.name || track.title);
          const displayName = track.name || track.title || 'Engineering Track';
          const hours = track.hoursSpent || 0;

          // Mini ring math (radius 20 in 50x50 viewBox)
          const miniRadius = 20;
          const miniCircumference = 2 * Math.PI * miniRadius;
          const miniOffset = miniCircumference - (percent / 100) * miniCircumference;

          // Real key takeaways from database
          const takeaways =
            Array.isArray(track.keyTakeaways) && track.keyTakeaways.length > 0
              ? track.keyTakeaways.filter(Boolean).slice(0, 2)
              : [];

          return (
            <a
              key={track.slug || track.id || idx}
              href={track.slug ? `/learning/${track.slug}` : '/learning'}
              className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 hover:border-orange-500/40 hover:bg-neutral-900 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-lg"
            >
              {/* Top Row: Icon, Title, Badges & Ring Meter */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-orange-400">
                        {track.category || 'General'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.bgColor} ${meta.borderColor} ${meta.textColor}`}
                      >
                        <meta.icon className="w-2.5 h-2.5" />
                        <span>{meta.label}</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                      {displayName}
                    </h3>
                  </div>
                </div>

                {/* Right: Progress Meter Ring */}
                <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 50 50">
                    <circle
                      cx="25"
                      cy="25"
                      r={miniRadius}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="25"
                      cy="25"
                      r={miniRadius}
                      stroke={meta.color}
                      strokeWidth="4"
                      strokeDasharray={miniCircumference}
                      strokeDashoffset={miniOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Description / Architecture Notes */}
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2">
                {track.description || track.architectureNotes || 'Core technology focus area with practical architectural implementations.'}
              </p>

              {/* Key Takeaways / Highlights from Database */}
              {takeaways.length > 0 && (
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                    Key Insights
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {takeaways.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 line-clamp-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                        <span className="truncate">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer: Hours Invested & Deep Dive Link */}
              <div className="pt-3 border-t border-neutral-800/70 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{hours > 0 ? `${hours} hrs invested` : 'Self-Paced Roadmap'}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-orange-400 font-semibold group-hover:text-orange-300 transition-colors">
                  <span>Explore Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          4. BOTTOM BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-7 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center gap-3.5 sm:gap-4 relative z-10 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Learning never stops!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
              Consistently pushing architectural boundaries, studying distributed paradigms, and growing every single day.
            </p>
          </div>
        </div>

        <div className="shrink-0 relative z-10 w-full sm:w-auto">
          <a
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs sm:text-sm font-semibold transition-all group"
          >
            <span>View Implemented Projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
