import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { ContactMessageItem } from '@/lib/api/contactClient';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Mail,
  CheckCircle2,
  Trash2,
  Inbox,
  RefreshCw,
  Loader2,
  CheckCheck,
  User,
  Calendar,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const SupportDashboard: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.contact.getMessages({
        status: tab === 'all' ? undefined : tab,
        limit: 100,
      });

      if (res?.data && Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        setMessages([]);
      }

      if (res?.meta && typeof (res.meta as any).unreadCount === 'number') {
        setUnreadCount((res.meta as any).unreadCount);
      }
    } catch {
      showNotification('error', 'Failed to load support messages.');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateStatus = async (id: string, newStatus: 'read' | 'unread' | 'archived') => {
    setActionLoadingId(id);
    try {
      await apiClient.contact.updateStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      // Re-calculate unread count
      setMessages((current) => {
        const remainingUnread = current.filter((m) => m.id !== id && m.status === 'unread').length;
        const newUnread = newStatus === 'unread' ? remainingUnread + 1 : remainingUnread;
        setUnreadCount(newUnread);
        window.dispatchEvent(new CustomEvent('support-count-updated', { detail: { unread: newUnread } }));
        return current;
      });

      showNotification('success', `Message marked as ${newStatus}`);
    } catch {
      showNotification('error', 'Failed to update message status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionLoadingId('markAll');
    try {
      await apiClient.contact.markAllAsRead();
      setMessages((prev) => prev.map((msg) => ({ ...msg, status: 'read' })));
      setUnreadCount(0);
      window.dispatchEvent(new CustomEvent('support-count-updated', { detail: { unread: 0 } }));
      showNotification('success', 'All messages marked as read');
    } catch {
      showNotification('error', 'Failed to mark all as read');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setActionLoadingId(id);
    try {
      await apiClient.contact.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      showNotification('success', 'Message deleted');
      // Update sidebar
      fetchMessages();
    } catch {
      showNotification('error', 'Failed to delete message');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase font-mono">
            <MessageSquare className="w-3.5 h-3.5" /> Support & Inquiries
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Incoming <span className="orange-gradient-text">Messages</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Review and manage incoming project proposals, collaboration invites, job leads, and questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMessages}
            disabled={loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={actionLoadingId === 'markAll'}
              leftIcon={
                actionLoadingId === 'markAll' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )
              }
            >
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search & Tabs Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-xl w-fit">
          <button
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            onClick={() => setTab('unread')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tab === 'unread'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('read')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'read'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setTab('archived')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'archived'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Archived
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Main Split Grid: Message List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Messages List */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-xs space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              <p>Loading inquiries...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center glass-card border border-border rounded-2xl space-y-3">
              <Inbox className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground">No messages found</p>
              <p className="text-xs text-muted-foreground">
                {search ? 'Try clearing your search filters.' : 'All incoming messages will appear here.'}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isUnread = msg.status === 'unread';
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (isUnread) {
                      handleUpdateStatus(msg.id, 'read');
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 space-y-2 ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-glow-sm'
                      : isUnread
                      ? 'bg-surface border-primary/40 shadow-sm hover:border-primary'
                      : 'bg-surface/60 border-border hover:border-border-hover hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isUnread && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      <span className={`text-xs font-bold ${isUnread ? 'text-foreground font-extrabold' : 'text-foreground'}`}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className={`text-xs font-semibold truncate ${isUnread ? 'text-primary' : 'text-muted-foreground'}`}>
                    {msg.subject || 'Inquiry'}
                  </div>

                  <div className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Message Detail Pane */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <Card variant="glass" padding="lg" className="space-y-6 border-border sticky top-6">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedMessage.status === 'unread' ? 'primary' : 'secondary'}>
                      {selectedMessage.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight pt-1">
                    {selectedMessage.subject || 'No Subject'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" leftIcon={<Mail className="w-3.5 h-3.5" />}>
                      Reply
                    </Button>
                  </a>

                  {selectedMessage.status === 'read' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'unread')}
                      disabled={actionLoadingId === selectedMessage.id}
                    >
                      Mark Unread
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                      disabled={actionLoadingId === selectedMessage.id}
                    >
                      Mark Read
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedMessage.id)}
                    disabled={actionLoadingId === selectedMessage.id}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-surface/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-mono uppercase">Sender</div>
                    <div className="text-xs font-bold text-foreground">{selectedMessage.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-mono uppercase">Email</div>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs font-bold text-primary hover:underline truncate block max-w-[200px]"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Full Message Body */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  Message Content
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border/80 text-foreground text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-16 text-center glass-card border border-border rounded-2xl space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-primary" />
              <h3 className="text-base font-bold text-foreground">Select a message</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Click on any inquiry from the left panel to review message details, inspect project specifications, and reply directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
