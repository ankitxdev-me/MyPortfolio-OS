import React from 'react';
import { cn } from '@/lib/utils';

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  active = false,
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all',
        active
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow'
          : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </a>
  );
};

export const NavItem = NavLink;

export interface SidebarItemProps extends NavLinkProps {
  badge?: string | number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  badge,
  children,
  className,
  active,
  icon,
  ...props
}) => {
  return (
    <NavLink
      active={active}
      icon={icon}
      className={cn('w-full justify-between py-2.5 px-3.5', className)}
      {...props}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-between">
        <span className="truncate">{children}</span>
        {badge !== undefined && badge !== null && (
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-mono rounded-full font-semibold shrink-0',
              active ? 'bg-primary text-primary-foreground' : 'bg-surface border border-border text-muted-foreground'
            )}
          >
            {badge}
          </span>
        )}
      </div>
    </NavLink>
  );
};
