import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { SearchResultItemDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Sparkles, ArrowRight, Layers, BookOpen, GraduationCap, Compass, Building2 } from 'lucide-react';

interface RelatedContentProps {
  currentSlug: string;
  type?: string;
  title?: string;
}

export const RelatedContent: React.FC<RelatedContentProps> = ({
  currentSlug,
  type = 'all',
  title = 'Recommended Related Content',
}) => {
  const [items, setItems] = useState<SearchResultItemDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSlug) return;
    setLoading(true);
    apiClient.search
      .getRelated(currentSlug, type, 3)
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setItems(res.data);
        } else if (Array.isArray(res)) {
          setItems(res as any);
        }
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentSlug, type]);

  if (loading) return null;
  if (items.length === 0) return null;

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'project':
        return <Layers className="w-4 h-4 text-primary shrink-0" />;
      case 'blog':
        return <BookOpen className="w-4 h-4 text-primary shrink-0" />;
      case 'learning':
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-primary shrink-0" />;
      case 'journey':
        return <Compass className="w-4 h-4 text-primary shrink-0" />;
      case 'freelance':
        return <Building2 className="w-4 h-4 text-primary shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary shrink-0" />;
    }
  };

  return (
    <div className="pt-12 border-t border-border/80 space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <a key={item.id || item.slug} href={item.url || `/${item.type}/${item.slug}`}>
            <Card variant="interactive" padding="md" className="space-y-3 h-full flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-mono capitalize">
                    {getTypeIcon(item.type)} {item.type}
                  </span>
                  {item.category && (
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px]">
                      {item.category}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-end text-xs font-mono text-primary font-semibold">
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Detail <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};
