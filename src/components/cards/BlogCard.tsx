import React from 'react';
import { Card } from './Card';
import { getOptimizedImageUrl } from '@/lib/utils/media';
import { Clock, ArrowRight, Calendar, User } from 'lucide-react';

export interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category?: string;
  image?: string;
  tags?: string[];
  author?: string;
  slug?: string;
  onClick?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  date,
  readTime,
  category = 'Engineering',
  image,
  tags = [],
  author = 'Ankit Gupta',
  slug,
  onClick,
}) => {
  const optimizedImage = getOptimizedImageUrl(image || '/images/blog/cover1.jpg', { width: 600, height: 350 });
  const handleClick = onClick || (slug ? () => (window.location.href = `/blog/${slug}`) : undefined);

  return (
    <Card
      variant="interactive"
      padding="none"
      className="overflow-hidden flex flex-col justify-between group h-full rounded-2xl border-border/80 hover:border-primary/50 transition-all duration-300 shadow-xl bg-card"
      onClick={handleClick}
    >
      <div className="space-y-4">
        {/* Cover Image Container with Floating Category & Read Time Badges */}
        <div className="w-full h-48 overflow-hidden bg-surface relative">
          <img
            src={optimizedImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md border border-primary/40 text-primary shadow-sm">
              {category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-black/70 backdrop-blur-md text-neutral-300 border border-border/50 flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" /> {readTime}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              Read Article <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </span>
          </div>
        </div>

        {/* Card Body: Title, Full Description, Tags */}
        <div className="px-5 space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
          {excerpt && (
            <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Topic Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-surface border border-border text-[11px] font-mono text-muted-foreground group-hover:border-primary/30 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Date, Author & Read Button */}
      <div className="p-5 pt-3 space-y-3 border-t border-border/60 mt-4">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" /> {date}
          </span>
          <span className="text-primary font-semibold">{readTime}</span>
        </div>

        {author && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <User className="w-3.5 h-3.5 text-neutral-500" />
            <span>Author: {author}</span>
          </div>
        )}

        <div className="pt-1">
          <div className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all shadow-md shadow-primary/20 group-hover:shadow-primary/35 active:scale-95 cursor-pointer">
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Card>
  );
};
