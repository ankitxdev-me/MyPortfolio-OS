import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { ImagePickerModal } from '@/components/dashboard/ImagePickerModal';
import {
  Save,
  Upload,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ProfileDashboard: React.FC = () => {
  const [name, setName] = useState('Ankit Gupta');
  const [title, setTitle] = useState('Full Stack & AI Engineer');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
  );
  const [bio, setBio] = useState(
    'Software Engineer specializing in autonomous AI workflows, Next.js SaaS products, high-performance web architecture, and developer tools.'
  );
  const [resumeUrl, setResumeUrl] = useState('/assets/resume.pdf');
  const [currentProject, setCurrentProject] = useState('AutoOps AI');
  const [currentProjectStatus, setCurrentProjectStatus] = useState('Sprint 3 Active');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Image Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.settings.getSettings();
      if (res && res.data) {
        const s: any = res.data;
        if (s.authorName) setName(s.authorName);
        if (s.authorRole) setTitle(s.authorRole);
        if (s.authorBio) setBio(s.authorBio);
        if (s.authorAvatar) setAvatar(s.authorAvatar);
        if (s.resumeUrl) setResumeUrl(s.resumeUrl);
        if (s.currentProject) setCurrentProject(s.currentProject);
        if (s.currentProjectStatus) setCurrentProjectStatus(s.currentProjectStatus);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    const payload = {
      authorName: name,
      authorRole: title,
      authorBio: bio,
      authorAvatar: avatar,
      resumeUrl: resumeUrl,
      currentProject: currentProject,
      currentProjectStatus: currentProjectStatus,
      // Also sync aliases
      name,
      title,
      bio,
      avatar,
    };

    try {
      await apiClient.settings.updateSettings(payload as any);
      setNotification({ type: 'success', message: 'Admin profile and resume updated successfully!' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update profile changes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-muted-foreground font-mono">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
        <p className="text-sm">Loading admin profile from MongoDB...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      {/* Image Picker Modal for Avatar */}
      <ImagePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectImage={(url) => setAvatar(url)}
        title="Select Profile Avatar Image"
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-primary" /> Admin Profile & Resume
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage public display bio, profile avatar, executive headline, and downloadable resume PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={fetchProfile} disabled={saving}>
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs font-bold hover:opacity-80 px-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar & Quick Preview Card */}
        <Card
          variant="glass"
          padding="lg"
          className="space-y-5 text-center border-primary/20 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="relative group cursor-pointer" onClick={() => setIsPickerOpen(true)}>
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/40 shadow-glow-sm bg-surface transition-transform duration-300 group-hover:scale-105">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[11px] font-medium">
              <Upload className="w-5 h-5 mb-1 text-primary" />
              <span>Change</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-base tracking-tight">{name || 'Your Name'}</h3>
            <p className="text-xs text-primary font-mono font-medium">{title || 'Your Headline Role'}</p>
          </div>

          <div className="w-full space-y-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setIsPickerOpen(true)}
            >
              <Upload className="w-3.5 h-3.5 mr-1 text-primary" /> Upload / Choose Avatar
            </Button>
          </div>
        </Card>

        {/* Form Details Card */}
        <Card variant="glass" padding="lg" className="md:col-span-2 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ankit Gupta"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Job Headline / Role</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack & AI Engineer"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Executive Bio Statement</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summary displayed on homepage hero and about sections..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none transition-colors leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" /> Resume PDF Download Link
              </label>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-mono"
                >
                  Test Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="/assets/resume.pdf or https://..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">
                  Active Project Name
                </label>
                <input
                  type="text"
                  value={currentProject}
                  onChange={(e) => setCurrentProject(e.target.value)}
                  placeholder="e.g. AutoOps AI"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">
                  Project Phase / Sprint Status
                </label>
                <input
                  type="text"
                  value={currentProjectStatus}
                  onChange={(e) => setCurrentProjectStatus(e.target.value)}
                  placeholder="e.g. Sprint 3 Active or In Production"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};
