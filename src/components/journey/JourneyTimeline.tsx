import React, { useState, useMemo } from 'react';
import {
  Filter,
  RotateCcw,
  Calendar,
  GraduationCap,
  Code2,
  Rocket,
  BookOpen,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  Compass,
} from 'lucide-react';

export interface MilestoneItem {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  stage?: string;
  year: string;
  period?: string;
  date?: string;
  description?: string;
  summary?: string;
  tags?: string[];
  iconName?: string;
  category: string;
  role?: string;
  organization?: string;
}

interface JourneyTimelineProps {
  initialMilestones?: MilestoneItem[];
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  {
    slug: 'entered-computer-science-degree',
    year: '2026',
    period: '2026',
    title: 'Reached 8.9 CGPA Academic Benchmark',
    subtitle: 'Independent — Engineer',
    category: 'Career',
    iconName: 'GraduationCap',
    description: 'Achieved 8.9 CGPA, strengthening my foundation in computer science and problem solving.',
    tags: ['Engineering', 'Architecture'],
  },
  {
    slug: 'started-building-autoops-ai',
    year: '2026',
    period: '2026',
    title: 'Started Building AutoOps AI',
    subtitle: 'Independent — Engineer',
    category: 'Career',
    iconName: 'Code',
    description: 'Began working on AutoOps AI, an intelligent automation system to simplify DevOps workflows.',
    tags: ['Engineering', 'Architecture'],
  },
  {
    slug: 'built-first-fullstack-app',
    year: '2026',
    period: '2026',
    title: 'Launched TeleAdmin Bot v1.0',
    subtitle: 'Independent — Engineer',
    category: 'Career',
    iconName: 'Rocket',
    description: 'Released TeleAdmin Bot v1.0, a Telegram-based server management tool to make infrastructure control simpler and faster.',
    tags: ['Engineering', 'Architecture'],
  },
  {
    slug: 'exploring-open-source',
    year: '2025',
    period: '2025',
    title: 'Exploring Open Source',
    subtitle: 'Independent — Learner',
    category: 'Learning',
    iconName: 'BookOpen',
    description: 'Started contributing to open source projects and exploring real-world codebases.',
    tags: ['Engineering', 'Open Source'],
  },
  {
    slug: 'foundation-academic-year',
    year: '2024',
    period: '2024',
    title: 'Began Computer Science Journey',
    subtitle: 'Independent — Student',
    category: 'Academics',
    iconName: 'GraduationCap',
    description: 'Began computer science studies, diving deep into algorithms, logic design, and software fundamentals.',
    tags: ['Engineering', 'Architecture'],
  },
];

