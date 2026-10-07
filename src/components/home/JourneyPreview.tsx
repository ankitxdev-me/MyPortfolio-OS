import React, { useRef, useState, useEffect } from 'react';
import {
  Compass,
  Zap,
  Calendar,
  TrendingUp,
  Target,
  GraduationCap,
  Code2,
  Rocket,
  BarChart3,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export interface MilestoneItem {
  id?: string;
  slug?: string;
  title: string;
  subtitle?: string;
  stage?: string;
  year?: string;
  period?: string;
  date?: string;
  description?: string;
  summary?: string;
  tags?: string[];
  iconName?: string;
  category?: string;
  role?: string;
  organization?: string;
}

interface JourneyPreviewProps {
  milestones?: MilestoneItem[];
}

const ALL_DEFAULT_MILESTONES: MilestoneItem[] = [
  {
    slug: 'foundation-academic-year',
    year: '2023',
    stage: 'Foundation & Core CS',
    title: 'Began Computer Science Journey',
    subtitle: 'Independent — Software Engineer',
    description: 'Began computer science studies, diving deep into algorithms, logic design, and software fundamentals.',
    tags: ['Engineering', 'Architecture'],
    iconName: 'GraduationCap',
    category: 'Career',
  },
  {
    slug: 'entered-computer-science-degree',
    year: '2024',
    stage: 'Academic Growth',
    title: 'Reached 8.9 CGPA Academic Benchmark',
    subtitle: 'Independent — Software Engineer',
    description: 'Achieved 8.9 CGPA, strengthening my foundation in computer science and problem solving.',
    tags: ['Engineering', 'Architecture'],
    iconName: 'GraduationCap',
    category: 'Career',
  },
  {
    slug: 'started-building-autoops-ai',
    year: '2025',
    stage: 'Exploring & Building',
    title: 'Started Building AutoOps AI',
    subtitle: 'Independent — Software Engineer',
    description: 'Began working on AutoOps AI, an intelligent automation system to simplify DevOps workflows.',
    tags: ['Engineering', 'Architecture'],
    iconName: 'Code',
    category: 'Career',
  },
  {
    slug: 'built-first-fullstack-app',
    year: '2026',
    stage: 'Real-world Impact',
    title: 'Launched TeleAdmin Bot v1.0',
    subtitle: 'Independent — Software Engineer',
    description: 'Released TeleAdmin Bot v1.0, a Telegram-based server management tool to make infrastructure control simpler and faster.',
    tags: ['Engineering', 'Architecture'],
    iconName: 'Rocket',
    category: 'Career',
  },
];

export const JourneyPreview: React.FC<JourneyPreviewProps> = ({ milestones = [] }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Default to 2024 (index 1)

  // Merge and sort chronologically
  const allItems = React.useMemo(() => {
    if (!milestones || milestones.length === 0) {
      return ALL_DEFAULT_MILESTONES;
    }

    const sorted = [...milestones].sort((a, b) => {
      const yearA = parseInt(a.year || a.period || '2024', 10);
      const yearB = parseInt(b.year || b.period || '2024', 10);
      return yearA - yearB;
    });

    return sorted.map((item, idx) => {
      const fallback = ALL_DEFAULT_MILESTONES[idx] || ALL_DEFAULT_MILESTONES[0];
      return {
        ...fallback,
        ...item,
        title: item.title || fallback.title,
        year: item.year || item.period || fallback.year,
        stage: item.stage || fallback.stage,
        subtitle: item.subtitle || (item.organization && item.role ? `${item.organization} — ${item.role}` : fallback.subtitle),
        description: item.description || item.summary || fallback.description,
        tags: item.tags && item.tags.length > 0 ? item.tags : fallback.tags,
        iconName: item.iconName || fallback.iconName,
        category: item.category || fallback.category,
      };
    });
  }, [milestones]);

  // Desktop items: the 3 primary milestones (2024, 2025, 2026)
  const desktopItems = React.useMemo(() => {
    const primary = allItems.filter((i) => i.year !== '2023');
    return primary.length >= 3 ? primary.slice(0, 3) : allItems.slice(-3);
  }, [allItems]);

  // Scroll mobile carousel to initial active index (2024)
  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const card = container.children[activeIndex] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'instant' as ScrollBehavior, inline: 'center', block: 'nearest' });
      }
    }
  }, []);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      const container = carouselRef.current;
      const card = container.children[index] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handlePrev = () => {
    const newIdx = Math.max(0, activeIndex - 1);
    scrollToCard(newIdx);
  };

  const handleNext = () => {
    const newIdx = Math.min(allItems.length - 1, activeIndex + 1);
    scrollToCard(newIdx);
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const cardCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(scrollCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  const renderIcon = (item: MilestoneItem) => {
    const icon = (item.iconName || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const slug = (item.slug || '').toLowerCase();

    if (icon.includes('grad') || title.includes('cgpa') || slug.includes('degree') || item.year === '2023' || item.year === '2024') {
      return <GraduationCap className="w-5 h-5 text-orange-400" />;
    }
    if (icon.includes('rocket') || title.includes('teleadmin') || slug.includes('teleadmin') || slug.includes('fullstack') || item.year === '2026') {
      return <Rocket className="w-5 h-5 text-orange-400" />;
    }
    return <Code2 className="w-5 h-5 text-orange-400" />;
  };

  return (
    <section className="relative py-16 sm:py-20 bg-neutral-950/95 text-white overflow-hidden border-t border-neutral-900">
      {/* Subtle Dot Matrix Textures in Corners */}
      <div
        className="absolute top-0 right-0 w-72 sm:w-80 h-72 sm:h-80 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(circle at top right, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at top right, black, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 sm:w-80 h-72 sm:h-80 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(circle at bottom left, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at bottom left, black, transparent 70%)',
        }}
      />

      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-10 sm:space-y-12">
        {/* Top Header Block with Title & Right-side Stat Card */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          {/* Left Title Area */}
          <div className="space-y-2.5 sm:space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Compass className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
                Career Evolution
              </span>
              <span className="w-10 sm:w-12 h-[1px] bg-neutral-800" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Engineering <span className="text-orange-500">Journey</span>
            </h2>

            <p className="text-xs sm:text-base text-neutral-400 font-normal leading-relaxed">
              A timeline of growth, learning, and impact — turning ideas into real solutions.
            </p>
          </div>

          {/* Right Metrics Stat Card (Compact 4-column row on mobile, matching image) */}
          <div className="bg-[#121118]/85 border border-neutral-800/80 rounded-2xl p-3 sm:p-5 backdrop-blur-md shadow-2xl grid grid-cols-4 gap-1.5 sm:gap-6 lg:gap-8 items-center">
            {/* Stat 1 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-400/30" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl font-bold text-white leading-tight">3</span>
                <span className="text-[9px] sm:text-[11px] font-medium text-neutral-300 leading-tight">Key</span>
                <span className="text-[8px] sm:text-[10px] text-neutral-400 leading-tight truncate">Milestones</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl font-bold text-white leading-tight">2+</span>
                <span className="text-[9px] sm:text-[11px] font-medium text-neutral-300 leading-tight">Years</span>
                <span className="text-[8px] sm:text-[10px] text-neutral-400 leading-tight truncate">Journey</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-lg font-bold text-white leading-tight truncate">Continuous</span>
                <span className="text-[8px] sm:text-[10px] text-neutral-400 leading-tight mt-0.5 truncate">Learning</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-lg font-bold text-white leading-tight truncate">Bigger</span>
                <span className="text-[8px] sm:text-[10px] text-neutral-400 leading-tight mt-0.5 truncate">Goals Ahead</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Ribbon / Glowing Wavy Wire with 3 Nodes */}
        <div className="relative pt-4 sm:pt-6 pb-2">
          {/* Connecting SVG Curved Line */}
          <div className="absolute top-[22px] sm:top-[24px] left-0 w-full h-10 pointer-events-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 40"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="journeyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                  <stop offset="16%" stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="84%" stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
                </linearGradient>
                <filter id="orangeShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Subtle ambient blur path */}
              <path
                d="M 30,16 C 90,12 135,10 166.6,10 C 220,10 280,24 333.3,24 C 386,24 446,10 500,10 C 554,10 614,24 666.6,24 C 720,24 780,10 833.3,10 C 880,10 930,16 975,18"
                stroke="#f97316"
                strokeWidth="3"
                strokeOpacity="0.3"
                filter="url(#orangeShadow)"
              />
              {/* Crisp main line */}
              <path
                d="M 30,16 C 90,12 135,10 166.6,10 C 220,10 280,24 333.3,24 C 386,24 446,10 500,10 C 554,10 614,24 666.6,24 C 720,24 780,10 833.3,10 C 880,10 930,16 975,18"
                stroke="url(#journeyGlow)"
                strokeWidth="1.5"
                strokeDasharray="none"
              />
            </svg>
          </div>

          {/* 3 Milestone Node Markers */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 relative">
            {desktopItems.map((item, index) => (
              <div key={item.slug || index} className="flex flex-col items-center text-center relative group">
                {/* Glowing Circular Node */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-neutral-950 border-2 border-orange-500 flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.9)] group-hover:scale-115 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_#f97316]" />
                  </div>
                </div>

                {/* Year and Stage Label */}
                <div className="mt-2.5 sm:mt-3 space-y-0.5 px-1">
                  <span className="block text-sm sm:text-base font-bold text-white tracking-wide">
                    {item.year}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-medium text-neutral-400 leading-tight">
                    {item.stage}
                  </span>
                </div>
              </div>
            ))}

            {/* Subtle Right Arrow indicator at end of line */}
            <div className="hidden sm:flex absolute right-1 top-[22px] items-center text-orange-500/80">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ----------------- DESKTOP VIEW (3-Card Grid) ----------------- */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
          {desktopItems.map((item, index) => (
            <div
              key={item.slug || index}
              className="bg-[#0e0d13]/90 border border-neutral-800/80 hover:border-orange-500/40 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Top Row: Icon, Category Pill, Date */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                      {renderIcon(item)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-400">
                      {item.category || 'Career'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{item.year}</span>
                  </div>
                </div>

                {/* Milestone Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mt-5 tracking-tight leading-snug group-hover:text-orange-100 transition-colors">
                  {item.title}
                </h3>

                {/* Subtitle / Role (Orange Accent) */}
                <p className="text-xs sm:text-sm font-medium text-orange-500 mt-1.5">
                  {item.subtitle || 'Independent — Software Engineer'}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed mt-3">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-5 mt-6 border-t border-neutral-800/50">
                  {(item.tags || ['Engineering', 'Architecture']).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-800/60 border border-neutral-700/50 text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read More Link */}
                <a
                  href="/journey"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-400 mt-4 transition-colors group/link"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ----------------- MOBILE VIEW (Horizontal Snap Carousel) ----------------- */}
        <div className="block md:hidden space-y-4">
          {/* Scrollable Container with Peeking Adjacent Cards */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-8 -mx-4 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ scrollPaddingLeft: '32px', scrollPaddingRight: '32px' }}
          >
            {allItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.slug || index}
                  onClick={() => scrollToCard(index)}
                  className={`w-[78vw] max-w-[310px] shrink-0 snap-center rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#0f0e15] border-2 border-orange-500/70 shadow-[0_0_24px_rgba(249,115,22,0.18)] scale-100 opacity-100'
                      : 'bg-[#0e0d13]/80 border border-neutral-800/80 scale-[0.96] opacity-60'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon, Category Pill, Date */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                          {renderIcon(item)}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-orange-500/10 border border-orange-500/20 text-orange-400">
                          {item.category || 'Career'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>{item.year}</span>
                      </div>
                    </div>

                    {/* Milestone Title */}
                    <h3 className="text-base font-bold text-white mt-4 tracking-tight leading-snug">
                      {item.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs font-medium text-orange-500 mt-1">
                      {item.subtitle || 'Independent — Software Engineer'}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-neutral-400 leading-relaxed mt-2.5 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-neutral-800/50">
                      {(item.tags || ['Engineering', 'Architecture']).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-800/70 border border-neutral-700/50 text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More Link */}
                    <a
                      href="/journey"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-400 mt-3 pt-1"
                    >
                      <span className="underline underline-offset-4 decoration-orange-500/40">Read More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Controls: Dot Indicators in Center, Navigation Buttons on Right */}
          <div className="flex items-center justify-between pt-1 px-1">
            {/* Dot indicators in the center */}
            <div className="flex items-center gap-1.5 mx-auto">
              {allItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  className={`transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-6 h-1.5 bg-orange-500 rounded-full'
                      : 'w-1.5 h-1.5 bg-neutral-700 rounded-full hover:bg-neutral-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Circular Prev/Next Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous milestone"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={activeIndex === allItems.length - 1}
                className="w-9 h-9 rounded-full border border-orange-500/60 bg-orange-500/10 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                aria-label="Next milestone"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Banner Card (with circular arrow button on mobile as in screenshot) */}
        <div className="bg-[#0e0d13]/90 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 backdrop-blur-md shadow-xl mt-6">
          {/* Left info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">More chapters ahead...</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-tight mt-0.5">
                Building, learning, and creating impact — one step at a time.
              </p>
            </div>
          </div>

          {/* Right Action Button: Circular on mobile (matching image), full pill on desktop */}
          <a
            href="/journey"
            className="shrink-0 w-10 h-10 sm:w-auto sm:h-auto sm:px-6 sm:py-2.5 rounded-full border border-orange-500/60 bg-orange-500/10 sm:bg-transparent text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 group shadow-[0_0_14px_rgba(249,115,22,0.25)] sm:shadow-none"
            aria-label="View Full Timeline"
          >
            <span className="hidden sm:inline">View Full Timeline</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
