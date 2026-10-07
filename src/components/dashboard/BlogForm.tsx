import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { BlogDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { ImagePickerModal } from '@/components/dashboard/ImagePickerModal';
import { Save, ArrowLeft, Eye, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const BlogForm: React.FC = () => {
  const [blogId, setBlogId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [readingTime, setReadingTime] = useState('5');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Image Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Read ?slug= from query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get('slug');

    if (querySlug) {
      setLoading(true);
      apiClient.blogs
        .getBySlugOrId(querySlug)
        .then((res) => {
          if (res && res.data) {
            const b = res.data;
            setBlogId(b.id);
            setTitle(b.title || '');
            setSlug(b.slug || '');
            setCategory(b.category || 'Engineering');
            setReadingTime(String(b.readingTimeMinutes || 5));
            setCoverImageUrl(b.coverImageUrl || (b as any).coverImage || '');
            setExcerpt(b.excerpt || '');
            setTagsInput((b.tags || []).join(', '));
            setContent(b.content || '');
            setPublished(!!b.published);
            setFeatured(!!b.featured);
          }
        })
        .catch((err) => {
          setError(err?.message || 'Failed to fetch article details');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  // Dirty state listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setIsDirty(true);
    setError(null);
    setSuccessMsg(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title.trim() || title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }
    if (!excerpt.trim()) {
      errors.excerpt = 'Excerpt is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<BlogDTO> = {
      title,
      slug: slug.trim() || undefined,
      category,
      readingTimeMinutes: parseInt(readingTime, 10) || 5,
      coverImageUrl: coverImageUrl || undefined,
      excerpt,
      content: content || excerpt,
      tags,
      published,
      featured,
    };

    try {
      if (blogId) {
        await apiClient.blogs.update(blogId, payload);
        setSuccessMsg('Article updated successfully!');
      } else {
        const res = await apiClient.blogs.create(payload as any);
        setSuccessMsg('Article published successfully!');
        if (res.data?.id) {
          setBlogId(res.data.id);
        }
      }
      setIsDirty(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground font-mono">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
        Loading article editor...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectImage={(url) => handleChange(setCoverImageUrl, url)}
        title="Select Article Cover Image"
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/blogs"
            onClick={(e) => {
              if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
                e.preventDefault();
              }
            }}
            className="p-2 rounded-lg hover:bg-surface border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {blogId ? 'Edit Technical Article' : 'Write Technical Article'}
            </h1>
            <p className="text-xs text-muted-foreground">Draft or publish a engineering blog post or technical deep-dive.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {slug && (
            <a href={`/blog/${slug}`} target="_blank" rel="noreferrer">
              <Button type="button" variant="outline" size="sm">
                <Eye className="w-4 h-4" /> Live Preview
              </Button>
            </a>
          )}
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : blogId ? 'Update Article' : 'Publish Article'}
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Container */}
      <Card variant="glass" padding="md" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase flex justify-between">
              <span>Article Title *</span>
              {fieldErrors.title && <span className="text-rose-400 normal-case">{fieldErrors.title}</span>}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleChange(setTitle, e.target.value)}
              placeholder="e.g. Building AutoOps AI Engine"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Slug URL (Optional)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleChange(setSlug, e.target.value)}
              placeholder="e.g. building-autoops-ai"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => handleChange(setCategory, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:outline-none"
            >
              <option value="Engineering">Engineering</option>
              <option value="Backend">Backend</option>
              <option value="Web Dev">Web Dev</option>
              <option value="AI / ML">AI / ML</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Estimated Reading Time (Minutes)</label>
            <input
              type="number"
              value={readingTime}
              onChange={(e) => handleChange(setReadingTime, e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Cover Image Row */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Cover Image URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => handleChange(setCoverImageUrl, e.target.value)}
              placeholder="https://res.cloudinary.com/... or /images/..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPickerOpen(true)}
              className="shrink-0"
            >
              <ImageIcon className="w-4 h-4 mr-1 text-primary" /> Browse Media
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase flex justify-between">
            <span>Excerpt / Summary *</span>
            {fieldErrors.excerpt && <span className="text-rose-400 normal-case">{fieldErrors.excerpt}</span>}
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => handleChange(setExcerpt, e.target.value)}
            placeholder="Short description of the post..."
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Tags (comma separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => handleChange(setTagsInput, e.target.value)}
            placeholder="TypeScript, Redis, BullMQ..."
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Markdown Body</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => handleChange(setContent, e.target.value)}
            placeholder="Write full article body in markdown format..."
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
          />
        </div>

        <div className="pt-2 border-t border-border flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => handleChange(setPublished, e.target.checked)}
              className="rounded bg-background border-border text-primary focus:ring-primary"
            />
            <span>Published (Visible on public blog)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => handleChange(setFeatured, e.target.checked)}
              className="rounded bg-background border-border text-primary focus:ring-primary"
            />
            <span>Featured Article (Shown at top banner of /blog)</span>
          </label>
        </div>
      </Card>
    </form>
  );
};
