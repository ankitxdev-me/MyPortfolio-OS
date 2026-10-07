import React, { useEffect, useState } from 'react';
import { SidebarItem } from '@/components/navigation/NavLink';
import { apiClient } from '@/lib/api';
import {
  LayoutDashboard,
  Folder,
  BookOpen,
  GraduationCap,
  Briefcase,
  Settings,
  User,
  HelpCircle,
  LogOut,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardSidebarProps {
  currentPath?: string;
  className?: string;
  /** Logout handler — supplied by DashboardAuthShell via AuthContext */
  onLogout?: () => Promise<void>;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentPath = '/dashboard',
  className,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    async function loadSidebarCounts() {
      try {
        const [
          projectsRes,
          blogsRes,
          learningRes,
          journeyRes,
          academicsRes,
          freelancingRes,
          contactRes,
        ] = await Promise.all([
          apiClient.projects.getAll({ limit: 1 }).catch(() => null),
          apiClient.blogs.getAll({ limit: 1 }).catch(() => null),
          apiClient.learning.getAll({ limit: 1 }).catch(() => null),
          apiClient.journey.getAll({ limit: 1 }).catch(() => null),
          apiClient.academics.getAll({ limit: 1 }).catch(() => null),
          apiClient.freelancing.getAll({ limit: 1 }).catch(() => null),
          apiClient.contact.getMessages({ limit: 1 }).catch(() => null),
        ]);

        const extractTotal = (res: any) => {
          if (!res) return undefined;
          if (typeof res?.meta?.totalItems === 'number') return res.meta.totalItems;
          if (typeof res?.pagination?.totalItems === 'number') return res.pagination.totalItems;
          if (typeof res?.meta?.total === 'number') return res.meta.total;
          if (Array.isArray(res?.data)) return res.data.length;
          if (Array.isArray(res)) return res.length;
          return undefined;
        };

        const unreadSupportCount =
          typeof (contactRes?.meta as any)?.unreadCount === 'number'
            ? (contactRes?.meta as any).unreadCount
            : 0;

        setCounts({
          '/dashboard/projects': extractTotal(projectsRes) ?? 0,
          '/dashboard/blogs': extractTotal(blogsRes) ?? 0,
          '/dashboard/learning': extractTotal(learningRes) ?? 0,
          '/dashboard/journey': extractTotal(journeyRes) ?? 0,
          '/dashboard/academics': extractTotal(academicsRes) ?? 0,
          '/dashboard/freelancing': extractTotal(freelancingRes) ?? 0,
          '/dashboard/support': unreadSupportCount,
        });
      } catch {
        // Fallback
      }
    }

    loadSidebarCounts();

    const handleCountUpdate = (e: any) => {
      const newUnread = e?.detail?.unread ?? 0;
      setCounts((prev) => ({ ...prev, '/dashboard/support': newUnread }));
    };

    window.addEventListener('support-count-updated', handleCountUpdate);
    return () => window.removeEventListener('support-count-updated', handleCountUpdate);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Projects', href: '/dashboard/projects', icon: <Folder className="w-4 h-4" />, badge: counts['/dashboard/projects'] },
    { label: 'Blogs', href: '/dashboard/blogs', icon: <BookOpen className="w-4 h-4" />, badge: counts['/dashboard/blogs'] },
    { label: 'Learning', href: '/dashboard/learning', icon: <GraduationCap className="w-4 h-4" />, badge: counts['/dashboard/learning'] },
    { label: 'Journey', href: '/dashboard/journey', icon: <MapPin className="w-4 h-4" />, badge: counts['/dashboard/journey'] },
    { label: 'Academics', href: '/dashboard/academics', icon: <Award className="w-4 h-4" />, badge: counts['/dashboard/academics'] },
    { label: 'Freelancing', href: '/dashboard/freelancing', icon: <Briefcase className="w-4 h-4" />, badge: counts['/dashboard/freelancing'] },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <User className="w-4 h-4" /> },
    {
      label: 'Support',
      href: '/dashboard/support',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: counts['/dashboard/support'] > 0 ? counts['/dashboard/support'] : undefined,
    },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'same-origin' });
        document.cookie =
          'portfolio_os_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        window.location.href = '/login';
      }
    } catch {
      document.cookie =
        'portfolio_os_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      window.location.href = '/login';
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        'border-r border-border bg-background p-4 flex flex-col justify-between h-full min-h-screen transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-2">
          {!collapsed && (
            <a href="/dashboard" className="flex items-center gap-2 font-bold text-base text-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>
                Portfolio OS <span className="text-xs text-primary font-mono font-normal">CMS</span>
              </span>
            </a>
          )}
          {collapsed && (
            <a
              href="/dashboard"
              className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs"
            >
              OS
            </a>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface hidden lg:block"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              active={currentPath === item.href}
              badge={!collapsed ? item.badge : undefined}
            >
              {!collapsed && item.label}
            </SidebarItem>
          ))}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-border">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full text-left disabled:opacity-60 disabled:cursor-not-allowed',
            collapsed && 'justify-center px-0'
          )}
          title="Sign Out of CMS"
        >
          {loggingOut ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 shrink-0" />
          )}
          {!collapsed && <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>}
        </button>
      </div>
    </aside>
  );
};
