import React, { useState, useRef } from 'react';
import type { ProjectDTO } from '@/lib/types/api.types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FeaturedProjectProps {
  project?: ProjectDTO | null;
  projects?: ProjectDTO[] | null;
}

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, projects }) => {
  const rawList = Array.isArray(projects) && projects.length > 0 ? projects : project ? [project] : [];
  // STRICT: Only projects marked as featured are displayed on homepage
  const projectsList = rawList.filter((p: any) => p?.featured === true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);

  if (projectsList.length === 0) return null;

  const activeProject = projectsList[currentIndex] || projectsList[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projectsList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projectsList.length - 1 ? 0 : prev + 1));
  };

  // Helper to resolve tech stack array cleanly
  const getTechStack = (p: any): string[] => {
    if (Array.isArray(p.techStack)) return p.techStack;
    if (typeof p.techStack === 'object' && p.techStack !== null) {
      return Object.values(p.techStack).flat().filter(Boolean) as string[];
    }
    if (Array.isArray(p.tags) && p.tags.length > 0) return p.tags;
    return ['TypeScript', 'React', 'Node.js'];
  };

  const getMetrics = (p: any) => {
    if (Array.isArray(p.metrics) && p.metrics.length > 0) return p.metrics;
    return [
      { label: 'Status', value: p.status || 'Active' },
      { label: 'Category', value: p.category || 'Engineering' },
    ];
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, offsetWidth } = scrollContainerRef.current;
    if (offsetWidth > 0) {
      const index = Math.round(scrollLeft / (offsetWidth * 0.85));
      setActiveScrollIndex(Math.min(projectsList.length - 1, Math.max(0, index)));
    }
  };

  // Desktop active project fields
  const title = activeProject.title || 'Portfolio Project';
  const description =
    activeProject.summary ||
    activeProject.description ||
    activeProject.overview ||
    'High-performance full-stack application architected with clean layer decoupling and robust infrastructure.';

  const technologies = getTechStack(activeProject);
  const metrics = getMetrics(activeProject);
  const githubUrl = activeProject.githubUrl || '';
  const projectDetailUrl = `/projects/${activeProject.slug}`;
  const image =
    activeProject.thumbnailUrl ||
    activeProject.image ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';

  return (
    <section id="projects" className="py-12 md:py-20 border-t border-neutral-900 relative">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 pb-5 sm:pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-orange-500 uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
              </span>
              FEATURED PROJECTS
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Engineering <span className="text-orange-500">Showcase</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Carousel Navigation (Hidden on Phone View) */}
            <div className="hidden md:flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-xl">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-orange-500 px-1">
                {currentIndex + 1} / {projectsList.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* View All Projects Button */}
            <a
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white hover:text-orange-400 transition-colors py-1.5 px-2"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>

        {/* ─── Mobile View Only: Horizontal Scroller for Project Posts (< 768px) ─── */}
        <div className="block md:hidden space-y-4">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 scrollbar-none scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {projectsList.map((p, idx) => {
              const allTech = getTechStack(p);
              const pMetrics = getMetrics(p).slice(0, 2);
              const pImg =
                p.thumbnailUrl ||
                p.image ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
              const pDesc = p.summary || p.description || p.overview || '';

              return (
                <div
                  key={p.slug || idx}
                  className="snap-center shrink-0 w-[85vw] max-w-[340px] rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-3.5 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3">
                    {/* Project Image Preview */}
                    <a
                      href={`/projects/${p.slug}`}
                      className="block relative rounded-xl overflow-hidden h-44 w-full bg-neutral-950 border border-neutral-800 group"
                    >
                      <img
                        src={pImg}
                        alt={p.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md border border-orange-500/40 text-orange-400">
                          {p.featured ? 'Featured' : p.category || 'Project'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          View Details <ArrowRight className="w-3 h-3 text-orange-500" />
                        </span>
                      </div>
                    </a>

                    {/* Title & Full Description */}
                    <div className="space-y-1.5">
                      <a href={`/projects/${p.slug}`} className="block group">
                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                          {p.title}
                        </h3>
                      </a>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {pDesc}
                      </p>
                    </div>

                    {/* Tech Stack - Continuous Horizontal Looping Marquee (Moving Right-to-Left) */}
                    {allTech.length > 0 && (() => {
                      const baseTech = allTech.length > 0 ? allTech : ['Tech Stack'];
                      let unitTech = [...baseTech];
                      while (unitTech.length < 6) {
                        unitTech = [...unitTech, ...baseTech];
                      }
                      const loopTech = [...unitTech, ...unitTech];

                      return (
                        <div className="tech-marquee-wrapper relative overflow-hidden w-full py-1">
                          <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
                          <div className="absolute right-0 inset-y-0 w-4 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

                          <div className="tech-marquee-track-rtl flex gap-2 w-max whitespace-nowrap will-change-transform">
                            {loopTech.map((tech, tIdx) => (
                              <span
                                key={`${tech}-${tIdx}`}
                                className="inline-flex shrink-0 items-center px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 shadow-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Bottom: Metrics & Action Buttons */}
                  <div className="space-y-3 pt-3 border-t border-neutral-800/80">
                    {pMetrics.length > 0 && (
                      <div className="flex items-center justify-between text-xs font-mono">
                        {pMetrics.map((m: any, mIdx: number) => (
                          <div key={mIdx} className="flex items-baseline gap-1">
                            <span className="text-white font-bold">{m.value}</span>
                            <span className="text-neutral-500 text-[11px]">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`/projects/${p.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors shadow-md shadow-orange-500/20 active:scale-95"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>

                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors active:scale-95 border border-neutral-750"
                          title="View on GitHub"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Swipe Indicator Dots for Phone View */}
          {projectsList.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {projectsList.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeScrollIndex === i
                      ? 'w-6 bg-orange-500'
                      : 'w-1.5 bg-neutral-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── Desktop View Only: Full Flagship 2-Column Showcase (md: and above, NO TIMELINE) ─── */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clean Full-Height Project Preview Image (Timeline removed) */}
          <div className="md:col-span-6">
            <a
              href={projectDetailUrl}
              className="group block relative rounded-2xl overflow-hidden border border-neutral-800/90 bg-neutral-950 shadow-2xl hover:border-neutral-700 transition-all duration-300 h-80 lg:h-[390px]"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  View Full Case Study <ArrowRight className="w-4 h-4 text-orange-500" />
                </span>
              </div>
            </a>
          </div>

          {/* Right Column: Project Details, Badges, Tech Stack, Buttons & Metrics */}
          <div className="md:col-span-6 space-y-6">
            {/* Title & Featured Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                {title}
              </h3>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-950/70 border border-orange-500/40 text-orange-400 shadow-sm">
                Featured
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              {description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2.5 items-center">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href={projectDetailUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 active:scale-95"
              >
                <span>View Project</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  <span>GitHub</span>
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Dynamic Project Metrics */}
            {metrics.length > 0 && (
              <div className="pt-4 border-t border-neutral-800/80 flex items-center">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-mono">
                  {metrics.map((m: any, idx: number) => (
                    <div key={idx} className="flex items-baseline gap-1.5">
                      <span className="text-white font-bold text-sm sm:text-base">{m.value}</span>
                      <span className="text-neutral-400 text-xs">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
