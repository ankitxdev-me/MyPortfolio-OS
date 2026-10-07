import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, ArrowRight, Layers, BookOpen, GraduationCap, Compass, Building2, Sparkles } from 'lucide-react';

interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
  category?: string;
}

export const CommandMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced live API search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch (e) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Learning', href: '/learning' },
    { label: 'Journey', href: '/journey' },
    { label: 'Academics', href: '/academics' },
    { label: 'Freelancing', href: '/freelancing' },
    { label: 'Contact', href: '/contact' },
  ];

  const filteredLinks = links.filter((link) =>
    link.label.toLowerCase().includes(query.toLowerCase())
  );

  const combinedItems = [
    ...searchResults.map((r) => ({ label: r.title, href: r.url, type: r.type, desc: r.description })),
    ...filteredLinks.map((l) => ({ label: l.label, href: l.href, type: 'link', desc: 'Navigation' })),
  ];

  const handleKeyDownModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === 'Enter' && combinedItems[selectedIndex]) {
      e.preventDefault();
      window.location.href = combinedItems[selectedIndex].href;
      setOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Layers className="w-3.5 h-3.5 text-primary shrink-0" />;
      case 'blog':
        return <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />;
      case 'learning':
      case 'academic':
        return <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />;
      case 'journey':
        return <Compass className="w-3.5 h-3.5 text-primary shrink-0" />;
      case 'freelance':
        return <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />;
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-9 h-9 xl:w-auto xl:h-9 xl:px-3 text-xs text-muted-foreground bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 hover:border-orange-500/40 dark:hover:border-orange-500/40 rounded-xl transition-all active:scale-95 cursor-pointer"
        aria-label="Search OS (⌘K)"
        title="Search OS (⌘K)"
      >
        <Search className="w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
        <span className="hidden xl:inline ml-2 text-neutral-600 dark:text-neutral-300 font-medium">Search OS...</span>
        <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] font-mono ml-2.5 px-1.5 py-0.5 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div
            className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-card overflow-hidden space-y-2 p-4"
            onKeyDown={handleKeyDownModal}
          >
            <div className="flex items-center gap-3 border-b border-border pb-3 px-2">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                autoFocus
                placeholder="Search projects, articles, tech stack, milestones..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
              />
              {loading && <span className="text-xs font-mono text-primary animate-pulse">Searching...</span>}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto py-2 space-y-3">
              {/* Live Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-primary uppercase px-2">Live Search Results</span>
                  {searchResults.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between p-2 rounded-lg transition-colors group ${
                          isSelected ? 'bg-primary/10 border border-primary/30 text-primary' : 'hover:bg-surface-hover'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {getIcon(item.type)}
                          <div className="truncate">
                            <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">{item.description}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase px-2">Quick Navigation</span>
                {filteredLinks.map((link, idx) => {
                  const globalIdx = searchResults.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors group ${
                        isSelected ? 'bg-primary/10 border border-primary/30 text-primary' : 'text-foreground hover:bg-surface-hover hover:text-primary'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>

              {query.trim() && (
                <div className="pt-2 border-t border-border/60 text-center">
                  <a
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-bold hover:underline"
                  >
                    View All Results on Search Page <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
