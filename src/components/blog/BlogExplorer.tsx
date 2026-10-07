import React, { useState, useMemo } from 'react';

export interface BlogItem {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  featured?: boolean;
}

interface BlogExplorerProps {
  blogs: BlogItem[];
}

const CATEGORIES = ['All', 'Engineering', 'Backend', 'Web Dev', 'AI/ML'] as const;

export const BlogExplorer: React.FC<BlogExplorerProps> = ({ blogs }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Category matching helper
  const matchesCategory = (b: BlogItem, category: string): boolean => {
    if (category === 'All') return true;
    const cat = (b.category || '').toLowerCase();
    const tags = (b.tags || []).map((t) => t.toLowerCase());
    const text = `${b.title} ${b.excerpt}`.toLowerCase();

    if (category === 'Engineering') {
      return (
        cat.includes('engineering') ||
        cat.includes('tech') ||
        tags.some((t) => ['engineering', 'docker', 'typescript', 'redis', 'langchain', 'system'].includes(t)) ||
        text.includes('engineer') ||
        text.includes('architecture')
      );
    }

    if (category === 'Backend') {
      return (
        cat.includes('backend') ||
        tags.some((t) => ['node.js', 'redis', 'system design', 'architecture', 'backend', 'api'].includes(t)) ||
        text.includes('backend') ||
        text.includes('queue') ||
        text.includes('workflow')
      );
    }

    if (category === 'Web Dev') {
      return (
        cat.includes('web') ||
        tags.some((t) => ['next.js', 'react', 'astro', 'tailwind', 'performance', 'frontend'].includes(t)) ||
        text.includes('web') ||
        text.includes('astro') ||
        text.includes('react')
      );
    }

    if (category === 'AI/ML') {
      return (
        cat.includes('ai') ||
        cat.includes('ml') ||
        tags.some((t) => ['ai/ml', 'ai', 'ml', 'langchain', 'python', 'llm'].includes(t)) ||
        text.includes('ai') ||
        text.includes('agent')
      );
    }

    return true;
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => matchesCategory(b, selectedCategory));
  }, [blogs, selectedCategory]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner matching mobile mockup */}
      <div className="space-y-1.5 px-1 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Blog
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
          Thoughts, tutorials, and experiences from my tech journey.
        </p>
      </div>

      {/* Category Filter Pills (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Blog Cards List matching mockup */}
      {filteredBlogs.length === 0 ? (
        <div className="py-16 text-center space-y-3 rounded-3xl border border-neutral-800/80 bg-neutral-900/30">
          <p className="text-sm font-semibold text-neutral-300">No articles found in this category.</p>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-bold text-orange-500 hover:text-orange-400 underline"
          >
            Reset filter to All
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 sm:space-y-4">
          {filteredBlogs.map((blog) => (
            <a
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="group block rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/90 transition-all duration-300 p-3.5 sm:p-4.5 shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-start gap-3.5 sm:gap-4.5">
                {/* Left Thumbnail Icon Box */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shrink-0 flex items-center justify-center p-0.5 group-hover:border-neutral-700 transition-colors">
                  <img
                    src={blog.coverImage || '/images/blog/nextjs15.svg'}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-[14px] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Right Metadata & Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1.5 sm:space-y-2">
                  {/* Date & Read Time */}
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 font-mono">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Excerpt - Hidden on phone view */}
                  {blog.excerpt && (
                    <p className="hidden md:block text-xs text-neutral-300 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Tags Row - All Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-neutral-950/80 border border-neutral-800/90 text-[10px] sm:text-[11px] font-medium text-neutral-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
