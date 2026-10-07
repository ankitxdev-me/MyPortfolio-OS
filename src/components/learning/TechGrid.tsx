import React from 'react';
import type { TechnologyDetail } from '@/data/learningData';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Clock, FolderGit2 } from 'lucide-react';

export interface TechGridProps {
  technologies: TechnologyDetail[];
}

export const TechGrid: React.FC<TechGridProps> = ({ technologies }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const categories = ['all', 'AI / ML', 'Web Dev', 'Backend', 'DevOps', 'Database'];

  const filteredTechs =
    selectedCategory === 'all'
      ? technologies
      : technologies.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
            }`}
          >
            {cat === 'all' ? 'All Stack' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Technology Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechs.map((tech) => (
          <Card
            key={tech.slug}
            variant="glass"
            padding="md"
            className="group cursor-pointer flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all duration-300"
            onClick={() => (window.location.href = `/learning/${tech.slug}`)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="primary" size="sm">{tech.category}</Badge>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                  {tech.level}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{tech.name}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{tech.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-muted-foreground">Proficiency</span>
                  <span className="text-primary font-bold">{tech.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${tech.progress}%` }} />
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" /> {tech.hoursInvested}h
              </span>
              <span className="flex items-center gap-1">
                <FolderGit2 className="w-3 h-3 text-primary" /> {tech.projectsCount} Projects
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