const CATEGORIES = ['All Categories', 'Projects', 'Learning', 'Academics', 'Career', 'Achievements'];
const YEARS = ['All Years', '2026', '2025', '2024'];

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ initialMilestones = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [visibleCount, setVisibleCount] = useState(4);

  // Combine and sort milestones
  const allMilestones = useMemo(() => {
    const source = initialMilestones && initialMilestones.length > 0 ? initialMilestones : DEFAULT_MILESTONES;
    
    const orderMap: Record<string, number> = {
      'entered-computer-science-degree': 1,
      'started-building-autoops-ai': 2,
      'built-first-fullstack-app': 3,
      'exploring-open-source': 4,
      'foundation-academic-year': 5,
    };

    return [...source].sort((a, b) => {
      const orderA = orderMap[a.slug] || 99;
      const orderB = orderMap[b.slug] || 99;
      if (orderA !== orderB) return orderA - orderB;
      const yearA = parseInt(a.year || a.period || '2026', 10);
      const yearB = parseInt(b.year || b.period || '2026', 10);
      return yearB - yearA;
    });
  }, [initialMilestones]);

  // Apply filters
  const filteredMilestones = useMemo(() => {
    return allMilestones.filter((m) => {
      const matchCat =
        selectedCategory === 'All Categories' ||
        m.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchYr =
        selectedYear === 'All Years' ||
        (m.year || m.period) === selectedYear;
      return matchCat && matchYr;
    });
  }, [allMilestones, selectedCategory, selectedYear]);

  const displayedMilestones = filteredMilestones.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMilestones.length;

  const handleReset = () => {
    setSelectedCategory('All Categories');
    setSelectedYear('All Years');
    setVisibleCount(4);
  };

  const renderIcon = (item: MilestoneItem) => {
    const icon = (item.iconName || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const slug = (item.slug || '').toLowerCase();

    if (icon.includes('book') || title.includes('open source')) {
      return <BookOpen className="w-5 h-5 text-orange-400" />;
    }
    if (icon.includes('grad') || title.includes('cgpa') || slug.includes('degree')) {
      return <GraduationCap className="w-5 h-5 text-orange-400" />;
    }
    if (icon.includes('rocket') || title.includes('teleadmin') || slug.includes('teleadmin')) {
      return <Rocket className="w-5 h-5 text-orange-400" />;
    }
    return <Code2 className="w-5 h-5 text-orange-400" />;
  };

  const renderBadge = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'learning') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-400">
          Learning
        </span>
      );
    }
    if (cat === 'academics') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
          Academics
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-400">
        Career
      </span>
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* ----------------- 1. HERO SECTION (Desktop & Mobile) ----------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 border-b border-neutral-900 pb-8 sm:pb-12">
        {/* Left Header Text */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
              Timeline
            </span>
            <span className="w-12 h-[1px] bg-neutral-800" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Milestones & <br />
            <span className="text-orange-500">History</span>
          </h1>

          <p className="text-xs sm:text-base text-neutral-400 font-normal leading-relaxed max-w-lg">
            A timeline of my growth, learning, and impact — built one step at a time.
          </p>
        </div>

        {/* Right Mountain Trail Illustration */}
        <div className="relative w-full md:w-[420px] lg:w-[460px] h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-neutral-800/80 group">
          <img
            src="/images/journey_hero_mountain.jpg"
            alt="Mountain path to summit with Same Learner Bigger Dreams"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle dark gradient overlay to blend into the black theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-transparent pointer-events-none md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ----------------- 2. FILTER BOX (Desktop Pills, Mobile Dropdowns) ----------------- */}
      <div className="bg-[#121118]/85 border border-neutral-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl space-y-4 sm:space-y-5">
        {/* Filter Header */}
        <div className="flex items-center justify-between gap-2 border-b border-neutral-800/60 pb-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white tracking-wide">
            <Filter className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Filter Engineering Timeline</span>
            <span className="sm:hidden">Filter Timeline</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-orange-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* DESKTOP FILTER VIEW (Pill Buttons) */}
        <div className="hidden sm:block space-y-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 mr-2 min-w-[64px]">Category:</span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                      : 'bg-[#13121a] border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Year Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 mr-2 min-w-[64px]">Year:</span>
            {YEARS.map((yr) => {
              const isActive = selectedYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                      : 'bg-[#13121a] border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE FILTER VIEW (Dropdown Selects, exactly as in phone mockup) */}
        <div className="sm:hidden space-y-3">
          {/* Category Dropdown */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-neutral-400">Category</span>
            <div className="relative flex-1 max-w-[200px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-orange-500/80 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Year Dropdown */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-neutral-400">Year</span>
            <div className="relative flex-1 max-w-[200px]">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full appearance-none bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-orange-500/80 transition-colors"
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- 3. VERTICAL TIMELINE WITH GLOWING NODES & CARDS ----------------- */}
      <div className="relative pl-6 sm:pl-8">
        {/* Continuous Vertical Orange Timeline Track */}
        <div className="absolute left-[9px] sm:left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-orange-500/80 via-orange-500/60 to-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />

        {/* Milestone Cards Stack */}
        <div className="space-y-6 sm:space-y-8">
          {displayedMilestones.map((item) => (
            <div key={item.slug} className="relative group/card">
              {/* Glowing Timeline Node Bullet aligned with top of each card */}
              <div className="absolute -left-[24px] sm:-left-[31px] top-6 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-neutral-950 border-2 border-orange-500 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.9)] group-hover/card:scale-115 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_#f97316]" />
                </div>
              </div>

              {/* Milestone Card */}
              <div
                onClick={() => (window.location.href = `/journey/${item.slug}`)}
                className="bg-[#0e0d13]/90 border border-neutral-800/80 hover:border-orange-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden shadow-xl cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Main Content */}
                  <div className="space-y-3 flex-1 min-w-0">
                    {/* Top Row: Icon, Category Badge, Date */}
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                          {renderIcon(item)}
                        </div>
                        {renderBadge(item.category)}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono sm:ml-auto">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{item.year || item.period}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover/card:text-orange-100 transition-colors">
                      {item.title}
                    </h3>

                    {/* Subtitle / Role (Orange font) */}
                    <p className="text-xs sm:text-sm font-medium text-orange-500">
                      {item.subtitle || 'Independent — Engineer'}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-3xl">
                      {item.description || item.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(item.tags || ['Engineering', 'Architecture']).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-800/60 border border-neutral-700/50 text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Circular Action Button */}
                  <div className="sm:pl-4 flex sm:flex-col items-end justify-end">
                    <button
                      type="button"
                      aria-label={`View ${item.title}`}
                      className="w-10 h-10 rounded-full border border-neutral-800/80 bg-neutral-900/60 flex items-center justify-center text-orange-400 group-hover/card:border-orange-500/60 group-hover/card:bg-orange-500/10 transition-all shrink-0 shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/card:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {displayedMilestones.length === 0 && (
            <div className="text-center py-12 text-neutral-400 bg-neutral-900/30 rounded-2xl border border-neutral-800 p-6">
              <p className="text-sm">No milestones found matching the selected filters.</p>
              <button
                onClick={handleReset}
                className="mt-3 text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ----------------- 4. BOTTOM LOAD MORE BUTTON (Mobile & Desktop) ----------------- */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-orange-500/60 text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(249,115,22,0.2)] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Load More Milestones</span>
          </button>
        </div>
      )}
    </div>
  );
};
