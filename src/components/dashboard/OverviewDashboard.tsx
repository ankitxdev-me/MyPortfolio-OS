import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/cards/Card';
import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { RecentActivity, type ActivityItem } from '@/components/dashboard/RecentActivity';
import type { ContentDraftItem, DashboardOverviewStats } from '@/server/services/dashboard.service';
import {
  Folder,
  BookOpen,
  GraduationCap,
  MapPin,
  Briefcase,
  Award,
  Activity,
  Clock,
  Loader2,
  Database,
  ShieldCheck,
  Cpu,
  Mail,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardOverviewStats>({
    projects: 0,
    articles: 0,
    learning: 0,
    journey: 0,
    academics: 0,
    freelancing: 0,
    supportMessages: 0,
    unreadMessages: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [drafts, setDrafts] = useState<ContentDraftItem[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    connected: true,
    database: 'MongoDB Atlas',
    auth: 'JWT Active',
    imageLinking: 'External Direct URL',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setLoadError(null);

    try {
      const res = await apiClient.dashboard.getOverview();
      if (res?.data) {
        const d = res.data;
        setStats(d.stats);
        setRecentActivities(d.recentActivities as ActivityItem[]);
        setDrafts(d.drafts);
        if (d.systemHealth) {
          setSystemHealth(d.systemHealth);
        }
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to connect to MongoDB overview API';
      setLoadError(errMsg);

      // Dispatch client error alert to header notifications
      window.dispatchEvent(
        new CustomEvent('dashboard-alert', {
          detail: {
            title: 'Client Load Warning',
            message: errMsg,
            type: 'error',
          },
        })
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, <span className="orange-gradient-text">Ankit 👋</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Portfolio OS CMS is operational. Live overview of MongoDB content performance & system status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-muted-foreground hover:text-white hover:border-primary/40 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Refresh MongoDB Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border ${
              systemHealth.connected
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                systemHealth.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            System Status: {systemHealth.connected ? 'Operational' : 'Degraded'}
          </div>
        </div>
      </div>

      {/* Client Load Error Alert Banner if any */}
      {loadError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold text-rose-300">Client Connection Notice</p>
              <p className="text-rose-400/90">{loadError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Metric Stats Strip Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Projects */}
        <a href="/dashboard/projects" className="block group">
          <Card variant="glass" padding="sm" className="space-y-1 border-primary/20 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-mono uppercase">Projects</span>
              <Folder className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-extrabold font-mono text-foreground flex items-center gap-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : stats.projects}
            </p>
          </Card>
        </a>

        {/* Articles */}
        <a href="/dashboard/blogs" className="block group">
          <Card variant="glass" padding="sm" className="space-y-1 border-primary/20 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-mono uppercase">Articles</span>
              <BookOpen className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-extrabold font-mono text-foreground flex items-center gap-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : stats.articles}
            </p>
          </Card>
        </a>

        {/* Learning */}
        <a href="/dashboard/learning" className="block group">
          <Card variant="glass" padding="sm" className="space-y-1 border-primary/20 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-mono uppercase">Learning</span>
              <GraduationCap className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-extrabold font-mono text-foreground flex items-center gap-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : stats.learning}
            </p>
          </Card>
        </a>

        {/* Journey */}
        <a href="/dashboard/journey" className="block group">
          <Card variant="glass" padding="sm" className="space-y-1 border-primary/20 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-mono uppercase">Journey</span>
              <MapPin className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-extrabold font-mono text-foreground flex items-center gap-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : stats.journey}
            </p>
          </Card>
        </a>

        {/* Academics */}
        <a href="/dashboard/academics" className="block group">
          <Card variant="glass" padding="sm" className="space-y-1 border-primary/20 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-mono uppercase">Academics</span>
              <Award className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-extrabold font-mono text-foreground flex items-center gap-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : stats.academics}
            </p>
          </Card>
        </a>

        {/* Freelancing */}
        <a href="/dashboard/freelancing" className="block group">
          <Card variant="glass" padding="sm" className="space-y-1 border-primary/20 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-mono uppercase">Freelancing</span>
              <Briefcase className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-extrabold font-mono text-foreground flex items-center gap-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : stats.freelancing}
            </p>
          </Card>
        </a>

        {/* Support Inquiries */}
        <a href="/dashboard/support" className="block group col-span-2 sm:col-span-1">
          <Card
            variant="glass"
            padding="sm"
            className={`space-y-1 transition-all ${
              stats.unreadMessages > 0
                ? 'border-orange-500/50 bg-orange-500/5 group-hover:border-orange-500'
                : 'border-primary/20 group-hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-mono uppercase">Support</span>
              <Mail className={`w-3.5 h-3.5 ${stats.unreadMessages > 0 ? 'text-orange-400' : 'text-primary'}`} />
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-xl font-extrabold font-mono text-foreground">
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : stats.supportMessages}
              </p>
              {stats.unreadMessages > 0 && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white animate-pulse">
                  {stats.unreadMessages} NEW
                </span>
              )}
            </div>
          </Card>
        </a>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Quick CMS Actions</h2>
        <QuickActionsGrid />
      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Activity Feed & Real Draft Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Live Activity Stream */}
          <div className="space-y-3">
            <RecentActivity activities={recentActivities} loading={loading} />
          </div>

          {/* Real Content Drafts in Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Content In Progress (Drafts)
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {drafts.length} pending draft{drafts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-2 rounded-2xl border border-border bg-surface/30">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                <p className="text-xs font-mono text-muted-foreground">Loading drafts from MongoDB...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="py-10 text-center rounded-2xl border border-dashed border-border bg-surface/20 space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-sm font-bold text-foreground">All Content is Live & Published!</h3>
                  <p className="text-xs text-muted-foreground">
                    There are currently no unpublished drafts. Create a new article or project case study anytime.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href="/dashboard/blogs/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Article
                  </a>
                  <a
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-foreground text-xs font-semibold hover:bg-surface-hover transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Project
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {drafts.map((draft) => (
                  <Card
                    key={draft.id}
                    variant="glass"
                    padding="sm"
                    className="space-y-3 border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-primary font-bold">{draft.category}</span>
                        <span className="text-muted-foreground">{draft.lastModified}</span>
                      </div>

                      <h3 className="font-bold text-foreground text-xs line-clamp-2 group-hover:text-primary transition-colors">
                        {draft.title}
                      </h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-muted-foreground">Readiness</span>
                        <span
                          className={`font-semibold ${
                            draft.readyToPost ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {draft.readyToPost ? 'Ready to Post' : `${draft.completion}% Done`}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                        <div
                          style={{ width: `${draft.completion}%` }}
                          className={`h-full transition-all duration-500 ${
                            draft.readyToPost ? 'bg-emerald-400' : 'bg-primary'
                          }`}
                        />
                      </div>

                      <a
                        href={draft.editUrl}
                        className="inline-flex items-center justify-between w-full pt-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        <span>{draft.readyToPost ? 'Review & Publish' : 'Continue Editing'}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: System Health & Connection Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="glass" padding="md" className="space-y-4 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">Database & System Health</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  systemHealth.connected
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {systemHealth.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="space-y-2 pt-1 border-t border-border/60 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" /> Database Engine
                </span>
                <span className="font-mono text-foreground font-semibold">{systemHealth.database}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authentication
                </span>
                <span className="font-mono text-emerald-400 font-semibold">{systemHealth.auth}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary" /> Image Linking
                </span>
                <span className="font-mono text-foreground font-semibold">{systemHealth.imageLinking}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" /> Live MongoDB Feed
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Active & Synced</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
