import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { CourseDTO, CertificateDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  RefreshCw,
  Copy,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Star,
  Compass,
  Clock,
  Award,
  ExternalLink,
  Pin,
} from 'lucide-react';

const formatDate = (dateStr?: string) => {
  if (!dateStr || dateStr.toLowerCase() === 'in progress') return '';
  try {
    const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = clean.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    }
    return clean;
  } catch {
    return dateStr.split('T')[0];
  }
};

export const LearningDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates'>('courses');

  // --- Courses State ---
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Course Form Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseEditId, setCourseEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('Web Dev');
  const [progressPercent, setProgressPercent] = useState(50);
  const [status, setStatus] = useState<string>('In Progress');
  const [startDate, setStartDate] = useState('');
  const [targetCompletion, setTargetCompletion] = useState('');
  const [topicsInput, setTopicsInput] = useState('');
  const [timeline, setTimeline] = useState<{ date: string; title: string; description: string }[]>([]);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [isTopSkill, setIsTopSkill] = useState(false);
  const [courseSaving, setCourseSaving] = useState(false);

  // --- Certificates State ---
  const [certificates, setCertificates] = useState<CertificateDTO[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certEditId, setCertEditId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [certCategory, setCertCategory] = useState('Cloud & DevOps');
  const [certPublished, setCertPublished] = useState(true);
  const [certSaving, setCertSaving] = useState(false);

  // Fetch Courses
  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const res = await apiClient.learning.getAll({
        query: { useCache: false, limit: 100 } as any,
        useCache: false,
      });
      if (res && res.data) {
        setCourses(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch learning items' });
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  // Fetch Certificates
  const fetchCertificates = useCallback(async () => {
    setCertsLoading(true);
    try {
      const res = await apiClient.certificates.getAll({
        query: { useCache: false, limit: 100 } as any,
        useCache: false,
      });
      if (res && res.data) {
        setCertificates(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch certificates' });
    } finally {
      setCertsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCertificates();
  }, [fetchCourses, fetchCertificates]);

  // --- Course Handlers ---
  const openCreateCourseModal = () => {
    setCourseEditId(null);
    setTitle('');
    setDescription('');
    setPlatform('Coursera');
    setInstructor('Self-Paced / Lead Architect');
    setCategory('Web Dev');
    setProgressPercent(50);
    setStatus('In Progress');
    setStartDate(new Date().toISOString().split('T')[0]);
    setTargetCompletion('');
    setTopicsInput('React, Node.js, Architecture');
    setTimeline([]);
    setPublished(true);
    setFeatured(false);
    setIsTopSkill(false);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (c: CourseDTO) => {
    setCourseEditId(c.id);
    setTitle(c.title || c.name || '');
    setDescription(c.description || (c as any).reason || '');
    setPlatform(c.platform || 'Self-Paced');
    setInstructor(c.instructor || 'Lead Architect');
    setCategory(c.category || 'Web Dev');
    setProgressPercent(c.progressPercent ?? c.proficiency ?? 50);

    let initStatus = c.status || 'In Progress';
    const lower = initStatus.toLowerCase();
    if (lower === 'mastered' || lower === 'completed') initStatus = 'Mastered';
    else if (lower === 'planned') initStatus = 'Planned';
    else if (lower === 'exploring') initStatus = 'Exploring';
    else if (lower === 'draft') initStatus = 'Draft';
    else if (lower.includes('progress') || lower.includes('learning')) initStatus = 'In Progress';
    setStatus(initStatus);

    const rawStart = c.startDate || (c as any).startedDate || '';
    const rawTarget = c.targetCompletion || c.completedDate || (c as any).completedDate || '';
    setStartDate(rawStart.includes('T') ? rawStart.split('T')[0] : rawStart);
    setTargetCompletion(rawTarget.includes('T') ? rawTarget.split('T')[0] : rawTarget);

    setTopicsInput((c.topics || []).join(', '));
    setTimeline((c.timeline || []).map((t) => ({ date: t.date || '', title: t.title || '', description: t.description || '' })));
    setPublished(c.published !== undefined ? c.published : c.status !== 'Draft' && c.status !== 'draft');
    setFeatured(!!c.featured);
    setIsTopSkill(!!c.isTopSkill);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCourseSaving(true);
    try {
      const payload: Partial<CourseDTO> & Record<string, any> = {
        title,
        name: title,
        description,
        platform,
        instructor,
        category,
        progressPercent: Number(progressPercent),
        proficiency: Number(progressPercent),
        status,
        published,
        featured,
        isTopSkill,
        startDate,
        targetCompletion,
        startedDate: startDate,
        completedDate: targetCompletion,
        topics: topicsInput.split(',').map((s) => s.trim()).filter(Boolean),
        timeline: timeline.filter((t) => t.title.trim() || t.date.trim()),
      };

      if (courseEditId) {
        await apiClient.learning.update(courseEditId, payload as any);
        setNotification({ type: 'success', message: 'Course updated successfully' });
        setCourses((prev) =>
          prev.map((item) =>
            item.id === courseEditId ? { ...item, ...payload } : item
          )
        );
      } else {
        const res = await apiClient.learning.create(payload as any);
        setNotification({ type: 'success', message: 'Course created successfully' });
        if (res.data) {
          setCourses((prev) => [res.data, ...prev]);
        }
      }

      setIsCourseModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to save course' });
    } finally {
      setCourseSaving(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this learning item?')) return;

    setCourses((prev) => prev.filter((item) => item.id !== id));
    setNotification({ type: 'success', message: 'Course deleted successfully' });

    try {
      await apiClient.learning.delete(id);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete course' });
      await fetchCourses();
    }
  };

  const handleTogglePublishCourse = async (course: CourseDTO) => {
    const courseId = course.id;
    const isCurrentlyPublished = course.published !== undefined ? course.published : (course.status !== 'Draft' && course.status !== 'draft');
    const nextPublished = !isCurrentlyPublished;
    const nextStatus = nextPublished ? 'In Progress' : 'Draft';

    setCourses((prev) =>
      prev.map((item) =>
        item.id === courseId
          ? { ...item, published: nextPublished, status: nextStatus }
          : item
      )
    );

    try {
      await apiClient.learning.update(courseId, {
        published: nextPublished,
        status: nextStatus,
      } as any);
      setNotification({
        type: 'success',
        message: nextPublished ? 'Course published to live site' : 'Course moved to Draft',
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update publication status' });
      await fetchCourses();
    }
  };

  const handleToggleFeatured = async (course: CourseDTO) => {
    const courseId = course.id;
    const nextFeatured = !course.featured;

    setCourses((prev) =>
      prev.map((item) =>
        item.id === courseId
          ? { ...item, featured: nextFeatured }
          : item
      )
    );

    try {
      await apiClient.learning.update(courseId, {
        featured: nextFeatured,
      } as any);
      setNotification({
        type: 'success',
        message: nextFeatured ? 'Marked as Featured (Shown in Upper Section)' : 'Removed from Featured',
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update featured status' });
      await fetchCourses();
    }
  };

  const handleToggleTopSkill = async (course: CourseDTO) => {
    const courseId = course.id;
    const nextTopSkill = !course.isTopSkill;

    setCourses((prev) =>
      prev.map((item) =>
        item.id === courseId
          ? { ...item, isTopSkill: nextTopSkill }
          : item
      )
    );

    try {
      await apiClient.learning.update(courseId, {
        isTopSkill: nextTopSkill,
      } as any);
      setNotification({
        type: 'success',
        message: nextTopSkill ? 'Course pinned to top of /learning page directory' : 'Unpinned from /learning page',
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update Pin status' });
      await fetchCourses();
    }
  };

  const handleDuplicateCourse = async (course: CourseDTO) => {
    setActionLoadingId(course.id);
    try {
      const courseTitle = course.title || course.name || 'Course';
      const copyPayload = {
        title: `${courseTitle} (Copy)`,
        name: `${courseTitle} (Copy)`,
        description: course.description || '',
        platform: course.platform || 'Self-Paced',
        instructor: course.instructor || 'Lead Architect',
        category: course.category || 'Web Dev',
        progressPercent: course.progressPercent ?? course.proficiency ?? 50,
        proficiency: course.progressPercent ?? course.proficiency ?? 50,
        status: 'Draft',
        published: false,
        featured: false,
        isTopSkill: !!course.isTopSkill,
        startDate: course.startDate,
        targetCompletion: course.targetCompletion,
        topics: course.topics || [],
        timeline: course.timeline || [],
      };

      const res = await apiClient.learning.create(copyPayload as any);
      if (res.data) {
        setCourses((prev) => [res.data, ...prev]);
        setNotification({ type: 'success', message: `Duplicated "${courseTitle}" as Draft` });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to duplicate course' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- Certificate Handlers ---
  const openCreateCertModal = () => {
    setCertEditId(null);
    setCertTitle('');
    setCertIssuer('');
    setCertIssueDate(new Date().getFullYear().toString());
    setCertCredentialId('');
    setCertUrl('');
    setCertCategory('Cloud & DevOps');
    setCertPublished(true);
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (cert: CertificateDTO) => {
    setCertEditId(cert.id);
    setCertTitle(cert.title);
    setCertIssuer(cert.issuer);
    setCertIssueDate(cert.issueDate || '');
    setCertCredentialId(cert.credentialId || '');
    setCertUrl(cert.url || '');
    setCertCategory(cert.category || 'Cloud & DevOps');
    setCertPublished(cert.published !== false);
    setIsCertModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;

    setCertSaving(true);
    try {
      const payload: Partial<CertificateDTO> = {
        title: certTitle,
        issuer: certIssuer,
        issueDate: certIssueDate,
        credentialId: certCredentialId,
        url: certUrl,
        category: certCategory,
        published: certPublished,
      };

      if (certEditId) {
        await apiClient.certificates.update(certEditId, payload as any);
        setNotification({ type: 'success', message: 'Certificate updated successfully' });
        setCertificates((prev) =>
          prev.map((item) =>
            item.id === certEditId ? { ...item, ...payload } : item
          )
        );
      } else {
        const res = await apiClient.certificates.create(payload as any);
        setNotification({ type: 'success', message: 'Certificate added successfully' });
        if (res.data) {
          setCertificates((prev) => [res.data, ...prev]);
        }
      }

      setIsCertModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to save certificate' });
    } finally {
      setCertSaving(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    setCertificates((prev) => prev.filter((item) => item.id !== id));
    setNotification({ type: 'success', message: 'Certificate deleted successfully' });

    try {
      await apiClient.certificates.delete(id);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete certificate' });
      await fetchCertificates();
    }
  };

  const handleTogglePublishCert = async (cert: CertificateDTO) => {
    const certId = cert.id;
    const nextPublished = cert.published === false ? true : false;

    setCertificates((prev) =>
      prev.map((item) =>
        item.id === certId ? { ...item, published: nextPublished } : item
      )
    );

    try {
      await apiClient.certificates.update(certId, {
        published: nextPublished,
      } as any);
      setNotification({
        type: 'success',
        message: nextPublished ? 'Certificate published to live site' : 'Certificate hidden from visitors',
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update publication status' });
      await fetchCertificates();
    }
  };

  // Course Metrics
  const totalCoursesCount = courses.length;
  const completedCount = courses.filter((c) => {
    const s = c.status?.toLowerCase() || '';
    return s === 'completed' || s === 'mastered';
  }).length;
  const featuredCount = courses.filter((c) => c.featured === true).length;
  const topSkillsCount = courses.filter((c) => c.isTopSkill === true).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learning & Certifications CMS</h1>
          <p className="text-xs text-muted-foreground">Manage active courses, homepage skills placement, and verified professional certificates.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchCourses();
              fetchCertificates();
            }}
            disabled={coursesLoading || certsLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${coursesLoading || certsLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          {activeTab === 'courses' ? (
            <Button variant="primary" size="sm" onClick={openCreateCourseModal}>
              <Plus className="w-4 h-4" /> Add Course / Track
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={openCreateCertModal}>
              <Award className="w-4 h-4" /> Add Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === 'courses'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Courses & Skill Tracks ({courses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === 'certificates'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" /> Certifications & Credentials ({certificates.length})
        </button>
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

      {/* ─── TAB 1: COURSES & SKILLS ─── */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Overview Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
              <span className="text-xs font-mono text-muted-foreground uppercase">Total Courses</span>
              <p className="text-2xl font-extrabold font-mono text-foreground">{totalCoursesCount}</p>
            </Card>

            <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
              <span className="text-xs font-mono text-muted-foreground uppercase">Featured (Upper)</span>
              <p className="text-2xl font-extrabold font-mono text-amber-400">{featuredCount}</p>
            </Card>

            <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
              <span className="text-xs font-mono text-muted-foreground uppercase">Pinned Tracks</span>
              <p className="text-2xl font-extrabold font-mono text-purple-400">{topSkillsCount}</p>
            </Card>

            <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
              <span className="text-xs font-mono text-muted-foreground uppercase">Mastered / Completed</span>
              <p className="text-2xl font-extrabold font-mono text-emerald-400">{completedCount}</p>
            </Card>
          </div>

          {/* Active Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursesLoading && courses.length === 0 ? (
              <div className="col-span-2 p-12 text-center text-muted-foreground font-mono">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                Loading courses from MongoDB...
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-muted-foreground font-mono">
                No active courses or learning topics found. Click "Add Course / Track" to create one.
              </div>
            ) : (
              courses.map((course) => {
                const courseTitle = course.title || course.name || 'Untitled Course';
                const percent = course.progressPercent ?? course.proficiency ?? 50;
                const isPub = course.published !== undefined ? course.published : (course.status !== 'Draft' && course.status !== 'draft');
                const normalizedStatus = (course.status || 'In Progress').toLowerCase();

                const startFormatted = formatDate(course.startDate || (course as any).startedDate);
                const targetFormatted = formatDate(course.targetCompletion || (course as any).completedDate);

                return (
                  <Card key={course.id} variant="glass" padding="md" className="space-y-4 border-primary/20 flex flex-col justify-between hover:border-primary/40 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="primary" size="sm" className="font-mono text-[10px]">{course.platform || 'Self-Paced'}</Badge>
                          {course.category && (
                            <span className="px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground font-mono text-[10px]">
                              {course.category}
                            </span>
                          )}

                          {/* Status Badges */}
                          {normalizedStatus.includes('master') || normalizedStatus.includes('complete') ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold font-mono">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mastered
                            </span>
                          ) : normalizedStatus.includes('plan') ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-semibold font-mono">
                              <Calendar className="w-3 h-3 text-blue-400" /> Planned
                            </span>
                          ) : normalizedStatus.includes('explor') ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-semibold font-mono">
                              <Compass className="w-3 h-3 text-purple-400" /> Exploring
                            </span>
                          ) : normalizedStatus.includes('draft') ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-semibold font-mono">
                              Draft
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[10px] font-semibold font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" /> In Progress
                            </span>
                          )}

                          {course.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold font-mono">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Featured Upper
                            </span>
                          )}
                          {course.isTopSkill && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold font-mono">
                              <Pin className="w-3 h-3 text-amber-400 fill-amber-400" /> Pinned Track
                            </span>
                          )}
                          {isPub ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
                            </span>
                          ) : null}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Featured Quick Toggle */}
                          <button
                            onClick={() => handleToggleFeatured(course)}
                            className={`p-1.5 rounded hover:bg-surface transition-colors ${
                              course.featured ? 'text-amber-400' : 'text-muted-foreground hover:text-amber-400'
                            }`}
                            title={course.featured ? 'Remove from Featured Upper Section' : 'Feature in Upper Section (Homepage)'}
                          >
                            <Star className={`w-3.5 h-3.5 ${course.featured ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Pin to Learning Page Quick Toggle */}
                          <button
                            onClick={() => handleToggleTopSkill(course)}
                            className={`p-1.5 rounded hover:bg-surface transition-colors ${
                              course.isTopSkill ? 'text-amber-400' : 'text-muted-foreground hover:text-amber-400'
                            }`}
                            title={course.isTopSkill ? 'Unpin from top of /learning page' : 'Pin to top of /learning page'}
                          >
                            <Pin className={`w-3.5 h-3.5 ${course.isTopSkill ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Publish / Draft Toggle */}
                          <button
                            onClick={() => handleTogglePublishCourse(course)}
                            className={`p-1.5 rounded hover:bg-surface transition-colors ${
                              isPub ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'
                            }`}
                            title={isPub ? 'Unpublish (Set to Draft)' : 'Publish to Live Site'}
                          >
                            {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit Modal */}
                          <button
                            onClick={() => openEditCourseModal(course)}
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                            title="Edit Course"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicateCourse(course)}
                            disabled={actionLoadingId === course.id}
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                            title="Duplicate Course"
                          >
                            {actionLoadingId === course.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={actionLoadingId === course.id}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-foreground text-base">{courseTitle}</h3>
                      </div>

                      {/* Motivation / Description Preview */}
                      {course.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-surface/50 p-2 rounded-lg border border-border/50">
                          {course.description}
                        </p>
                      )}

                      {/* Clean Dates */}
                      {(startFormatted || targetFormatted) && (
                        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground pt-0.5">
                          {startFormatted && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-primary" /> Started: {startFormatted}
                            </span>
                          )}
                          {targetFormatted && (
                            <span>Target: {targetFormatted}</span>
                          )}
                        </div>
                      )}

                      {/* Topics List */}
                      {course.topics && course.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {course.topics.slice(0, 4).map((topic, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar Strip */}
                    <div className="space-y-1.5 pt-3 border-t border-border/60">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground capitalize flex items-center gap-1.5">
                          Status: <span className="text-foreground font-semibold">{course.status?.replace('_', ' ')}</span>
                        </span>
                        <span className="text-primary font-extrabold">{percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border/60">
                        <div
                          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                          className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: CERTIFICATIONS & CREDENTIALS ─── */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
              <span className="text-xs font-mono text-muted-foreground uppercase">Total Certificates</span>
              <p className="text-2xl font-extrabold font-mono text-foreground">{certificates.length}</p>
            </Card>
            <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
              <span className="text-xs font-mono text-muted-foreground uppercase">Published Live</span>
              <p className="text-2xl font-extrabold font-mono text-emerald-400">
                {certificates.filter((c) => c.published !== false).length}
              </p>
            </Card>
            <Card variant="glass" padding="md" className="space-y-1 border-primary/20">
              <span className="text-xs font-mono text-muted-foreground uppercase">Issuing Bodies</span>
              <p className="text-2xl font-extrabold font-mono text-primary">
                {new Set(certificates.map((c) => c.issuer)).size}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certsLoading && certificates.length === 0 ? (
              <div className="col-span-2 p-12 text-center text-muted-foreground font-mono">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                Loading certificates from MongoDB...
              </div>
            ) : certificates.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-muted-foreground font-mono bg-card/40 rounded-xl border border-dashed border-border">
                No certificates found. Click "Add Certificate" to register verified credentials.
              </div>
            ) : (
              certificates.map((cert) => {
                const isPub = cert.published !== false;
                return (
                  <Card
                    key={cert.id}
                    variant="glass"
                    padding="md"
                    className="space-y-4 border-primary/20 flex flex-col justify-between hover:border-primary/40 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground text-base leading-snug">{cert.title}</h3>
                            <p className="text-xs font-mono text-primary font-semibold">{cert.issuer}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePublishCert(cert)}
                            className={`p-1.5 rounded hover:bg-surface transition-colors ${
                              isPub ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                            title={isPub ? 'Hide from public visitors' : 'Publish to live site'}
                          >
                            {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => openEditCertModal(cert)}
                            className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-primary transition-colors"
                            title="Edit Certificate"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCert(cert.id)}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs font-mono text-muted-foreground">
                        <span>ID: <strong className="text-foreground">{cert.credentialId || 'Verified'}</strong></span>
                        <span>Issued: <strong className="text-foreground">{cert.issueDate || 'Recent'}</strong></span>
                      </div>
                    </div>

                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline pt-1"
                      >
                        Verification Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── COURSE MODAL ─── */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                {courseEditId ? 'Edit Learning Track' : 'Add Course / Track'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Course / Topic Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & High-Scale Microservices"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                  <span>Motivation & Description (Why started & Timeline)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Short 1-2 sentences</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Mastered Redis & BullMQ to architect low-latency event queues for high-scale microservices."
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Platform</label>
                  <input
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="e.g. Coursera / Self-Paced"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none font-mono"
                  >
                    <option value="Web Dev">Web Dev</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Backend">Backend & Distributed</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Database">Database & Storage</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStatus(val);
                    if (val === 'Mastered' && progressPercent < 100) {
                      setProgressPercent(100);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none font-mono"
                >
                  <option value="In Progress">In Progress (Active Learning)</option>
                  <option value="Mastered">Mastered (Completed)</option>
                  <option value="Planned">Planned (Upcoming Roadmap)</option>
                  <option value="Exploring">Exploring (R&D / Research)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" /> Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" /> Target Completion
                  </label>
                  <input
                    type="date"
                    value={targetCompletion}
                    onChange={(e) => setTargetCompletion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1 p-3 rounded-lg bg-surface/60 border border-border">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground uppercase">Completion Progress / Skill Mastery:</span>
                  <span className="text-primary font-bold text-sm">{progressPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Topics (comma separated)</label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  placeholder="React, Redux, Node.js, GraphQL"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                />
              </div>

              {/* Custom Timeline Milestones Builder */}
              <div className="space-y-3 p-3.5 rounded-lg bg-surface/80 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-foreground">
                      Course Timeline & Milestones
                    </span>
                    <p className="text-[11px] text-muted-foreground">Add custom roadmap phases, milestone checkpoints, or syllabus deadlines.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTimeline([...timeline, { date: '', title: '', description: '' }])}
                    className="text-xs font-mono"
                  >
                    <Plus className="w-3 h-3" /> Add Milestone
                  </Button>
                </div>

                {timeline.length === 0 ? (
                  <p className="text-xs text-muted-foreground font-mono italic bg-background/50 p-2.5 rounded border border-border/40 text-center">
                    No custom milestones added yet.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {timeline.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-background/70 border border-border space-y-2 relative">
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) => {
                              const next = [...timeline];
                              next[idx].date = e.target.value;
                              setTimeline(next);
                            }}
                            className="px-2 py-1 rounded bg-surface border border-border text-foreground text-xs font-mono focus:outline-none"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const next = [...timeline];
                              next[idx].title = e.target.value;
                              setTimeline(next);
                            }}
                            placeholder="Milestone title (e.g. Phase 1: Database Architecture)"
                            className="flex-1 px-2.5 py-1 rounded bg-surface border border-border text-foreground text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setTimeline(timeline.filter((_, i) => i !== idx))}
                            className="p-1 rounded text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const next = [...timeline];
                            next[idx].description = e.target.value;
                            setTimeline(next);
                          }}
                          placeholder="Short details (e.g. Completed event queue integration with BullMQ)"
                          className="w-full px-2.5 py-1 rounded bg-surface border border-border text-muted-foreground text-xs focus:outline-none font-mono"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Placement Controls */}
              <div className="p-3.5 rounded-lg bg-surface/80 border border-border space-y-3">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block font-bold">
                  Homepage & Placement Controls
                </span>

                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="mt-0.5 rounded bg-background border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Feature in Upper Section
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Displays in the top 3 cards grid of the Homepage "Learning Progress" section.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none group border-t border-border/50 pt-2.5">
                  <input
                    type="checkbox"
                    checked={isTopSkill}
                    onChange={(e) => setIsTopSkill(e.target.checked)}
                    className="mt-0.5 rounded bg-background border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Pin to Top (Learning Page)
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Pins this learning track to the top of the /learning page directory.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none group border-t border-border/50 pt-2.5">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="mt-0.5 rounded bg-background border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" /> Published (Live Site)
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      When unchecked, saved as Draft and hidden from public visitors.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCourseModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={courseSaving}>
                  {courseSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {courseSaving ? 'Saving...' : 'Save Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CERTIFICATE MODAL ─── */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                {certEditId ? 'Edit Certificate' : 'Add New Certificate'}
              </h3>
              <button onClick={() => setIsCertModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Issuer Organization *</label>
                <input
                  type="text"
                  required
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services / Linux Foundation"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Issue Date / Year</label>
                  <input
                    type="text"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    placeholder="e.g. 2025 or Aug 2025"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Credential ID</label>
                  <input
                    type="text"
                    value={certCredentialId}
                    onChange={(e) => setCertCredentialId(e.target.value)}
                    placeholder="e.g. AWS-948271"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Verification URL</label>
                <input
                  type="url"
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
                  placeholder="https://aws.amazon.com/verification/..."
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                <select
                  value={certCategory}
                  onChange={(e) => setCertCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none font-mono"
                >
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Architecture">Architecture & Systems</option>
                  <option value="AI / ML">AI / Machine Learning</option>
                  <option value="Security">Security & Networking</option>
                  <option value="Web Development">Web Development</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={certPublished}
                  onChange={(e) => setCertPublished(e.target.checked)}
                  className="rounded bg-background border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Published (Visible on Public Site)
                </span>
              </label>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCertModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={certSaving}>
                  {certSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {certSaving ? 'Saving...' : 'Save Certificate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
