import React from 'react';
import { Bell, Check, Info, FileText, Mail, AlertCircle, X, ExternalLink } from 'lucide-react';

export interface DashboardNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'support' | 'draft' | 'system' | 'error' | 'update';
  link?: string;
}

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: DashboardNotificationItem[];
  onDismiss?: (id: string) => void;
  onClearAll?: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onDismiss,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'support':
        return <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'draft':
        return <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      case 'update':
        return <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-primary shrink-0" />;
    }
  };

  return (
    <div className="absolute top-14 right-4 z-50 w-80 sm:w-96 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden space-y-0 animate-fade-in">
      <div className="p-3.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold text-white tracking-wide">Live Alerts & Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {notifications.length > 0 && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[10px] text-neutral-400 hover:text-white font-mono transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-2.5 max-h-96 overflow-y-auto space-y-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center space-y-1">
            <Check className="w-6 h-6 text-emerald-400 mx-auto" />
            <p className="text-xs font-medium text-white">All caught up!</p>
            <p className="text-[11px] text-neutral-400">No active alerts or unread inquiries.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const innerCard = (
              <div
                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all relative group ${
                  item.unread
                    ? 'bg-orange-500/5 border-orange-500/30'
                    : 'bg-neutral-950/50 border-neutral-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    {getNotificationIcon(item.type)}
                    <span className="truncate">{item.title}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-neutral-400">{item.time}</span>
                    {onDismiss && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDismiss(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 text-neutral-500 transition-opacity"
                        title="Dismiss notification"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed line-clamp-2">{item.message}</p>
                {item.link && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-orange-400 font-semibold group-hover:underline">
                    <span>View details</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );

            return item.link ? (
              <a
                key={item.id}
                href={item.link}
                onClick={onClose}
                className="block focus:outline-none"
              >
                {innerCard}
              </a>
            ) : (
              <div key={item.id}>{innerCard}</div>
            );
          })
        )}
      </div>
    </div>
  );
};
