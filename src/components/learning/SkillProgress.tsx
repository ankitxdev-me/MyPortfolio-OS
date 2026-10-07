import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface SkillProgressProps {
  skill: string;
  percentage: number;
  category?: string;
  slug?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SkillProgress: React.FC<SkillProgressProps> = ({
  skill,
  percentage,
  category,
  slug,
  icon,
  className,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (slug) {
      window.location.href = `/learning/${slug}`;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 rounded-xl bg-card border border-border/80 space-y-2.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{skill}</span>
        </div>
        <span className="text-xs font-mono font-bold text-primary">{percentage}%</span>
      </div>

      <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/50">
        <div
          className="h-full bg-primary transition-all duration-500 rounded-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-orange-400"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {category && (
        <div className="pt-1 flex justify-end">
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">{category}</Badge>
        </div>
      )}
    </div>
  );
};

export interface TechnologyBadgeProps {
  name: string;
  icon?: React.ReactNode;
  level?: string;
}

export const TechnologyBadge: React.FC<TechnologyBadgeProps> = ({ name, icon, level }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-foreground hover:border-primary/40 transition-colors">
      {icon && <span className="text-primary shrink-0">{icon}</span>}
      <span>{name}</span>
      {level && <span className="text-[10px] font-mono text-muted-foreground ml-1">({level})</span>}
    </div>
  );
};
