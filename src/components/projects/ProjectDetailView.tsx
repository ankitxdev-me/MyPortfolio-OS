import React, { useState } from 'react';
import type { DetailedProject } from '@/data/projectsData';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  Code2,
  Cpu,
  Layers,
  Globe,
  Sparkles,
  Check,
  FolderGit2,
} from 'lucide-react';

export interface ProjectDetailViewProps {
  project: DetailedProject & {
    id?: string;
    published?: boolean;
  };
  relatedProjects?: (DetailedProject & { id?: string })[];
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, relatedProjects = [] }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'tech' | 'challenges' | 'gallery' | 'docs'>('overview');

  // Format tech stack list into flat array for pills
  const getTechStackList = (): string[] => {
    if (Array.isArray(project.techStack) && project.techStack.length > 0) {
      return project.techStack;
    }
    if (project.techStack && typeof project.techStack === 'object') {
      const flat = [
        ...(project.techStack.frontend || []),
        ...(project.techStack.backend || []),
        ...(project.techStack.database || []),
        ...(project.techStack.infrastructure || []),
      ];
      if (flat.length > 0) return flat;
    }
    if (Array.isArray((project as any).tags) && (project as any).tags.length > 0) {
      return (project as any).tags;
    }
    return ['TypeScript', 'React', 'Node.js', 'Tailwind CSS'];
  };

  const techStackList = getTechStackList();

  // Categorized tech stack object
  const categorizedTech = typeof project.techStack === 'object' && !Array.isArray(project.techStack)
    ? project.techStack
    : {
        frontend: Array.isArray(project.techStack) ? project.techStack.slice(0, 3) : ['Next.js', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'LangChain'],
        database: ['MongoDB Atlas', 'Redis'],
        infrastructure: ['Vercel', 'Docker', 'GitHub Actions'],
      };

  // Image source
  const heroImage = project.image || (project as any).thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ─── 1. Breadcrumbs Header ──────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <a href="/" className="hover:text-primary transition-colors">Home</a>
        <ChevronRight className="w-3 h-3 text-border" />
        <a href="/projects" className="hover:text-primary transition-colors">Projects</a>
        <ChevronRight className="w-3 h-3 text-border" />
        <span className="text-foreground font-semibold truncate">{project.title}</span>
      </nav>

      {/* ─── 2. Top Hero Area: Image Preview (Left) + Project Meta (Right) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Screenshot / Frame */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-surface/80 shadow-2xl group">
            <img
              src={heroImage}
              alt={project.title}
              className="w-full h-auto max-h-[380px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            
            {/* Live Indicator Overlay Badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/80 text-xs font-mono text-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{project.status === 'Completed' ? 'Live Production' : project.status || 'In Progress'}</span>
            </div>

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Featured</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hero Specs & Meta */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <Badge variant="primary" size="md" className="font-mono text-[11px] uppercase tracking-wider">
              {project.category || 'Web Application'}
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {project.subtitle || project.description}
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold hover:opacity-90 transition-all shadow-glow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live Demo
              </a>
            )}

            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground font-mono text-xs font-semibold hover:bg-surface-hover hover:border-primary/50 transition-all">
                <Github className="w-4 h-4" /> View on GitHub
              </a>
            )}
          </div>

          {/* Created & Updated Dates */}
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Created {project.startDate || 'Jan 2024'}</span>
            <span>•</span>
            <span>Updated {project.deadline || 'Jul 2024'}</span>
          </div>

          {/* Tech Stack Pills Bar */}
          <div className="flex flex-wrap gap-2 pt-2">
            {techStackList.slice(0, 8).map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-surface/80 border border-border text-xs font-mono text-muted-foreground font-medium hover:text-foreground hover:border-primary/40 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. Sub-Navigation Tabs Bar ─────────────────────────────────── */}
      <div className="border-b border-border/80">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar text-sm font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tech')}
            className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tech'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Tech Stack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('challenges')}
            className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'challenges'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Challenges
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'docs'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Docs
          </button>
        </div>
      </div>

      {/* ─── 4. Main 3-Column Card Layout ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Project Overview */}
          <div className="lg:col-span-4">
            <Card variant="glass" padding="md" className="h-full space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Project Overview
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {project.overview || project.description || 'Detailed engineering documentation and project architecture.'}
              </p>

              <div className="space-y-2.5 pt-2 border-t border-border/60">
                {(project.features && project.features.length > 0
                  ? project.features
                  : [
                      'Built with modern web technologies',
                      'Fully responsive and dark mode first',
                      'SEO-optimized and blazing fast',
                      'Headless CMS for content management',
                    ]
                ).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{feat}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Card 2: Project Timeline */}
          <div className="lg:col-span-4">
            <Card variant="glass" padding="md" className="h-full space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Project Timeline
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {(project.timeline && project.timeline.length > 0
                  ? project.timeline
                  : [
                      { date: 'Jan 2024', title: 'Project idea and planning' },
                      { date: 'Feb 2024', title: 'UI/UX Design and Prototype' },
                      { date: 'Mar 2024', title: 'Frontend Development' },
                      { date: 'May 2024', title: 'Backend Development' },
                      { date: 'Jul 2024', title: 'Project Launch' },
                    ]
                ).map((item: any, idx: number) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background shadow-glow-sm" />
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-mono font-bold text-primary">{item.date}</span>
                      <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                      {item.description && <p className="text-[11px] text-muted-foreground">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Card 3: Project Information Table */}
          <div className="lg:col-span-4">
            <Card variant="glass" padding="md" className="h-full space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Project Information
              </h2>

              <div className="divide-y divide-border/60 text-xs font-mono">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-foreground font-semibold">{project.category || 'Web Application'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {project.status === 'Completed' ? 'Live' : project.status || 'Live'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="text-foreground">Full Stack Developer</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">6 Months</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="text-foreground">1</span>
                </div>
                {project.liveUrl && (
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-muted-foreground">Live URL</span>
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold flex items-center gap-1">
                      View Demo <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {project.githubUrl && (
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-muted-foreground">GitHub</span>
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold flex items-center gap-1">
                      View Repository <Github className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─── 5. Additional Tab Views ────────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <Card variant="glass" padding="md" className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-foreground">Detailed Development Roadmap</h2>
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {(project.timeline || []).map((item: any, idx: number) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-primary">{item.date}</span>
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'tech' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="glass" padding="md" className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-primary flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Frontend Layer
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {(categorizedTech.frontend || []).map((t: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-foreground font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </Card>

          <Card variant="glass" padding="md" className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-primary flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Backend Layer
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {(categorizedTech.backend || []).map((t: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-foreground font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </Card>

          <Card variant="glass" padding="md" className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-primary flex items-center gap-2">
              <Layers className="w-4 h-4" /> Database Layer
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {(categorizedTech.database || []).map((t: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-foreground font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </Card>

          <Card variant="glass" padding="md" className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-primary flex items-center gap-2">
              <Globe className="w-4 h-4" /> Infrastructure Layer
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {(categorizedTech.infrastructure || []).map((t: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-foreground font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {(project.challenges && project.challenges.length > 0
            ? project.challenges
            : [
                {
                  id: '1',
                  title: 'Async State Synchronization',
                  problem: 'Handling concurrent state transitions and background jobs.',
                  solution: 'Implemented idempotency keys and state machine snapshots.',
                  outcome: 'Zero state desynchronization with 100% resume reliability.',
                },
              ]
          ).map((c: any, idx: number) => (
            <Card key={idx} variant="glass" padding="md" className="space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" /> {c.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface border border-border/60 space-y-1">
                  <span className="text-rose-400 font-bold uppercase">Problem</span>
                  <p className="text-muted-foreground leading-relaxed">{c.problem}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-border/60 space-y-1">
                  <span className="text-primary font-bold uppercase">Solution</span>
                  <p className="text-muted-foreground leading-relaxed">{c.solution}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-border/60 space-y-1">
                  <span className="text-emerald-400 font-bold uppercase">Outcome</span>
                  <p className="text-muted-foreground leading-relaxed">{c.outcome}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(project.gallery && project.gallery.length > 0
            ? project.gallery
            : [{ src: heroImage, caption: 'Dashboard Overview' }]
          ).map((g: any, idx: number) => (
            <div key={idx} className="rounded-xl overflow-hidden border border-border bg-surface space-y-2 p-2">
              <img src={g.src || g.url} alt={g.caption || 'Screenshot'} className="w-full h-48 object-cover rounded-lg" />
              {g.caption && <p className="text-xs font-mono text-muted-foreground px-2">{g.caption}</p>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <Card variant="glass" padding="md" className="space-y-4">
          <h2 className="text-sm font-mono uppercase text-primary font-bold tracking-wider">System Architecture Documentation</h2>
          <p className="text-xs text-foreground/90 leading-relaxed font-mono whitespace-pre-line">
            {project.architectureOverview || 'Architected using modular microservices, clean layer decoupling, repository pattern, and Mongoose ORM.'}
          </p>
        </Card>
      )}

      {/* ─── 6. Related Projects Bottom Grid ──────────────────────────────── */}
      {relatedProjects && relatedProjects.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-border/80">
          <h2 className="text-xl font-bold text-foreground">Related Projects</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProjects.map((rel, idx) => (
              <a
                key={idx}
                href={`/projects/${rel.slug || rel.id}`}
                className="p-4 rounded-xl bg-surface/70 border border-border hover:border-primary/50 hover:bg-surface transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold group-hover:scale-110 transition-transform">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    {rel.category || 'Engineering Case Study'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
