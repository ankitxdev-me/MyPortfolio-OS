import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { DetailedClientWork } from '@/data/freelanceData';
import { FREELANCE_SERVICES } from '@/data/freelanceData';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const FreelancingDashboard: React.FC = () => {
  const [clientWorkList, setClientWorkList] = useState<DetailedClientWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [duration, setDuration] = useState('4 Weeks');
  const [description, setDescription] = useState('');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Draft'>('Completed');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchClientWork = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.freelancing.getAll({
        query: { includeDrafts: true, useCache: false, limit: 100 } as any,
        useCache: false,
      });
      if (res && res.data) {
        setClientWorkList(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch freelancing client work' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientWork();
  }, [fetchClientWork]);

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setClientName('Global Client');
    setIndustry('Software & AI');
    setDuration('4 Weeks');
    setDescription('Built autonomous workflow automation solution.');
    setDeliverablesInput('API Architecture, Web Dashboard');
    setStatus('Completed');
    setPublished(true);
    setFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: DetailedClientWork & { id?: string; published?: boolean; featured?: boolean }) => {
    setEditId(item.id || item.slug);
    setTitle(item.title || '');
    setClientName(item.clientName || '');
    setIndustry(item.industry || '');
    setDuration(item.duration || '');
    setDescription(item.description || '');
    setDeliverablesInput((item.deliverables || []).join(', '));
    setStatus((item.status as any) || 'Completed');
    setPublished(item.published !== undefined ? item.published : item.status !== 'Draft');
    setFeatured(!!item.featured);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    setSaving(true);
    try {
      const payload: Partial<DetailedClientWork & { published?: boolean; featured?: boolean }> = {
        title,
        clientName,
        industry,
        projectType: 'Full-Stack Integration',
        duration,
        status,
        published,
        featured,
        description,
        deliverables: deliverablesInput.split(',').map((s) => s.trim()).filter(Boolean),
        objectives: [],
        techStack: ['TypeScript', 'Node.js'],
      };

      if (editId) {
        await apiClient.freelancing.update(editId, payload as any);
        setNotification({ type: 'success', message: 'Client work updated successfully' });
        setClientWorkList((prev) =>
          prev.map((item: any) =>
            (item.id || item.slug) === editId ? { ...item, ...payload } : item
          )
        );
      } else {
        const res = await apiClient.freelancing.create(payload as any);
        setNotification({ type: 'success', message: 'Client work created successfully' });
        if (res.data) {
          setClientWorkList((prev) => [res.data, ...prev]);
        }
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to save client work' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client work case study?')) return;

    // Optimistic UI update: remove immediately
    setClientWorkList((prev: any[]) => prev.filter((item) => (item.id || item.slug) !== id));
    setNotification({ type: 'success', message: 'Client work deleted successfully' });

    try {
      await apiClient.freelancing.delete(id);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete client work' });
      await fetchClientWork();
    }
  };

  const handleTogglePublish = async (work: any) => {
    const workId = work.id || work.slug;
    const isCurrentlyPublished = work.published !== undefined ? work.published : work.status !== 'Draft';
    const nextPublished = !isCurrentlyPublished;
    const nextStatus = nextPublished ? 'Completed' : 'Draft';

    // Optimistic UI update
    setClientWorkList((prev: any[]) =>
      prev.map((item) =>
        (item.id || item.slug) === workId
          ? { ...item, published: nextPublished, status: nextStatus }
          : item
      )
    );

    try {
      await apiClient.freelancing.update(workId, {
        published: nextPublished,
        status: nextStatus,
      } as any);
      setNotification({
        type: 'success',
        message: nextPublished ? 'Client case study published to live site' : 'Client case study moved to Draft',
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update publication status' });
      await fetchClientWork();
    }
  };

  const handleDuplicate = async (work: any) => {
    const workId = work.id || work.slug;
    setActionLoadingId(workId);
    try {
      const copyPayload = {
        title: `${work.title} (Copy)`,
        clientName: work.clientName,
        industry: work.industry,
        projectType: work.projectType || 'Full-Stack Integration',
        duration: work.duration,
        status: 'Draft',
        published: false,
        featured: false,
        description: work.description,
        deliverables: work.deliverables || [],
        objectives: work.objectives || [],
        techStack: work.techStack || ['TypeScript', 'Node.js'],
      };

      const res = await apiClient.freelancing.create(copyPayload as any);
      if (res.data) {
        setClientWorkList((prev) => [res.data, ...prev]);
        setNotification({ type: 'success', message: `Duplicated "${work.title}" as Draft` });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to duplicate client work' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Freelancing & Services CMS</h1>
          <p className="text-xs text-muted-foreground">Manage client case studies, service offerings, pricing tiers, and client reviews.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchClientWork} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4" /> Add Client Case Study
          </Button>
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

      {/* Client Projects Table */}
      <Card variant="glass" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border font-mono uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Client / Project</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground font-sans">
              {loading && clientWorkList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading freelancing client work from MongoDB...
                  </td>
                </tr>
              ) : clientWorkList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    No client work case studies found.
                  </td>
                </tr>
              ) : (
                clientWorkList.map((study: any) => {
                  const isPub = study.published !== undefined ? study.published : study.status !== 'Draft';
                  return (
                    <tr key={study.id || study.slug} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="px-4 py-3.5 font-bold">
                        <div className="flex items-center gap-2">
                          <span>{study.clientName}</span>
                          <Badge variant="primary" size="sm">{study.title}</Badge>
                          {study.featured && (
                            <Badge variant="secondary" size="sm" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{study.industry || 'Tech'}</td>
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{study.duration || 'N/A'}</td>
                      <td className="px-4 py-3.5 font-mono">
                        {isPub ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`/freelancing/${study.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                            title="Live Preview"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleTogglePublish(study)}
                            className={`p-1.5 rounded hover:bg-surface transition-colors ${
                              isPub ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'
                            }`}
                            title={isPub ? 'Unpublish (Set to Draft)' : 'Publish to Public Site'}
                          >
                            {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDuplicate(study)}
                            disabled={actionLoadingId === (study.id || study.slug)}
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-foreground transition-colors"
                            title="Duplicate Case Study"
                          >
                            {actionLoadingId === (study.id || study.slug) ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => openEditModal(study)}
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                            title="Edit Case Study"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(study.id || study.slug)}
                            disabled={actionLoadingId === (study.id || study.slug)}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                            title="Delete Case Study"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Services Overview */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Service Offerings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FREELANCE_SERVICES.map((service) => (
            <Card key={service.id} variant="glass" padding="md" className="space-y-2 border-primary/20">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-sm">{service.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
              <span className="text-xs font-mono text-primary font-bold block">{service.features.length} Core Features</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm">
                {editId ? 'Edit Client Case Study' : 'Add Client Case Study'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nexus Fintech Dashboard"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Nexus Fintech Inc."
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Fintech"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> Duration</span>
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 6 Weeks or Jul 2026"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none font-mono"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Deliverables (comma separated)</label>
                <input
                  type="text"
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  placeholder="Analytics Canvas, Billing Integration"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* Checkboxes for Published and Featured */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded bg-background border-border text-primary focus:ring-primary"
                  />
                  <span>Published (Visible to public)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded bg-background border-border text-primary focus:ring-primary"
                  />
                  <span>Featured Case Study</span>
                </label>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {saving ? 'Saving...' : 'Save Case Study'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
