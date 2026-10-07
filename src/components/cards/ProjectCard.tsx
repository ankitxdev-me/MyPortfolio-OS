import React from 'react';
import { Card } from './Card';
import { Badge } from '@/components/ui/Badge';
import { getOptimizedImageUrl } from '@/lib/utils/media';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  status?: string;
  progress?: number;
  githubUrl?: string;
  liveUrl?: string;
  className?: string;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  tags = [],
  status = 'In Progress',
  progress,
  githubUrl,
  liveUrl,
  className,
  onClick,
}) => {
  const optimizedImage = getOptimizedImageUrl(image || '/images/projects/autoops.jpg', { width: 600, height: 400 });

  return (
    <Card variant="interactive" padding="none" className={cn('overflow-hidden flex flex-col group', className)} onClick={onClick}>
      <div className="relative w-full h-48 overflow-hidden bg-surface">
        <img
          src={optimizedImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {status && (
          <div className="absolute top-3 right-3">
            <Badge variant={status === 'Completed' ? 'success' : 'primary'} size="sm">
              {status}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {typeof progress === 'number' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>Progress</span>
              <span className="text-primary font-semibold">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-border/50">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-surface border border-border/80 text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary p-1" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
