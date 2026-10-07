import React, { useState, useEffect } from 'react';
import { Search, Folder, BookOpen, GraduationCap, Briefcase, Settings, X, ArrowRight } from 'lucide-react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If custom trigger needed
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navActions = [
    { label: 'Go to Projects CMS', href: '/dashboard/projects', category: 'Navigation', icon: <Folder className="w-4 h-4 text-primary" /> },
    { label: 'Go to Blogs CMS', href: '/dashboard/blogs', category: 'Navigation', icon: <BookOpen className="w-4 h-4 text-primary" /> },
    { label: 'Go to Learning CMS', href: '/dashboard/learning', category: 'Navigation', icon: <GraduationCap className="w-4 h-4 text-primary" /> },
    { label: 'Go to Freelancing CMS', href: '/dashboard/freelancing', category: 'Navigation', icon: <Briefcase className="w-4 h-4 text-primary" /> },
    { label: 'Go to Settings', href: '/dashboard/settings', category: 'Navigation', icon: <Settings className="w-4 h-4 text-primary" /> },
  ];

  const filtered = navActions.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl rounded-xl bg-background border border-border/80 shadow-2xl overflow-hidden space-y-0">
        {/* Input Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search CMS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <button type="button" onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground group-hover:text-primary">
                  <span>Jump to</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </a>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">No commands found matching "{query}"</div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-surface/50 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Navigate with arrows</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
