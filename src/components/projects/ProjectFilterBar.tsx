import React from 'react';
import { SearchInput } from '@/components/forms/SearchInput';
import { Select } from '@/components/forms/Select';
import { Button } from '@/components/ui/Button';
import { Filter, RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  category: string;
  technology: string;
  status: string;
}

export interface ProjectFilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  categories?: string[];
  technologies?: string[];
}

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  onFilterChange,
  categories = ['AI / Automation', 'Web Development', 'Web3', 'DevOps'],
  technologies = ['Next.js', 'TypeScript', 'Astro', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
}) => {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [technology, setTechnology] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const updateFilters = (newSearch: string, newCat: string, newTech: string, newStat: string) => {
    onFilterChange({
      search: newSearch,
      category: newCat,
      technology: newTech,
      status: newStat,
    });
  };

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setTechnology('all');
    setStatus('all');
    updateFilters('', 'all', 'all', 'all');
  };

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  const techOptions = [
    { label: 'All Technologies', value: 'all' },
    ...technologies.map((t) => ({ label: t, value: t })),
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Completed', value: 'Completed' },
    { label: 'In Progress', value: 'In Progress' },
  ];

  return (
    <div className="p-4 md:p-6 rounded-2xl glass-card border border-border space-y-4 shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
          <Filter className="w-4 h-4 text-primary" /> Filter Case Studies
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <SearchInput
          placeholder="Search projects by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateFilters(e.target.value, category, technology, status);
          }}
          onClear={() => {
            setSearch('');
            updateFilters('', category, technology, status);
          }}
        />

        {/* Category Select */}
        <Select
          options={categoryOptions}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            updateFilters(search, e.target.value, technology, status);
          }}
        />

        {/* Tech Stack Select */}
        <Select
          options={techOptions}
          value={technology}
          onChange={(e) => {
            setTechnology(e.target.value);
            updateFilters(search, category, e.target.value, status);
          }}
        />

        {/* Status Select */}
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updateFilters(search, category, technology, e.target.value);
          }}
        />
      </div>
    </div>
  );
};
