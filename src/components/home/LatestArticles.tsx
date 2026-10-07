import React, { useState, useRef } from 'react';
import type { BlogDTO } from '@/lib/types/api.types';
import { BlogCard } from '@/components/cards/BlogCard';
import { Button } from '@/components/ui/Button';
import { BookOpen, ArrowRight, Clock, Calendar, User } from 'lucide-react';

interface LatestArticlesProps {
  articles?: BlogDTO[];
}

export const LatestArticles: React.FC<LatestArticlesProps> = ({ articles = [] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);

  // STRICT: Only articles explicitly marked as featured are displayed on homepage
  const featuredArticles = (articles || []).filter((a: any) => a?.featured === true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, offsetWidth } = scrollContainerRef.current;
    if (offsetWidth > 0) {
      const index = Math.round(scrollLeft / (offsetWidth * 0.85));
      setActiveScrollIndex(Math.min(featuredArticles.length - 1, Math.max(0, index)));
    }
  };

  if (featuredArticles.length === 0) return null;

  return (
    <section className="py-12 md:py-20 border-t border-border/80">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-5 sm:pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Technical Documentation & Blog
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Engineering <span className="orange-gradient-text">Articles</span>
            </h2>
          </div>
          <a href="/blog">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}>
              View All Articles
            </Button>
          </a>
        </div>

        {/* ─── Mobile View Only: Horizontal Scroller for Blog Posts (< 768px) ─── */}
        <div className="block md:hidden space-y-4">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 scrollbar-none scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {featuredArticles.map((blog, idx) => {
              const bImg =
                (blog as any).coverImage ||
                (blog as any).coverImageUrl ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
              const bDate = blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';
              const bReadTime = `${blog.readingTimeMinutes || 5} min read`;
              const bCategory = blog.category || 'Engineering';

              return (
                <div
                  key={blog.id || blog.slug || idx}
                  className="snap-center shrink-0 w-[85vw] max-w-[340px] rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-3.5 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3">
                    {/* Article Image Preview */}
                    <a
                      href={`/blog/${blog.slug}`}
                      className="block relative rounded-xl overflow-hidden h-44 w-full bg-neutral-950 border border-neutral-800 group"
                    >
                      <img
                        src={bImg}
                        alt={blog.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md border border-primary/40 text-primary">
                          {bCategory}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/70 backdrop-blur-md text-neutral-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" /> {bReadTime}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          Read Article <ArrowRight className="w-3 h-3 text-primary" />
                        </span>
                      </div>
                    </a>

                    {/* Title & Full Description */}
                    <div className="space-y-1.5">
                      <a href={`/blog/${blog.slug}`} className="block group">
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                          {blog.title}
                        </h3>
                      </a>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {blog.excerpt || ''}
                      </p>
                    </div>

                    {/* Article Tags & Key Topics */}
                    {Array.isArray((blog as any).tags) && (blog as any).tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(blog as any).tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Author, Date & Read Article Button */}
                  <div className="space-y-3 pt-3 border-t border-neutral-800/80">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary" /> {bDate}
                      </span>
                      <span className="text-primary font-semibold">{bReadTime}</span>
                    </div>

                    {(blog as any).author?.name && (
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
                        <User className="w-3 h-3 text-neutral-500" />
                        <span>Author: {(blog as any).author.name}</span>
                      </div>
                    )}

                    <a
                      href={`/blog/${blog.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors shadow-md shadow-primary/20 active:scale-95"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Swipe Indicator Dots for Phone View */}
          {featuredArticles.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {featuredArticles.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeScrollIndex === i
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-neutral-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── Desktop View Only: Standard 3-Column Grid (md: and above) ─── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
          {featuredArticles.slice(0, 3).map((blog) => (
            <BlogCard
              key={blog.id || blog.slug}
              title={blog.title}
              excerpt={blog.excerpt}
              date={
                blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent'
              }
              readTime={`${blog.readingTimeMinutes || 5} min read`}
              category={blog.category || 'Engineering'}
              image={(blog as any).coverImage || (blog as any).coverImageUrl}
              tags={(blog as any).tags || []}
              author={(blog as any).author?.name || 'Ankit Gupta'}
              slug={blog.slug}
              onClick={() => (window.location.href = `/blog/${blog.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
