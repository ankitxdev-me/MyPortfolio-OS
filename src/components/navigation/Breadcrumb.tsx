import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1.5 text-xs text-muted-foreground', className)}>
      <a href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </a>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-border shrink-0" />
          {item.href ? (
            <a href={item.href} className="hover:text-foreground transition-colors font-medium">
              {item.label}
            </a>
          ) : (
            <span className="text-foreground font-semibold truncate">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
