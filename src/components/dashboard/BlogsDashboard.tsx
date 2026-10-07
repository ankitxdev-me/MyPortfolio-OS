import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { BlogDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';

import { Plus, Search, Trash2, Edit3, Archive, CheckCircle, Copy, Loader2, RefreshCw, Eye } from 'lucide-react';

export const BlogsDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.blogs.getAll({
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        limit: 100,
        useCache: false,
        includeDrafts: true,
      } as any);

      if (res && res.data) {
        setBlogs(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to load blog articles from server' });
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleAction = async (id: string, actionName: 'archive' | 'publish' | 'duplicate' | 'delete') => {
    setActionLoadingId(id);
    setNotification(null);
    try {
      if (actionName === 'archive') {
        setBlogs((prev) =>
          prev.map((b) => (b.id === id || b.slug === id || (b as any)._id === id ? { ...b, status: 'draft', published: false } : b))
        );
        await apiClient.blogs.archive(id);
        setNotification({ type: 'success', message: 'Article unpublished/moved to draft successfully' });
      } else if (actionName === 'publish') {
        setBlogs((prev) =>
          prev.map((b) => (b.id === id || b.slug === id || (b as any)._id === id ? { ...b, status: 'published', published: true } : b))
        );
        await apiClient.blogs.publish(id);
        setNotification({ type: 'success', message: 'Article published successfully' });
      } else if (actionName === 'duplicate') {
        const target = blogs.find((b) => b.id === id || b.slug === id || (b as any)._id === id);
        if (target) {
          const tempCopy: BlogDTO = {
            ...target,
            id: `temp-${Date.now()}`,
            title: `${target.title} (Copy)`,
            slug: `${target.slug}-copy-${Date.now().toString(36)}`,
          };
          setBlogs((prev) => [tempCopy, ...prev]);
        }
        await apiClient.blogs.duplicate(id);
        setNotification({ type: 'success', message: 'Article duplicated successfully!' });
        await fetchBlogs();
      } else if (actionName === 'delete') {
        if (!confirm('Are you sure you want to delete this article?')) {
          setActionLoadingId(null);
          return;
        }
        setBlogs((prev) => prev.filter((b) => b.id !== id && b.slug !== id && (b as any)._id !== id));
        setNotification({ type: 'success', message: 'Article deleted successfully from MongoDB!' });
        await apiClient.blogs.delete(id);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || `Failed to ${actionName} article` });
      await fetchBlogs();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blogs CMS</h1>
          <p className="text-xs text-muted-foreground">Manage technical articles, tutorials, category tags, and SEO metadata.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchBlogs} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <a href="/dashboard/blogs/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" /> Write Article
            </Button>
          </a>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-3 rounded-lg text-xs flex items-center justify-between ${
          notification.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-xs font-bold hover:opacity-80">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Backend">Backend</option>
            <option value="Web Dev">Web Dev</option>
            <option value="AI / ML">AI / ML</option>
          </select>
        </div>

        <span className="text-xs font-mono text-muted-foreground">Showing {blogs.length} Articles</span>
      </div>

      {/* Articles Table */}
      <Card variant="glass" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border font-mono uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Article Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Reading Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground font-sans">
              {loading && blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading blog articles from MongoDB...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    No blog articles found.
                  </td>
                </tr>
              ) : (
                blogs.map((article) => (
                  <tr key={article.id || article.slug} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3.5 font-bold flex items-center gap-2">
                      <span className="text-foreground">{article.title}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">{article.category || 'General'}</td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">{article.readingTimeMinutes || 5} min read</td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">
                      {(() => {
                        const isPub = article.published !== undefined ? article.published : (article.status !== 'draft' && article.status !== 'Draft' && article.status !== 'archived');
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                            isPub ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPub ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {isPub ? 'Published' : 'Draft'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors" title="Preview Article">
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <a href={`/dashboard/blogs/new?slug=${article.slug}`} className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors" title="Edit Article">
                          <Edit3 className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleAction(article.id, 'duplicate')}
                          disabled={actionLoadingId === article.id}
                          className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                          title="Duplicate Article"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {(() => {
                          const isPub = article.published !== undefined ? article.published : (article.status !== 'draft' && article.status !== 'Draft' && article.status !== 'archived');
                          return (
                            <button
                              type="button"
                              onClick={() => handleAction(article.id, isPub ? 'archive' : 'publish')}
                              disabled={actionLoadingId === article.id}
                              className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                              title={isPub ? 'Unpublish (Set to Draft)' : 'Publish to Public Site'}
                            >
                              {isPub ? <Archive className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          );
                        })()}
                        <button
                          type="button"
                          onClick={() => handleAction(article.id, 'delete')}
                          disabled={actionLoadingId === article.id}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
