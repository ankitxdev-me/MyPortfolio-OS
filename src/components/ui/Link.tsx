import React from 'react';
import { cn } from '@/lib/utils';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  underline?: boolean;
  variant?: 'primary' | 'muted' | 'subtle';
}

export const Link: React.FC<LinkProps> = ({
  href,
  external = false,
  underline = false,
  variant = 'primary',
  children,
  className,
  ...props
}) => {
  const variants = {
    primary: 'text-primary hover:text-primary-hover font-medium',
    muted: 'text-muted-foreground hover:text-foreground',
    subtle: 'text-foreground hover:text-primary',
  };

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm',
        variants[variant],
        underline && 'hover:underline',
        className
      )}
      {...props}
    >
      {children}
      {external && (
        <svg className="w-3.5 h-3.5 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  );
};
