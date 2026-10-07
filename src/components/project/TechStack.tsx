import React from 'react';
import { Card } from '@/components/cards/Card';
import { Github, CheckCircle2 } from 'lucide-react';

export interface TechStackProps {
  technologies: string[];
  title?: string;
}

export const TechStack: React.FC<TechStackProps> = ({ technologies, title = 'Technologies & Tools' }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span key={tech} className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-surface border border-border text-foreground hover:border-primary/40 transition-colors">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export interface RepositoryCardProps {
  repoName: string;
  stars?: number;
  forks?: number;
  language?: string;
  url: string;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repoName, stars, forks, language, url }) => {
  return (
    <Card variant="interactive" padding="md" className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Github className="w-5 h-5 text-primary" />
        <div>
          <h4 className="font-bold text-foreground text-sm">{repoName}</h4>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mt-0.5">
            {language && <span>{language}</span>}
            {typeof stars === 'number' && <span>★ {stars}</span>}
            {typeof forks === 'number' && <span>⑂ {forks}</span>}
          </div>
        </div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-border text-xs text-primary hover:bg-surface-hover">
        View Code
      </a>
    </Card>
  );
};

export interface FeatureListProps {
  features: string[];
  title?: string;
}

export const FeatureList: React.FC<FeatureListProps> = ({ features, title = 'Key Capabilities' }) => {
  return (
    <div className="space-y-3">
      {title && <h4 className="font-bold text-foreground text-base">{title}</h4>}
      <ul className="space-y-2 text-sm text-muted-foreground">
        {features.map((feat, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
