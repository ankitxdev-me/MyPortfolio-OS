import React, { useState, useEffect, useCallback } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { NotificationPanel, type DashboardNotificationItem } from '@/components/dashboard/NotificationPanel';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { apiClient } from '@/lib/api';
import { Bell, Search, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardHeaderProps {
  title?: string;
  userName?: string;
  userAvatar?: string;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Overview',
  userName = 'Ankit Gupta',
  userAvatar,
  className,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [notifications, setNotifications] = useState<DashboardNotificationItem[]>([]);
  const [showNewDropdown, setShowNewDropdown] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await apiClient.dashboard.getOverview();
      if (res?.data?.notifications && Array.isArray(res.data.notifications)) {
        setNotifications((prev) => {
          // Preserve any client-side dynamic errors
          const clientErrors = prev.filter((n) => n.type === 'error');
          const serverItems = res.data.notifications;
          const map = new Map<string, DashboardNotificationItem>();
          [...clientErrors, ...serverItems].forEach((item) => map.set(item.id, item as DashboardNotificationItem));
          return Array.from(map.values());
        });
      }
    } catch {
      // Ignore background notification fetch errors
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Listen for client-side errors and alerts
    const handleClientAlert = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.message) {
        setNotifications((prev) => [
          {
            id: `err-${Date.now()}`,
            title: detail.title || 'Client Error',
            message: detail.message,
            time: 'Just now',
            unread: true,
            type: detail.type || 'error',
            link: detail.link,
          },
          ...prev,
        ]);
        // Automatically open notifications when an error occurs if desired
      }
    };

    window.addEventListener('dashboard-alert', handleClientAlert);
    return () => window.removeEventListener('dashboard-alert', handleClientAlert);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <header className={cn('h-16 border-b border-border bg-background/80 backdrop-blur px-6 flex items-center justify-between gap-4 sticky top-0 z-30', className)}>
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-bold text-foreground">{title}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setShowCommandPalette(true)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 flex items-center gap-3 transition-colors hidden sm:flex"
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-primary" /> Search CMS...
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">⌘K</kbd>
          </button>

          {/* Quick Action + New Menu */}
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowNewDropdown(!showNewDropdown)}
            >
              New
            </Button>

            {showNewDropdown && (
              <div
                className="absolute right-0 top-11 w-44 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl py-1.5 z-50 text-xs font-medium space-y-0.5 animate-fade-in"
                onClick={() => setShowNewDropdown(false)}
              >
                <a href="/dashboard/projects/new" className="block px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  + New Project
                </a>
                <a href="/dashboard/blogs/new" className="block px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  + New Blog Article
                </a>
                <a href="/dashboard/learning" className="block px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  + New Learning Topic
                </a>
                <a href="/dashboard/journey" className="block px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  + New Journey Event
                </a>
                <a href="/dashboard/freelancing" className="block px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  + New Freelance Project
                </a>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface border border-border relative transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onDismiss={handleDismiss}
              onClearAll={handleClearAll}
            />
          </div>

          {/* User Profile Avatar Dropdown */}
          <a href="/dashboard/profile" className="flex items-center gap-2 border-l border-border pl-3 group">
            <Avatar src={userAvatar} fallback={userName.substring(0, 2)} size="sm" />
            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors hidden md:inline">{userName}</span>
          </a>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
    </>
  );
};
