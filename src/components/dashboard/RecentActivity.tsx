import React from 'react';
import { Card } from '@/components/cards/Card';
import { Activity, Clock, BookOpen, Folder, GraduationCap, MapPin, Briefcase, Mail, Cpu, ExternalLink } from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  action: string;
  resource?: 'Blog' | 'Project' | 'Learning' | 'Journey' | 'Freelancing' | 'Contact' | 'System';
  link?: string;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
  className?: string;
  loading?: boolean;
}

const getResourceIcon = (resource?: string) => {
  switch (resource) {
    case 'Blog':
      return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
    case 'Project':
      return <Folder className="w-3.5 h-3.5 text-primary" />;
    case 'Learning':
      return <GraduationCap className="w-3.5 h-3.5 text-blue-400" />;
    case 'Journey':
      return <MapPin className="w-3.5 h-3.5 text-purple-400" />;
    case 'Freelancing':
      return <Briefcase className="w-3.5 h-3.5 text-emerald-400" />;
    case 'Contact':
      return <Mail className="w-3.5 h-3.5 text-rose-400" />;
    default:
      return <Cpu className="w-3.5 h-3.5 text-primary" />;
  }
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, className, loading }) => {
  return (
    <Card variant="glass" padding="md" className={className}>
      <div className="flex items-center justify-between gap-2 mb-4 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-foreground text-sm">Recent CMS Activity</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">Live MongoDB Feed</span>
      </div>

      {loading ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-mono">Loading recent activity...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center space-y-1">
          <Activity className="w-8 h-8 text-muted-foreground/40 mx-auto" />
          <p className="text-xs font-semibold text-foreground">No recent activity recorded</p>
          <p className="text-[11px] text-muted-foreground">Any created or updated CMS entities will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => {
            const Content = (
              <div className="flex items-start justify-between gap-3 text-xs group">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-surface border border-border/80 shrink-0 mt-0.5 group-hover:border-primary/40 transition-colors">
                    {getResourceIcon(act.resource)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{act.action}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {act.timestamp}
                  </span>
                  {act.link && <ExternalLink className="w-3 h-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </div>
            );

            return (
              <div key={act.id} className="pb-3 border-b border-border/40 last:border-0 last:pb-0">
                {act.link ? (
                  <a href={act.link} className="block cursor-pointer">
                    {Content}
                  </a>
                ) : (
                  Content
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <Card variant="interactive" padding="md" className="flex items-center gap-4 group" onClick={onClick}>
      <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};
