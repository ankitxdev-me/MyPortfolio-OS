import React, { useState } from 'react';
import {
  Home,
  FolderGit2,
  FileText,
  MoreHorizontal,
  X,
  GraduationCap,
  Milestone,
  Briefcase,
  Mail,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentPath?: string;
  isAuthenticated?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath = '/',
  isAuthenticated = false,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const mainTabs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    { label: 'Blog', href: '/blog', icon: FileText },
  ];

  const moreItems = [
    { label: 'Learning', href: '/learning', icon: BookOpen, desc: 'Skills & Courses' },
    { label: 'Journey', href: '/journey', icon: Milestone, desc: 'Milestones & Growth' },
    { label: 'Academics', href: '/academics', icon: GraduationCap, desc: 'Grades & Curriculum' },
    { label: 'Freelancing', href: '/freelancing', icon: Briefcase, desc: 'Services & Work' },
    { label: 'Contact', href: '/contact', icon: Mail, desc: 'Get In Touch' },
  ];

  const isTabActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  const isMoreActive = moreItems.some((item) => currentPath.startsWith(item.href));

  return (
    <>
      {/* "More" Bottom Sheet Overlay */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-16 left-3 right-3 rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-2xl space-y-3 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                Explore More
              </span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = currentPath.startsWith(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors ${
                      active
                        ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                        : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-300 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-orange-500" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{item.label}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{item.desc}</div>
                    </div>
                  </a>
                );
              })}
            </div>

            {isAuthenticated && (
              <a
                href="/dashboard"
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-4 py-2 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.5)]"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isTabActive(tab.href);
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-orange-500 scale-105'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className={`text-[10px] font-medium ${active ? 'font-bold text-orange-500' : ''}`}>
                {tab.label}
              </span>
            </a>
          );
        })}

        {/* More Tab */}
        <button
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            moreOpen || isMoreActive
              ? 'text-orange-500 scale-105'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="More navigation links"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className={`text-[10px] font-medium ${moreOpen || isMoreActive ? 'font-bold text-orange-500' : ''}`}>
            More
          </span>
        </button>
      </nav>
    </>
  );
};
