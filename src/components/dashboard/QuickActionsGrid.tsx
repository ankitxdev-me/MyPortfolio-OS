import React from 'react';
import { Card } from '@/components/cards/Card';
import { Plus, Folder, BookOpen, GraduationCap, MapPin, Briefcase, Settings } from 'lucide-react';

export const QuickActionsGrid: React.FC = () => {
  const actions = [
    { label: 'Create Project', href: '/dashboard/projects', icon: <Folder className="w-4 h-4 text-primary" />, desc: 'Add new portfolio case study' },
    { label: 'Write Article', href: '/dashboard/blogs', icon: <BookOpen className="w-4 h-4 text-primary" />, desc: 'Draft technical blog post' },
    { label: 'Add Learning', href: '/dashboard/learning', icon: <GraduationCap className="w-4 h-4 text-primary" />, desc: 'Record course or topic note' },
    { label: 'Add Journey', href: '/dashboard/journey', icon: <MapPin className="w-4 h-4 text-primary" />, desc: 'Log career milestone event' },
    { label: 'Add Freelancing', href: '/dashboard/freelancing', icon: <Briefcase className="w-4 h-4 text-primary" />, desc: 'Log client or consulting project' },
    { label: 'CMS Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4 text-primary" />, desc: 'Configure OS preferences' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {actions.map((act, idx) => (
        <a key={idx} href={act.href}>
          <Card
            variant="glass"
            padding="sm"
            className="group cursor-pointer hover:border-primary/50 transition-all duration-200 h-full flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">{act.icon}</div>
              <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{act.label}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{act.desc}</p>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
};
