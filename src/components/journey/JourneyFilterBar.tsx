import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface JourneyFilterBarProps {
  selectedCategory: string;
  selectedYear: string;
  onCategoryChange: (cat: string) => void;
  onYearChange: (yr: string) => void;
  onReset: () => void;
}

export const JourneyFilterBar: React.FC<JourneyFilterBarProps> = ({
  selectedCategory,
  selectedYear,
  onCategoryChange,
  onYearChange,
  onReset,
}) => {
  const categories = ['all', 'Projects', 'Learning', 'Academics', 'Career', 'Achievements'];
  const years = ['all', '2026', '2025', '2024'];

  return (
    <div className="p-4 md:p-6 rounded-2xl glass-card border border-border space-y-4 shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
          <Filter className="w-4 h-4 text-primary" /> Filter Engineering Timeline
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Year Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground mr-2">Year:</span>
          {years.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => onYearChange(yr)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                selectedYear === yr
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {yr === 'all' ? 'All Years' : yr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
