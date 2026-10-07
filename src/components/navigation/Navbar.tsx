import React from 'react';
import { cn } from '@/lib/utils';
import { NavLink } from './NavLink';
import { Menu, X } from 'lucide-react';
import { CommandMenu } from '@/components/shell/CommandMenu';
import { ThemeToggle } from '@/components/shell/ThemeToggle';

export interface NavItemConfig {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  items: NavItemConfig[];
  currentPath?: string;
  rightActions?: React.ReactNode;
  className?: string;
  isAuthenticated?: boolean;
  authorName?: string;
  authorAvatar?: string;
  siteSubtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  items,
  currentPath = '/',
  rightActions,
  className,
  isAuthenticated: _isAuthenticated = false,
  authorName = 'Ankit Gupta',
  authorAvatar = '/images/ankit_avatar_head.png',
  siteSubtitle = 'Portfolio OS',
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const defaultRightActions = (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <ThemeToggle />
      <CommandMenu />
    </div>
  );

  const resolvedRightActions = rightActions ?? defaultRightActions;

  return (
    <header className={cn('sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md', className)}>
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 lg:gap-6">
          <a href="/" className="group flex items-center gap-3 select-none">
            {logo || (
              <>
                {/* Circular Avatar with Glowing Orange Ring */}
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 p-[2px] bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 shadow-[0_0_12px_rgba(249,115,22,0.55)] group-hover:shadow-[0_0_18px_rgba(249,115,22,0.85)] transition-all">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#120e0b] flex items-center justify-center">
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Name & Subtitle Branding */}
                <div className="flex flex-col text-left">
                  <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight leading-tight group-hover:text-orange-500 transition-colors">
                    {authorName}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-medium tracking-wide leading-tight mt-0.5">
                    {siteSubtitle}
                  </span>
                </div>
              </>
            )}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5 min-[1080px]:gap-1">
            {items.map((item) => {
              const isJourneyOrAcademics =
                item.label.toLowerCase() === 'journey' ||
                item.label.toLowerCase() === 'academics' ||
                item.label.toLowerCase() === 'academic';

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  active={currentPath === item.href}
                  icon={item.icon}
                  className={cn(
                    'px-2.5 py-1.5 lg:px-3 lg:py-2 text-xs lg:text-sm font-medium',
                    isJourneyOrAcademics && 'hidden min-[1080px]:inline-flex'
                  )}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {resolvedRightActions && (
            <div className="flex items-center gap-1.5 sm:gap-2">{resolvedRightActions}</div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800 transition-colors"
            aria-label="Toggle navigation menu"
            title="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Accessible via 3-line hamburger button) */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-1.5 animate-fade-in shadow-xl">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={currentPath === item.href}
              icon={item.icon}
              className="w-full justify-start py-2.5 px-3 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
