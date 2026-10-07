import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { MilestoneDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit3, Trash2, Loader2, RefreshCw, Copy, X } from 'lucide-react';

export const JourneyDashboard: React.FC = () => {
  const [milestones, setMilestones] = useState<MilestoneDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [period, setPeriod] = useState('2026');
  const [type, setType] = useState<'experience' | 'education' | 'achievement' | 'leadership'>('experience');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.journey.getAll();
      if (res && res.data) {
        setMilestones(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch milestones' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setOrganization('Self-Employed / Independent');
    setRole('Lead Systems Engineer');
    setPeriod(new Date().getFullYear().toString());
    setType('experience');
    setDescription('Architected and launched Portfolio OS production CMS.');
    setIsModalOpen(true);
  };

  const openEditModal = (m: MilestoneDTO) => {
    setEditId(m.id);
    setTitle(m.title || '');
    setOrganization(m.organization || '');
    setRole(m.role || '');
    setPeriod(m.period || '');
    setType(m.type || 'experience');
    setDescription(m.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const payload: Partial<MilestoneDTO> = {
        title,
        organization,
        role,
        period,
        type,
        description,
      };

      if (editId) {
        await apiClient.journey.update(editId, payload);
        setNotification({ type: 'success', message: 'Milestone updated successfully' });
      } else {
        await apiClient.journey.create(payload as any);
        setNotification({ type: 'success', message: 'Milestone created successfully' });
      }

      setIsModalOpen(false);
      await fetchMilestones();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to save milestone' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    setActionLoadingId(id);
    try {
      await apiClient.journey.delete(id);
      setNotification({ type: 'success', message: 'Milestone deleted successfully' });
      await fetchMilestones();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete milestone' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setActionLoadingId(id);
    try {
      await apiClient.journey.duplicate(id);
      setNotification({ type: 'success', message: 'Milestone duplicated successfully' });
      await fetchMilestones();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to duplicate milestone' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Career Journey CMS</h1>
          <p className="text-xs text-muted-foreground">Manage career timeline milestones, professional growth events, and lessons learned.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMilestones} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4" /> Add Milestone Event
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

      {/* Milestones List Table */}
      <Card variant="glass" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border font-mono uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Year / Period</th>
                <th className="px-4 py-3">Milestone Title</th>
                <th className="px-4 py-3">Organization & Role</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground font-sans">
              {loading && milestones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading milestone events from MongoDB...
                  </td>
                </tr>
              ) : milestones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    No milestone events found.
                  </td>
                </tr>
              ) : (
                milestones.map((ms) => (
                  <tr key={ms.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-primary font-bold">{ms.period || '2026'}</td>
                    <td className="px-4 py-3.5 font-bold">{ms.title}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{ms.organization} — {ms.role}</td>
                    <td className="px-4 py-3.5 font-mono">
                      <Badge variant="primary" size="sm">{ms.type}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(ms)}
                          className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                          title="Edit Milestone"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(ms.id)}
                          disabled={actionLoadingId === ms.id}
                          className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                          title="Duplicate Milestone"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ms.id)}
                          disabled={actionLoadingId === ms.id}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                          title="Delete Milestone"
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm">
                {editId ? 'Edit Milestone Event' : 'Add Milestone Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Role / Position</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Period / Year</label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none"
                  >
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                    <option value="achievement">Achievement</option>
                    <option value="leadership">Leadership</option>
                  </select>
                </div>
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

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {saving ? 'Saving...' : 'Save Milestone'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
