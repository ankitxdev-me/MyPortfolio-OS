import React, { useState, useMemo } from 'react';
import { ActiveCourseCard } from '@/components/learning/ActiveCourseCard';
import { Search, Sparkles, Filter } from 'lucide-react';

export interface LearningCoursesGridProps {
  initialCourses: any[];
}

export const LearningCoursesGrid: React.FC<LearningCoursesGridProps> = ({ initialCourses = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically extract unique categories present in courses, merged with standards
  const categories = useMemo(() => {
    const defaultCats = ['Web Dev', 'AI / ML', 'Backend', 'DevOps', 'Database', 'Architecture', 'Languages'];
    const dynamicCats = Array.from(new Set(initialCourses.map((c) => c.category).filter(Boolean)));
    const merged = Array.from(new Set(['all', ...defaultCats, ...dynamicCats]));
    return merged;
  }, [initialCourses]);

  const filteredCourses = useMemo(() => {
    const list = initialCourses.filter((course) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catA = (course.category || '').toLowerCase();
        const catB = selectedCategory.toLowerCase();
        if (!catA.includes(catB) && !catB.includes(catA)) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const statA = (course.status || '').toLowerCase();
        const statB = selectedStatus.toLowerCase();
        if (!statA.includes(statB) && !statB.includes(statA)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (course.title || course.name || '').toLowerCase().includes(query);
        const instructorMatch = (course.instructor || '').toLowerCase().includes(query);
        const topicsMatch = (course.topics || []).some((t: string) => t.toLowerCase().includes(query));
        const platformMatch = (course.platform || '').toLowerCase().includes(query);
        if (!titleMatch && !instructorMatch && !topicsMatch && !platformMatch) {
          return false;
        }
      }

      return true;
    });

    // Pinned courses appear first
    return [...list].sort((a, b) => {
      const aPinned = (a.isPinned || a.isTopSkill) ? 1 : 0;
      const bPinned = (b.isPinned || b.isTopSkill) ? 1 : 0;
      return bPinned - aPinned;
    });
  }, [initialCourses, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Header Controls */}
      <div className="space-y-4 bg-card/60 p-4 sm:p-6 rounded-2xl border border-border/80 shadow-sm">
        {/* Top Controls Bar: Search & Status Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, topics, platforms..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-primary" /> Status:
            </span>
            {['all', 'In Progress', 'Mastered', 'Planned', 'Exploring'].map((stat) => (
              <button
                key={stat}
                type="button"
                onClick={() => setSelectedStatus(stat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedStatus === stat
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'bg-surface border border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40'
                }`}
              >
                {stat === 'all' ? 'All Status' : stat}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="pt-3 border-t border-border/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-muted-foreground uppercase font-semibold shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm scale-105'
                  : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
          <span>
            Showing <strong className="text-foreground">{filteredCourses.length}</strong> of{' '}
            <strong className="text-foreground">{initialCourses.length}</strong> learning tracks
          </span>
          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-primary hover:underline text-[11px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Courses */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card/40 rounded-2xl border border-dashed border-border space-y-3">
          <Sparkles className="w-8 h-8 text-primary mx-auto opacity-60" />
          <h3 className="text-base font-bold text-foreground">No Courses Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto font-mono">
            No active coursework matched the selected category or search filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-semibold hover:opacity-90 transition-opacity"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <ActiveCourseCard
              key={course.id || course.slug}
              id={course.id}
              slug={course.slug}
              title={course.title || course.name}
              platform={course.platform || 'Self-Paced'}
              category={course.category || 'Engineering'}
              status={course.status || 'In Progress'}
              progress={course.progressPercent ?? course.proficiency ?? 50}
              isPinned={course.isPinned || course.isTopSkill}
              startDate={course.startDate}
              targetCompletion={course.targetCompletion}
              topics={course.topics || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};
