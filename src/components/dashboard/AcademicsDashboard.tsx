import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { AcademicSemesterDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const AcademicsDashboard: React.FC = () => {
  const [semesters, setSemesters] = useState<AcademicSemesterDTO[]>([]);
  const [summary, setSummary] = useState<{ overallGpa: number; totalCredits: number; completedSemesters: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState(1); // 1, 2, 3, 4
  const [semesterInYear, setSemesterInYear] = useState<1 | 2>(1); // 1 or 2
  const [semesterNumber, setSemesterNumber] = useState(1); // 1 - 8
  const [semesterName, setSemesterName] = useState('Semester 1');
  const [term, setTerm] = useState('Fall 2023');
  const [year, setYear] = useState(2023);
  const [gpa, setGpa] = useState(9.0);
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Draft'>('Completed');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAcademics = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, summaryRes] = await Promise.all([
        apiClient.academics.getAll({
          query: { includeDrafts: true, useCache: false, limit: 100 } as any,
          useCache: false,
        }),
        apiClient.academics.getSummary().catch(() => null),
      ]);

      if (listRes && listRes.data) {
        // Sort ascending by semesterNumber
        const sorted = [...listRes.data].sort((a: any, b: any) => {
          const numA = Number(a.semesterNumber) || (a.title?.match(/\d+/)?.[0] ? Number(a.title.match(/\d+/)?.[0]) : 0);
          const numB = Number(b.semesterNumber) || (b.title?.match(/\d+/)?.[0] ? Number(b.title.match(/\d+/)?.[0]) : 0);
          return numA - numB;
        });
        setSemesters(sorted);
      }
      if (summaryRes && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch academic records' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademics();
  }, [fetchAcademics]);

  const onYearOrSemChange = (newYear: number, newSemInYear: 1 | 2) => {
    const totalSemNum = (newYear - 1) * 2 + newSemInYear;
    setAcademicYear(newYear);
    setSemesterInYear(newSemInYear);
    setSemesterNumber(totalSemNum);
    setSemesterName(`Semester ${totalSemNum}`);
    const calendarYear = 2022 + newYear;
    setYear(calendarYear);
    setTerm(newSemInYear === 1 ? `Fall ${calendarYear - 1}` : `Spring ${calendarYear}`);
  };

  const openCreateModal = () => {
    setEditId(null);
    const nextSemNum = Math.min(8, semesters.length + 1);
    const calcYear = Math.ceil(nextSemNum / 2) || 1;
    const calcSemInYear = (nextSemNum % 2 === 1 ? 1 : 2) as 1 | 2;
    onYearOrSemChange(calcYear, calcSemInYear);
    setGpa(9.0);
    setStatus('Completed');
    setPublished(true);
    setFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (sem: AcademicSemesterDTO) => {
    setEditId(sem.id);
    const sNum = (sem as any).semesterNumber || (sem.semesterName?.match(/\d+/)?.[0] ? Number(sem.semesterName.match(/\d+/)?.[0]) : 1);
    const calcYear = Math.ceil(sNum / 2) || 1;
    const calcSemInYear = (sNum % 2 === 1 ? 1 : 2) as 1 | 2;

    setAcademicYear(calcYear);
    setSemesterInYear(calcSemInYear);
    setSemesterNumber(sNum);
    setSemesterName(sem.semesterName || (sem as any).title || `Semester ${sNum}`);
    setTerm(sem.term || '');
    setYear(sem.year || 2026);
    setGpa(sem.gpa || (sem as any).sgpa || 0);
    setStatus((sem.status as any) || 'Completed');
    setPublished(sem.published !== undefined ? sem.published : sem.status !== 'Draft');
    setFeatured(!!sem.featured);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterName.trim()) return;

    setSaving(true);
    try {
      const payload: any = {
        semesterNumber: Number(semesterNumber),
        semesterName,
        title: semesterName,
        term,
        year: Number(year),
        gpa: Number(gpa),
        sgpa: Number(gpa),
        status,
        published,
        featured,
        courses: [],
      };

      if (editId) {
        await apiClient.academics.update(editId, payload);
        setNotification({ type: 'success', message: 'Semester record updated successfully' });
        setSemesters((prev) =>
          [...prev.map((item) => (item.id === editId ? { ...item, ...payload } : item))].sort((a: any, b: any) => (a.semesterNumber || 0) - (b.semesterNumber || 0))
        );
      } else {
        const res = await apiClient.academics.create(payload);
        setNotification({ type: 'success', message: 'Semester record created successfully' });
        if (res.data) {
          setSemesters((prev) => [...prev, res.data].sort((a: any, b: any) => (a.semesterNumber || 0) - (b.semesterNumber || 0)));
        }
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to save academic record' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this semester record?')) return;

    // Optimistic UI update
    setSemesters((prev) => prev.filter((item) => item.id !== id));
    setNotification({ type: 'success', message: 'Semester record deleted successfully' });

    try {
      await apiClient.academics.delete(id);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete semester record' });
      await fetchAcademics();
    }
  };

  const handleTogglePublish = async (sem: AcademicSemesterDTO) => {
    const semId = sem.id;
    const isCurrentlyPublished = sem.published !== undefined ? sem.published : sem.status !== 'Draft';
    const nextPublished = !isCurrentlyPublished;
    const nextStatus = nextPublished ? 'Completed' : 'Draft';

    // Optimistic UI update
    setSemesters((prev) =>
      prev.map((item) =>
        item.id === semId
          ? { ...item, published: nextPublished, status: nextStatus }
          : item
      )
    );

    try {
      await apiClient.academics.update(semId, {
        published: nextPublished,
        status: nextStatus,
      } as any);
      setNotification({
        type: 'success',
        message: nextPublished ? 'Semester record published to live site' : 'Semester record moved to Draft',
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update publication status' });
      await fetchAcademics();
    }
  };

  const handleDuplicate = async (sem: AcademicSemesterDTO) => {
    setActionLoadingId(sem.id);
    try {
      const copyPayload = {
        semesterNumber: (sem as any).semesterNumber || 1,
        semesterName: `${sem.semesterName || sem.title || 'Semester'} (Copy)`,
        title: `${sem.semesterName || sem.title || 'Semester'} (Copy)`,
        term: sem.term,
        year: sem.year,
        gpa: sem.gpa || (sem as any).sgpa || 0,
        sgpa: sem.gpa || (sem as any).sgpa || 0,
        status: 'Draft',
        published: false,
        featured: false,
        courses: sem.courses || [],
      };

      const res = await apiClient.academics.create(copyPayload as any);
      if (res.data) {
        setSemesters((prev) => [...prev, res.data].sort((a: any, b: any) => (a.semesterNumber || 0) - (b.semesterNumber || 0)));
        setNotification({ type: 'success', message: `Duplicated "${sem.semesterName || sem.title}" as Draft` });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to duplicate semester record' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const calculatedCgpa = summary?.overallGpa ?? (
    semesters.length > 0
      ? (semesters.reduce((acc, s) => acc + (s.gpa || (s as any).sgpa || 0), 0) / semesters.length).toFixed(2)
      : '8.9'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academics & CGPA CMS</h1>
          <p className="text-xs text-muted-foreground">Manage degree details, semester SGPA history, coursework grades, and academic trajectory.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAcademics} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4" /> Add Semester Record
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

      {/* Quick Overview Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
          <span className="text-xs font-mono text-muted-foreground uppercase">Cumulative CGPA</span>
          <p className="text-2xl font-extrabold font-mono text-primary">{calculatedCgpa} / 10.0</p>
        </Card>

        <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
          <span className="text-xs font-mono text-muted-foreground uppercase">Degree Program</span>
          <p className="text-sm font-bold text-foreground">B.Tech in Computer Science & Engineering</p>
        </Card>

        <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
          <span className="text-xs font-mono text-muted-foreground uppercase">Total Semesters</span>
          <p className="text-2xl font-extrabold font-mono text-foreground">{semesters.length} Recorded</p>
        </Card>
      </div>

      {/* Semesters Table */}
      <Card variant="glass" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border font-mono uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order / Semester</th>
                <th className="px-4 py-3">Term Period</th>
                <th className="px-4 py-3">SGPA Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground font-sans">
              {loading && semesters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading academic records from MongoDB...
                  </td>
                </tr>
              ) : semesters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                    No academic records found.
                  </td>
                </tr>
              ) : (
                semesters.map((sem) => {
                  const isPub = sem.published !== undefined ? sem.published : sem.status !== 'Draft';
                  const sNum = (sem as any).semesterNumber || (sem.semesterName?.match(/\d+/)?.[0] ? sem.semesterName.match(/\d+/)?.[0] : '-');
                  return (
                    <tr key={sem.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="px-4 py-3.5 font-bold">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-[11px]">
                            Sem {sNum}
                          </span>
                          <span>{sem.semesterName || (sem as any).title}</span>
                          {sem.featured && (
                            <Badge variant="secondary" size="sm" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{sem.term || `${sem.year}`}</td>
                      <td className="px-4 py-3.5 font-mono text-primary font-bold">{sem.gpa || (sem as any).sgpa} / 10</td>
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
                          <button
                            onClick={() => handleTogglePublish(sem)}
                            className={`p-1.5 rounded hover:bg-surface transition-colors ${
                              isPub ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'
                            }`}
                            title={isPub ? 'Unpublish (Set to Draft)' : 'Publish to Public Site'}
                          >
                            {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDuplicate(sem)}
                            disabled={actionLoadingId === sem.id}
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-foreground transition-colors"
                            title="Duplicate Semester"
                          >
                            {actionLoadingId === sem.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => openEditModal(sem)}
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                            title="Edit Semester"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(sem.id)}
                            disabled={actionLoadingId === sem.id}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                            title="Delete Semester"
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm">
                {editId ? 'Edit Semester Record' : 'Add Semester Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              {/* Year & Semester in Year Selection (2 Sems per Year) */}
              <div className="p-3 rounded-lg bg-surface/60 border border-border space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">Degree Year</label>
                    <select
                      value={academicYear}
                      onChange={(e) => onYearOrSemChange(Number(e.target.value), semesterInYear)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:outline-none"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">Semester (2 / Year)</label>
                    <select
                      value={semesterInYear}
                      onChange={(e) => onYearOrSemChange(academicYear, Number(e.target.value) as 1 | 2)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:outline-none"
                    >
                      <option value={1}>1st Sem of Year (Odd)</option>
                      <option value={2}>2nd Sem of Year (Even)</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs font-mono text-primary flex items-center justify-between pt-1 border-t border-border/40">
                  <span>Calculated Order:</span>
                  <span className="font-extrabold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    Semester {semesterNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Term Name</label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. Fall 2025"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Calendar Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">SGPA Score (0 - 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={gpa}
                    onChange={(e) => setGpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono font-bold"
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

              {/* Checkboxes for Published and Featured */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded bg-background border-border text-primary focus:ring-primary"
                  />
                  <span>Published (Visible on live site)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded bg-background border-border text-primary focus:ring-primary"
                  />
                  <span>Featured Semester</span>
                </label>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {saving ? 'Saving...' : 'Save Semester'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
