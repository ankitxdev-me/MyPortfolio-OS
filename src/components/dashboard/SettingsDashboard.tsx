import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { ImagePickerModal } from '@/components/dashboard/ImagePickerModal';
import {
  Save,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Clock,
  FolderKanban,
} from 'lucide-react';

export const SettingsDashboard: React.FC = () => {
  const [siteName, setSiteName] = useState('Ankit Gupta — Lead Full-Stack & AI Systems Engineer');
  const [siteDescription, setSiteDescription] = useState(
    'Production portfolio showcase featuring autonomous AI agentic workflows, high-throughput microservices, and modern web application case studies.'
  );
  const [contactEmail, setContactEmail] = useState('ankitgupta72724@gmail.com');
  const [location, setLocation] = useState('Pune, India / Remote');
  const [currentStatus, setCurrentStatus] = useState('Available for opportunities');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('https://github.com/ankit-gupta');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/ankit-gupta');
  const [twitterUrl, setTwitterUrl] = useState('https://twitter.com/ankit_gupta');
  const [leetcodeUrl, setLeetcodeUrl] = useState('https://leetcode.com/u/ankitgupta');
  const [googleCloudUrl, setGoogleCloudUrl] = useState(
    'https://www.cloudskillsboost.google/public_profiles/ankitgupta'
  );

  // Dynamic Hero Project Pill Settings
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [currentProject, setCurrentProject] = useState<string>('AutoOps AI');
  const [currentProjectStatus, setCurrentProjectStatus] = useState<string>('Sprint 3 Active');
  const [currentProjectSlug, setCurrentProjectSlug] = useState<string>('autoops-ai');
  const [selectedProjectTimeline, setSelectedProjectTimeline] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Image Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [res, projRes] = await Promise.all([
        apiClient.settings.getSettings(),
        apiClient.projects.getAll({ limit: 100 } as any).catch(() => ({ data: [] })),
      ]);

      let pList: any[] = [];
      if (projRes && projRes.data) {
        if (Array.isArray(projRes.data)) {
          pList = projRes.data;
        } else if (Array.isArray((projRes.data as any).data)) {
          pList = (projRes.data as any).data;
        }
      }
      setProjects(pList);

      if (res && res.data) {
        const s: any = res.data;
        if (s.siteName) setSiteName(s.siteName);
        if (s.siteDescription) setSiteDescription(s.siteDescription);
        if (s.contactEmail) setContactEmail(s.contactEmail);
        if (s.location) setLocation(s.location);
        if (s.currentStatus || s.availabilityStatus) setCurrentStatus(s.currentStatus || s.availabilityStatus);
        if (s.seoDefaults?.ogImage) setOgImageUrl(s.seoDefaults.ogImage);

        // Project settings
        if (s.currentProject) setCurrentProject(s.currentProject);
        if (s.currentProjectStatus) setCurrentProjectStatus(s.currentProjectStatus);
        if (s.currentProjectSlug) setCurrentProjectSlug(s.currentProjectSlug);
        if (s.currentProjectId) setSelectedProjectId(s.currentProjectId);

        // Match selected project or find by title/slug to get timeline
        const matched = pList.find(
          (p: any) =>
            (s.currentProjectId && (p._id === s.currentProjectId || p.id === s.currentProjectId)) ||
            (s.currentProjectSlug && p.slug === s.currentProjectSlug) ||
            (s.currentProject && (p.title === s.currentProject || p.slug === s.currentProject))
        );

        if (matched) {
          if (!s.currentProjectId) setSelectedProjectId(matched._id || matched.id);
          if (!s.currentProjectSlug) setCurrentProjectSlug(matched.slug);
          if (matched.timeline && Array.isArray(matched.timeline)) {
            setSelectedProjectTimeline(matched.timeline);
          }
        }

        const gh = Array.isArray(s.socialLinks)
          ? s.socialLinks.find((item: any) => item.platform === 'github')?.url
          : s.socialLinks?.github || s.githubUrl;
        if (gh) setGithubUrl(gh);

        const li = Array.isArray(s.socialLinks)
          ? s.socialLinks.find((item: any) => item.platform === 'linkedin')?.url
          : s.socialLinks?.linkedin || s.linkedinUrl;
        if (li) setLinkedinUrl(li);

        const tw = Array.isArray(s.socialLinks)
          ? s.socialLinks.find((item: any) => item.platform === 'twitter')?.url
          : s.socialLinks?.twitter || s.twitterUrl;
        if (tw) setTwitterUrl(tw);

        const lc = Array.isArray(s.socialLinks)
          ? s.socialLinks.find((item: any) => item.platform === 'leetcode')?.url
          : s.socialLinks?.leetcode || s.leetcodeUrl;
        if (lc) setLeetcodeUrl(lc);

        const gc = Array.isArray(s.socialLinks)
          ? s.socialLinks.find(
              (item: any) => item.platform === 'googlecloud' || item.platform === 'google_cloud' || item.platform === 'gcp'
            )?.url
          : s.socialLinks?.googleCloud || s.googleCloudUrl;
        if (gc) setGoogleCloudUrl(gc);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch global site settings' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleProjectSelect = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = projects.find((p: any) => (p._id || p.id) === projId);
    if (proj) {
      setCurrentProject(proj.title);
      setCurrentProjectSlug(proj.slug);
      const timeline = Array.isArray(proj.timeline) ? proj.timeline : [];
      setSelectedProjectTimeline(timeline);

      // Auto-extract latest timeline milestone added for this project
      if (timeline.length > 0) {
        const latest = timeline[timeline.length - 1];
        const statusText = latest.title || latest.description || latest.status || 'Active';
        setCurrentProjectStatus(statusText);
      } else {
        setCurrentProjectStatus(proj.status || 'Active');
      }
    } else {
      setSelectedProjectTimeline([]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    const payload = {
      siteName,
      siteDescription,
      contactEmail,
      location,
      currentStatus,
      availabilityStatus: currentStatus,
      currentProject,
      currentProjectStatus,
      currentProjectId: selectedProjectId,
      currentProjectSlug,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      leetcodeUrl,
      googleCloudUrl,
      socialLinks: [
        { platform: 'github', url: githubUrl, icon: 'Github', label: 'GitHub' },
        { platform: 'linkedin', url: linkedinUrl, icon: 'Linkedin', label: 'LinkedIn' },
        { platform: 'leetcode', url: leetcodeUrl, icon: 'Code', label: 'LeetCode' },
        { platform: 'googlecloud', url: googleCloudUrl, icon: 'Cloud', label: 'Google Cloud' },
        { platform: 'twitter', url: twitterUrl, icon: 'Twitter', label: 'Twitter' },
      ],
      seoDefaults: {
        metaTitle: siteName,
        metaDescription: siteDescription,
        ogImage: ogImageUrl,
      },
    };

    try {
      await apiClient.settings.updateSettings(payload as any);
      setNotification({ type: 'success', message: 'Global site settings and active hero project updated successfully!' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground font-mono">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
        Loading global site settings from MongoDB...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectImage={(url) => setOgImageUrl(url)}
        title="Select OpenGraph Social Preview Image"
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Site Settings</h1>
          <p className="text-xs text-muted-foreground">
            Configure site metadata, hero featured project, SEO title templates, and social profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={fetchSettings} disabled={saving}>
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs font-bold hover:opacity-80">
            ✕
          </button>
        </div>
      )}

      {/* Hero Featured Project Badge Settings */}
      <Card variant="glass" padding="md" className="space-y-4">
        <div className="border-b border-border/60 pb-2 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Hero Active Project Pill (Homepage Badge)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select which project is featured in the floating badge on the homepage hero. It is clickable and links to the project page, displaying its latest timeline update.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
              <span>Select Active Project</span>
              {currentProjectSlug && (
                <a
                  href={`/projects/${currentProjectSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-normal lowercase font-sans"
                >
                  Visit Project Page <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleProjectSelect(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-xs font-medium focus:border-primary focus:outline-none"
            >
              <option value="">-- Choose a project to feature in the Hero section --</option>
              {projects.map((p: any) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.title} ({p.category || 'Project'}) — {p.timeline?.length || 0} timeline updates
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Project Display Title</label>
            <input
              type="text"
              value={currentProject}
              onChange={(e) => setCurrentProject(e.target.value)}
              placeholder="e.g. AutoOps AI"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Project URL Slug</label>
            <input
              type="text"
              value={currentProjectSlug}
              onChange={(e) => setCurrentProjectSlug(e.target.value)}
              placeholder="e.g. autoops-ai"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
              <span>Timeline Update (Displayed below project title)</span>
              {selectedProjectTimeline.length > 0 && (
                <span className="text-[11px] text-emerald-400 font-sans font-normal">
                  Auto-synced from latest timeline entry
                </span>
              )}
            </label>
            <input
              type="text"
              value={currentProjectStatus}
              onChange={(e) => setCurrentProjectStatus(e.target.value)}
              placeholder="e.g. Sprint 3 Active or latest milestone summary"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Live Interactive Badge Preview & Latest Timeline Details */}
        <div className="mt-3 p-4 rounded-xl bg-background/70 border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground uppercase">Hero Badge Live Preview</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Clickable → /projects/{currentProjectSlug || 'slug'}
            </span>
          </div>

          {/* Interactive Badge Preview */}
          <a
            href={currentProjectSlug ? `/projects/${currentProjectSlug}` : '/projects'}
            target="_blank"
            rel="noopener noreferrer"
            title={`Preview redirect to /projects/${currentProjectSlug}`}
            className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 shadow-2xl transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-500 shrink-0 shadow-xs group-hover:bg-orange-500/25 transition-colors">
              <Sparkles className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
            <div className="pr-1 text-left">
              <p className="font-bold text-xs sm:text-sm text-white leading-tight group-hover:text-orange-400 transition-colors">
                {currentProject || 'Project Title'}
              </p>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium leading-tight mt-0.5">
                {currentProjectStatus || 'Latest Timeline Milestone'}
              </p>
            </div>
            <div className="w-1 h-8 rounded-full bg-orange-500 shrink-0 ml-1 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          </a>

          {/* Latest Timeline Entry Inspector */}
          {selectedProjectTimeline.length > 0 ? (
            <div className="pt-2 border-t border-border/40">
              <div className="text-[11px] font-semibold text-foreground flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>
                  Latest Timeline Milestone for {currentProject} ({selectedProjectTimeline.length} total updates recorded):
                </span>
              </div>
              {(() => {
                const latest = selectedProjectTimeline[selectedProjectTimeline.length - 1];
                return (
                  <div className="text-xs text-muted-foreground bg-surface p-3 rounded-lg border border-border/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">{latest.title || 'Untitled Milestone'}</span>
                      {latest.date && <span className="text-[10px] font-mono text-muted-foreground">{latest.date}</span>}
                    </div>
                    {latest.description && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{latest.description}</p>
                    )}
                    {latest.status && (
                      <div className="pt-1">
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
                          Status: {latest.status}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>No timeline milestones have been logged for this project yet. Custom status text will be used.</span>
            </div>
          )}
        </div>
      </Card>

      {/* General SEO Settings */}
      <Card variant="glass" padding="md" className="space-y-4">
        <h3 className="font-bold text-foreground text-sm border-b border-border/60 pb-2">Global SEO & Metadata</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Site Title</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Meta Description</label>
          <textarea
            rows={3}
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Default OpenGraph Image URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or /images/..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPickerOpen(true)} className="shrink-0">
              <ImageIcon className="w-4 h-4 mr-1 text-primary" /> Browse Media
            </Button>
          </div>
        </div>
      </Card>

      {/* Social Profiles */}
      <Card variant="glass" padding="md" className="space-y-4">
        <h3 className="font-bold text-foreground text-sm border-b border-border/60 pb-2">Social Connections & Links</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">GitHub Profile URL</label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">LinkedIn Profile URL</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">LeetCode Profile URL</label>
            <input
              type="text"
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
              placeholder="https://leetcode.com/u/username"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Google Cloud Profile URL</label>
            <input
              type="text"
              value={googleCloudUrl}
              onChange={(e) => setGoogleCloudUrl(e.target.value)}
              placeholder="https://www.cloudskillsboost.google/public_profiles/..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Twitter / X Handle</label>
            <input
              type="text"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Location / Timezone</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Pune, India / Remote"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-border/40">
            <label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              Current Work Status & Availability
            </label>
            <input
              type="text"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              placeholder="e.g. Software Engineer at [Company] or Available for opportunities"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Directly controls the top availability badge on the homepage hero section.
            </p>
          </div>
        </div>
      </Card>
    </form>
  );
};
