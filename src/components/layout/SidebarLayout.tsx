import React from 'react';
import { cn } from '@/lib/utils';

export interface ContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({
  maxWidth = 'lg',
  className,
  children,
  ...props
}) => {
  const maxW = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', maxW[maxWidth], className)} {...props}>
      {children}
    </div>
  );
};

export interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: string;
  className?: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sidebar,
  content,
  sidebarPosition = 'left',
  sidebarWidth = 'w-64',
  className,
}) => {
  return (
    <div className={cn('flex flex-col md:flex-row gap-8 w-full', sidebarPosition === 'right' && 'md:flex-row-reverse', className)}>
      <aside className={cn('shrink-0 w-full md:self-start', sidebarWidth)}>{sidebar}</aside>
      <main className="flex-1 min-w-0">{content}</main>
    </div>
  );
};
