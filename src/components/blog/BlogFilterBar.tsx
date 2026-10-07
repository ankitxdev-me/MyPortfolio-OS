import React from 'react';
import { SearchInput } from '@/components/forms/SearchInput';
import { Select } from '@/components/forms/Select';
import { Button } from '@/components/ui/Button';
import { Filter, RotateCcw } from 'lucide-react';

export interface BlogFilterState {
  search: string;
  category: string;
}

export interface BlogFilterBarProps {
  onFilterChange: (filters: BlogFilterState) => void;
  categories?: string[];
}

export const BlogFilterBar: React.FC<BlogFilterBarProps> = ({
  onFilterChange,
  categories = ['Engineering', 'Backend', 'Web Dev', 'AI / ML', 'DevOps'],
}) => {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');

  const updateFilters = (newSearch: string, newCat: string) => {
    onFilterChange({ search: newSearch, category: newCat });
  };

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    updateFilters('', 'all');
  };

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div className="p-4 md:p-6 rounded-2xl glass-card border border-border space-y-4 shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
          <Filter className="w-4 h-4 text-primary" /> Filter Articles
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SearchInput
          placeholder="Search articles by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateFilters(e.target.value, category);
          }}
          onClear={() => {
            setSearch('');
            updateFilters('', category);
          }}
        />

        <Select
          options={categoryOptions}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            updateFilters(search, e.target.value);
          }}
        />
      </div>
    </div>
  );
};
