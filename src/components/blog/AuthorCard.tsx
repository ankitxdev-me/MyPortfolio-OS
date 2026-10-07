import React from 'react';
import { Link as LinkIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuthorCardProps {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ name, role, avatar, bio }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface border border-border shrink-0">
        <img src={avatar || '/avatar.jpg'} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="font-bold text-foreground">{name}</h4>
        <p className="text-xs text-primary font-medium">{role}</p>
        {bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{bio}</p>}
      </div>
    </div>
  );
};

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeId?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items, activeId }) => {
  return (
    <nav className="p-4 rounded-xl bg-card border border-border space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
        <List className="w-4 h-4 text-primary" /> Table of Contents
      </div>
      <ul className="space-y-1.5 text-xs">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block py-1 hover:text-primary transition-colors truncate',
                activeId === item.id ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export interface ShareButtonsProps {
  title: string;
  url?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title }) => {
  const [copied, setCopied] = React.useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-muted-foreground mr-1">Share:</span>
      <button
        type="button"
        onClick={copyUrl}
        className="p-2 rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 text-xs flex items-center gap-1"
        aria-label="Copy Link"
      >
        <LinkIcon className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
