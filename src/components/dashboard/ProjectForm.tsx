import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { ProjectDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { ImagePickerModal } from '@/components/dashboard/ImagePickerModal';
import {
  Save,
  ArrowLeft,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Layers,
  Cpu,
  Activity,
  Compass,
  Code2,
  Calendar,
} from 'lucide-react';

const parseMonthToISO = (val: string): string => {
  if (!val) return '';
  if (/^\d{4}-\d{2}$/.test(val)) return val;
  const d = new Date(val.includes(' ') ? `01 ${val}` : val);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }
  return '';
};

const formatISOToMonth = (iso: string): string => {
  if (!iso) return '';
  const [y, m] = iso.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

export const ProjectForm: React.FC = () => {
  const [projectId, setProjectId] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'basic' | 'architecture' | 'tech' | 'features' | 'timeline'>('basic');

  // Basic Info Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<string>('AI / Automation');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Planned'>('In Progress');
  const [progress, setProgress] = useState<number>(75);
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  // Overview & Architecture
  const [overview, setOverview] = useState('');
  const [architectureOverview, setArchitectureOverview] = useState('');

  // Categorized Tech Stack Inputs
  const [techFrontend, setTechFrontend] = useState('');
  const [techBackend, setTechBackend] = useState('');
  const [techDatabase, setTechDatabase] = useState('');
  const [techInfra, setTechInfra] = useState('');

  // Key Performance Metrics List [{ label, value }]
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([
    { label: 'Execution Speed', value: '120ms' },
    { label: 'Active Agents', value: '14' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Commits', value: '180+' },
  ]);

  // Key Features List
  const [features, setFeatures] = useState<string[]>([
    'Visual Drag-and-Drop Workflow Canvas',
    'Autonomous LLM Agent Task Orchestration',
    'Real-time WebSocket Execution Telemetry',
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Screenshots Gallery [{ src, caption }]
  const [gallery, setGallery] = useState<{ src: string; caption: string }[]>([]);

  // Timeline Phases [{ date, title, description, status }]
  const [timeline, setTimeline] = useState<{ date: string; title: string; description: string; status: 'Completed' | 'In Progress' | 'Planned' }[]>([
    { date: 'Jul 10, 2026', title: 'Architecture & Database Design', description: 'Defined entity relationship models and event contract schemas.', status: 'Completed' },
    { date: 'Jul 15, 2026', title: 'Auth & RBAC Module', description: 'Built JWT token validation and role permissions.', status: 'Completed' },
    { date: 'Jul 19, 2026', title: 'Workflow Execution Engine', description: 'Built async queue processing and agent step runners.', status: 'In Progress' },
    { date: 'Sep 30, 2026', title: 'Production Release v1.0', description: 'Final telemetry polish and public deployment.', status: 'Planned' },
  ]);

  // Form State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Helper Populator
  const populateFields = (p: ProjectDTO | any) => {
    setProjectId(p.id || p._id || p.slug);
    setTitle(p.title || '');
    setSlug(p.slug || '');
    setSubtitle(p.subtitle || p.tagline || '');
    setCategory(p.category || 'AI / Automation');
    setStatus((p.status as any) || (p.published ? 'Completed' : 'In Progress'));
    setProgress(p.progress ?? 80);
    setStartDate(p.startDate || '');
    setDeadline(p.deadline || '');
    setGithubUrl(p.githubUrl || '');
    setDemoUrl(p.demoUrl || p.liveUrl || '');
    setThumbnailUrl(p.thumbnailUrl || p.image || '');
    setFeatured(!!p.featured);
    setPublished(p.published !== undefined ? p.published : true);

    setOverview(p.overview || p.summary || p.description || '');
    setArchitectureOverview(p.architectureOverview || '');

    // Tech Stack
    if (p.techStack && typeof p.techStack === 'object' && !Array.isArray(p.techStack)) {
      setTechFrontend((p.techStack.frontend || []).join(', '));
      setTechBackend((p.techStack.backend || []).join(', '));
      setTechDatabase((p.techStack.database || []).join(', '));
      setTechInfra((p.techStack.infrastructure || []).join(', '));
    } else if (Array.isArray(p.techStack)) {
      setTechFrontend(p.techStack.join(', '));
      setTechBackend('');
      setTechDatabase('');
      setTechInfra('');
    }

    if (p.metrics && Array.isArray(p.metrics)) {
      setMetrics(p.metrics);
    }
    if (p.features && Array.isArray(p.features)) {
      setFeatures(p.features);
    }
    if (p.gallery && Array.isArray(p.gallery)) {
      setGallery(p.gallery.map((g: any) => ({ src: g.src || g.url || '', caption: g.caption || g.alt || '' })));
    }
    if (p.timeline && Array.isArray(p.timeline)) {
      setTimeline(p.timeline);
    }
  };

  // Read ?slug= from query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get('slug');

    if (querySlug) {
      setLoading(true);
      apiClient.projects
        .getBySlugOrId(querySlug)
        .then((res) => {
          if (res && res.data) {
            populateFields(res.data);
          }
        })
        .catch((err) => {
          setError(err?.message || 'Failed to fetch project details from server');
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
      errors.title = 'Title must be at least 3 characters';
    }
    if (!subtitle.trim()) {
      errors.subtitle = 'Subtitle is required for case study hero';
    }
    if (!overview.trim()) {
      errors.overview = 'Overview (Problem Statement & Scope) is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setActiveTab('basic');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const formattedTechStack = {
      frontend: techFrontend.split(',').map((s) => s.trim()).filter(Boolean),
      backend: techBackend.split(',').map((s) => s.trim()).filter(Boolean),
      database: techDatabase.split(',').map((s) => s.trim()).filter(Boolean),
      infrastructure: techInfra.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const payload: Partial<ProjectDTO> = {
      title,
      slug: slug.trim() || undefined,
      subtitle: subtitle || 'Project Case Study',
      category: category || 'Web Development',
      status: status || 'In Progress',
      progress: Number(progress) || 0,
      startDate: startDate || '',
      deadline: deadline || '',
      description: overview || title,
      summary: subtitle || title,
      overview: overview || title,
      architectureOverview: architectureOverview || '',
      githubUrl: githubUrl || '',
      demoUrl: demoUrl || '',
      liveUrl: demoUrl || '',
      thumbnailUrl: thumbnailUrl || '/images/projects/autoops.jpg',
      image: thumbnailUrl || '/images/projects/autoops.jpg',
      techStack: formattedTechStack,
      metrics: metrics || [],
      features: features || [],
      gallery: gallery || [],
      timeline: timeline || [],
      featured: featured || false,
      published: published !== undefined ? published : true,
    };

    try {
      if (projectId) {
        await apiClient.projects.update(projectId, payload);
        setSuccessMsg('Project Case Study updated successfully in MongoDB!');
      } else {
        const res = await apiClient.projects.create(payload as any);
        setSuccessMsg('Project Case Study created successfully in MongoDB!');
        if (res.data?.id) {
          setProjectId(res.data.id);
        }
      }
      setIsDirty(false);
      setTimeout(() => {
        window.location.href = '/dashboard/projects';
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Failed to save project to MongoDB database.');
    } finally {
      setSaving(false);
    }
  };

  // Handlers for dynamic lists
  const addMetric = () => {
    setMetrics([...metrics, { label: 'New Metric', value: '100%' }]);
    setIsDirty(true);
  };
  const updateMetric = (idx: number, field: 'label' | 'value', val: string) => {
    const updated = [...metrics];
    updated[idx][field] = val;
    setMetrics(updated);
    setIsDirty(true);
  };
  const removeMetric = (idx: number) => {
    setMetrics(metrics.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  const addFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeatures([...features, newFeatureInput.trim()]);
    setNewFeatureInput('');
    setIsDirty(true);
  };
  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  const addGalleryItem = () => {
    setGallery([...gallery, { src: '', caption: 'Screenshot Caption' }]);
    setIsDirty(true);
  };
  const updateGalleryItem = (idx: number, field: 'src' | 'caption', val: string) => {
    const updated = [...gallery];
    updated[idx][field] = val;
    setGallery(updated);
    setIsDirty(true);
  };
  const removeGalleryItem = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  const addTimelinePhase = () => {
    setTimeline([...timeline, { date: '2026', title: 'New Phase', description: 'Phase description...', status: 'Planned' }]);
    setIsDirty(true);
  };
  const updateTimelinePhase = (idx: number, field: string, val: any) => {
    const updated = [...timeline];
    (updated[idx] as any)[field] = val;
    setTimeline(updated);
    setIsDirty(true);
  };
  const removeTimelinePhase = (idx: number) => {
    setTimeline(timeline.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground font-mono">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
        Loading Case Study Editor...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Save Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/projects"
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
            <h1 className="text-xl font-bold text-foreground">
              {projectId ? `Edit Case Study: ${title || 'Untitled'}` : 'Create Technical Case Study'}
            </h1>
            <p className="text-xs text-muted-foreground">Configure architecture, metrics, tech stack, and dev timeline.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {slug && (
            <a href={`/projects/${slug}`} target="_blank" rel="noreferrer">
              <Button type="button" variant="outline" size="sm">
                <Eye className="w-4 h-4" /> Live Preview
              </Button>
            </a>
          )}
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : projectId ? 'Update Case Study' : 'Save & Publish Case Study'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Editor Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-surface border border-border">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'basic' ? 'bg-primary text-primary-foreground font-bold shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> 1. Basic & Hero
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'architecture' ? 'bg-primary text-primary-foreground font-bold shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> 2. Architecture & Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tech')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'tech' ? 'bg-primary text-primary-foreground font-bold shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> 3. Categorized Tech Stack
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'features' ? 'bg-primary text-primary-foreground font-bold shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> 4. Metrics & Features
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'timeline' ? 'bg-primary text-primary-foreground font-bold shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Compass className="w-3.5 h-3.5" /> 5. Screenshots & Timeline
        </button>
      </div>

      {/* ─── TAB 1: BASIC & HERO ────────────────────────────────────────── */}
      {activeTab === 'basic' && (
        <Card variant="glass" padding="md" className="space-y-6">
          <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">Hero Header & Primary Metadata</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase flex justify-between">
                <span>Project Title *</span>
                {fieldErrors.title && <span className="text-rose-400 normal-case">{fieldErrors.title}</span>}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleChange(setTitle, e.target.value)}
                placeholder="e.g. AutoOps AI"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Slug URL</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleChange(setSlug, e.target.value)}
                placeholder="e.g. autoops-ai"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase flex justify-between">
              <span>Tagline / Subtitle *</span>
              {fieldErrors.subtitle && <span className="text-rose-400 normal-case">{fieldErrors.subtitle}</span>}
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => handleChange(setSubtitle, e.target.value)}
              placeholder="e.g. An AI-powered business automation platform that executes multi-step workflows..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => handleChange(setCategory, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:outline-none"
              >
                <option value="AI / Automation">AI / Automation</option>
                <option value="Web Development">Web Development</option>
                <option value="Web3">Web3</option>
                <option value="DevOps">DevOps</option>
                <option value="Full-Stack SaaS">Full-Stack SaaS</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => handleChange(setStatus, e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:outline-none"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Planned">Planned</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Progress ({progress}%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => handleChange(setProgress, Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Date Range</span>
                <span className="text-[10px] text-muted-foreground font-mono">{startDate || 'Start'} — {deadline || 'End'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="month"
                    value={parseMonthToISO(startDate)}
                    onChange={(e) => {
                      const formatted = e.target.value ? formatISOToMonth(e.target.value) : '';
                      handleChange(setStartDate, formatted);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none cursor-pointer"
                    title="Select Start Month & Year from Calendar"
                  />
                </div>
                <div className="relative">
                  <input
                    type="month"
                    value={parseMonthToISO(deadline)}
                    onChange={(e) => {
                      const formatted = e.target.value ? formatISOToMonth(e.target.value) : '';
                      handleChange(setDeadline, formatted);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none cursor-pointer"
                    title="Select Target / Deadline Month & Year from Calendar"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Launch Live Demo URL</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => handleChange(setDemoUrl, e.target.value)}
                placeholder="https://autoops.example.com"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">View Source Code (GitHub URL)</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => handleChange(setGithubUrl, e.target.value)}
                placeholder="https://github.com/ankit/autoops-ai"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Primary Cover / Hero Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => handleChange(setThumbnailUrl, e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => setIsPickerOpen(true)}>
                <ImageIcon className="w-4 h-4" /> Pick Image
              </Button>
            </div>
            {thumbnailUrl && (
              <div className="pt-2">
                <img src={thumbnailUrl} alt="Thumbnail preview" className="h-28 w-auto rounded-lg border border-border object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-border/50">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => handleChange(setFeatured, e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Highlight as Featured Project</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => handleChange(setPublished, e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Published Publicly</span>
            </label>
          </div>
        </Card>
      )}

      {/* ─── TAB 2: ARCHITECTURE & OVERVIEW ────────────────────────────── */}
      {activeTab === 'architecture' && (
        <Card variant="glass" padding="md" className="space-y-6">
          <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">System Architecture & Problem Scope</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase flex justify-between">
              <span>Problem Statement & Scope (Overview) *</span>
              {fieldErrors.overview && <span className="text-rose-400 normal-case">{fieldErrors.overview}</span>}
            </label>
            <textarea
              rows={4}
              value={overview}
              onChange={(e) => handleChange(setOverview, e.target.value)}
              placeholder="Describe the problem, objectives, and scope of the project..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Architectural Design Overview</label>
            <textarea
              rows={5}
              value={architectureOverview}
              onChange={(e) => handleChange(setArchitectureOverview, e.target.value)}
              placeholder="Detail the technical architecture, microservices, data flow, queue mechanisms, or vector stores..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none leading-relaxed"
            />
          </div>
        </Card>
      )}

      {/* ─── TAB 3: CATEGORIZED TECH STACK ────────────────────────────── */}
      {activeTab === 'tech' && (
        <Card variant="glass" padding="md" className="space-y-6">
          <div>
            <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">Categorized Technology Stack</h2>
            <p className="text-xs text-muted-foreground">Enter tags as comma-separated values for each layer (e.g. Next.js 14, TypeScript, Tailwind CSS).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <label className="text-xs font-mono text-primary font-bold uppercase flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Frontend Layer
              </label>
              <input
                type="text"
                value={techFrontend}
                onChange={(e) => handleChange(setTechFrontend, e.target.value)}
                placeholder="Next.js 14, TypeScript, Tailwind CSS, Framer Motion"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <label className="text-xs font-mono text-primary font-bold uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Backend Layer
              </label>
              <input
                type="text"
                value={techBackend}
                onChange={(e) => handleChange(setTechBackend, e.target.value)}
                placeholder="Node.js, LangChain, Express, Redis"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <label className="text-xs font-mono text-primary font-bold uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Database Layer
              </label>
              <input
                type="text"
                value={techDatabase}
                onChange={(e) => handleChange(setTechDatabase, e.target.value)}
                placeholder="PostgreSQL, Prisma ORM, Pinecone Vector DB"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <label className="text-xs font-mono text-primary font-bold uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Infrastructure Layer
              </label>
              <input
                type="text"
                value={techInfra}
                onChange={(e) => handleChange(setTechInfra, e.target.value)}
                placeholder="Docker, Vercel, AWS S3, GitHub Actions"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ─── TAB 4: METRICS & KEY FEATURES ────────────────────────────── */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          {/* Key Performance Metrics */}
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">Key Performance Metrics</h2>
                <p className="text-xs text-muted-foreground">Highlight benchmark statistics (e.g. Speed: 120ms, Active Agents: 14).</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                <Plus className="w-3.5 h-3.5" /> Add Metric
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface border border-border space-y-2 relative group">
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. UPTIME)"
                    className="w-full px-2 py-1 rounded bg-background border border-border text-[10px] font-mono text-muted-foreground uppercase"
                  />
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 99.9%)"
                    className="w-full px-2 py-1 rounded bg-background border border-border text-sm font-bold font-mono text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="absolute top-2 right-2 p-1 text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Key Capabilities & Features */}
          <Card variant="glass" padding="md" className="space-y-4">
            <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">Key Capabilities & Features List</h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Type feature (e.g. Autonomous LLM Agent Task Orchestration) and press Enter..."
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
              />
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>

            <div className="space-y-2">
              {features.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                  <span className="text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {feat}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 5: SCREENSHOTS & TIMELINE ────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Gallery Screenshots */}
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">Visual Screenshots Gallery</h2>
                <p className="text-xs text-muted-foreground">Add screenshot image URLs & captions for the visual gallery.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addGalleryItem}>
                <Plus className="w-3.5 h-3.5" /> Add Image
              </Button>
            </div>

            <div className="space-y-3">
              {gallery.map((g, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface border border-border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-6">
                    <input
                      type="url"
                      value={g.src}
                      onChange={(e) => updateGalleryItem(idx, 'src', e.target.value)}
                      placeholder="Image URL (https://...)"
                      className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs font-mono"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={g.caption}
                      onChange={(e) => updateGalleryItem(idx, 'caption', e.target.value)}
                      placeholder="Caption (e.g. Workflow Canvas)"
                      className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Development Timeline */}
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">Development Timeline</h2>
                <p className="text-xs text-muted-foreground">Define chronological project milestones & release roadmap.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTimelinePhase}>
                <Plus className="w-3.5 h-3.5" /> Add Phase
              </Button>
            </div>

            <div className="space-y-3">
              {timeline.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface border border-border space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => updateTimelinePhase(idx, 'date', e.target.value)}
                        placeholder="Date (e.g. Jul 10, 2026)"
                        className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTimelinePhase(idx, 'title', e.target.value)}
                        placeholder="Milestone Title"
                        className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-center justify-between gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => updateTimelinePhase(idx, 'status', e.target.value)}
                        className="w-full px-2 py-1.5 rounded bg-background border border-border text-xs font-mono"
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Planned">Planned</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTimelinePhase(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateTimelinePhase(idx, 'description', e.target.value)}
                    placeholder="Short description of accomplishments in this phase..."
                    className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </form>
  );
};
