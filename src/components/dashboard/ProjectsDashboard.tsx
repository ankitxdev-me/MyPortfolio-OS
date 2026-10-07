import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { ProjectDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Trash2, Edit3, ExternalLink, Archive, CheckCircle, Copy, Loader2, RefreshCw } from 'lucide-react';

import { PROJECTS_LIST } from '@/data/projectsData';

export const ProjectsDashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.projects.getAll({
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        limit: 100,
        useCache: false,
        includeDrafts: true,
      } as any);

      let rawData: any[] = [];
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          rawData = res.data;
        } else if (Array.isArray((res.data as any).data)) {
          rawData = (res.data as any).data;
        }
      }

      setProjects(rawData);
    } catch (err: any) {
      setProjects([]);
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch projects from MongoDB database.' });
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAction = async (id: string, actionName: 'archive' | 'publish' | 'duplicate' | 'delete') => {
    setActionLoadingId(id);
    setNotification(null);
    try {
      if (actionName === 'archive') {
        setProjects((prev) =>
          prev.map((p) => ((p.id === id || p.slug === id || (p as any)._id === id) ? { ...p, status: 'Planned', published: false } : p))
        );
        await apiClient.projects.archive(id);
        setNotification({ type: 'success', message: 'Project unpublished/archived successfully' });
      } else if (actionName === 'publish') {
        setProjects((prev) =>
          prev.map((p) => ((p.id === id || p.slug === id || (p as any)._id === id) ? { ...p, status: 'Completed', published: true } : p))
        );
        await apiClient.projects.publish(id);
        setNotification({ type: 'success', message: 'Project published successfully' });
      } else if (actionName === 'duplicate') {
        const target = projects.find((p) => p.id === id || p.slug === id || (p as any)._id === id);
        if (target) {
          const tempCopy: ProjectDTO = {
            ...target,
            id: `temp-${Date.now()}`,
            title: `${target.title} (Copy)`,
            slug: `${target.slug}-copy-${Date.now().toString(36)}`,
          };
          setProjects((prev) => [tempCopy, ...prev]);
        }
        await apiClient.projects.duplicate(id);
        setNotification({ type: 'success', message: 'Project duplicated successfully!' });
        await fetchProjects();
      } else if (actionName === 'delete') {
        if (!confirm('Are you sure you want to delete this project?')) {
          setActionLoadingId(null);
          return;
        }
        setProjects((prev) => prev.filter((p) => p.id !== id && p.slug !== id && (p as any)._id !== id));
        setNotification({ type: 'success', message: 'Project deleted successfully from MongoDB!' });
        await apiClient.projects.delete(id);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || `Failed to ${actionName} project` });
      await fetchProjects();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects Case Studies CMS</h1>
          <p className="text-xs text-muted-foreground">Manage project case studies, tech stack badges, architecture details, and live URLs.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchProjects} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <a href="/dashboard/projects/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" /> Create Case Study
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

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search projects..."
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
            <option value="AI / Automation">AI / Automation</option>
            <option value="Web Development">Web Development</option>
            <option value="Full-Stack SaaS">Full-Stack SaaS</option>
            <option value="Web3">Web3</option>
            <option value="DevOps">DevOps</option>
            <option value="Developer Tools">Developer Tools</option>
            <option value="Open Source">Open Source</option>
          </select>
        </div>

        <span className="text-xs font-mono text-muted-foreground">Showing {projects.length} Projects</span>
      </div>

      {/* Data Table */}
      <Card variant="glass" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border font-mono uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Tech Stack</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground font-sans">
              {loading && projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading project case studies from MongoDB...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    No projects found matching current criteria.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id || project.slug} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3.5 font-bold flex items-center gap-2">
                      <span className="text-foreground">{project.title}</span>
                      {project.featured && <Badge variant="primary" size="sm">Featured</Badge>}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">{project.category || 'General'}</td>
                    <td className="px-4 py-3.5 font-mono">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(Array.isArray(project.techStack)
                          ? project.techStack
                          : [
                              ...(project.techStack?.frontend || []),
                              ...(project.techStack?.backend || []),
                              ...(project.techStack?.database || []),
                              ...(project.techStack?.infrastructure || []),
                            ]
                        ).slice(0, 4).map((tech, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">
                      {(() => {
                        const isPub = project.published !== undefined ? project.published : project.status !== 'Draft';
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
                        <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors" title="Preview Public Page">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a href={`/dashboard/projects/new?slug=${project.slug}`} className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors" title="Edit Case Study">
                          <Edit3 className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleAction(project.id, 'duplicate')}
                          disabled={actionLoadingId === project.id}
                          className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {(() => {
                          const isPub = project.published !== undefined ? project.published : project.status !== 'Draft';
                          return (
                            <button
                              type="button"
                              onClick={() => handleAction(project.id, isPub ? 'archive' : 'publish')}
                              disabled={actionLoadingId === project.id}
                              className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                              title={isPub ? 'Unpublish (Set to Draft)' : 'Publish to Public Site'}
                            >
                              {isPub ? <Archive className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          );
                        })()}
                        <button
                          type="button"
                          onClick={() => handleAction(project.id, 'delete')}
                          disabled={actionLoadingId === project.id}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                          title="Delete Project"
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
