import React, { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category?: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  status?: string;
}

interface ProjectsExplorerProps {
  projects: ProjectItem[];
}

const CATEGORIES = ['All', 'Web', 'AI/ML', 'Blockchain', 'Mobile', 'DevOps'] as const;

export const ProjectsExplorer: React.FC<ProjectsExplorerProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Category matching helper
  const matchesCategory = (p: ProjectItem, category: string): boolean => {
    if (category === 'All') return true;
    const cat = (p.category || '').toLowerCase();
    const tags = p.tags.map((t) => t.toLowerCase());
    const text = `${p.title} ${p.description}`.toLowerCase();

    if (category === 'Web') {
      return (
        cat.includes('web') ||
        tags.some((t) => ['react', 'next.js', 'tailwind', 'vue', 'astro', 'javascript', 'typescript', 'frontend'].includes(t)) ||
        text.includes('web') ||
        text.includes('frontend')
      );
    }

    if (category === 'AI/ML') {
      return (
        cat.includes('ai') ||
        cat.includes('automation') ||
        tags.some((t) => ['python', 'ai', 'langchain', 'openai', 'llm', 'ml', 'nlp', 'telegram'].includes(t)) ||
        text.includes('ai') ||
        text.includes('bot') ||
        text.includes('agent')
      );
    }

    if (category === 'Blockchain') {
      return (
        cat.includes('web3') ||
        cat.includes('blockchain') ||
        tags.some((t) => ['solidity', 'web3', 'ethereum', 'polygon', 'hardhat', 'crypto'].includes(t)) ||
        text.includes('dapp') ||
        text.includes('crypto') ||
        text.includes('lottery')
      );
    }

    if (category === 'Mobile') {
      return (
        cat.includes('mobile') ||
        tags.some((t) => ['react native', 'flutter', 'ios', 'android', 'mobile'].includes(t)) ||
        text.includes('mobile') ||
        text.includes('app')
      );
    }

    if (category === 'DevOps') {
      return (
        cat.includes('devops') ||
        tags.some((t) => ['docker', 'kubernetes', 'aws', 'ci/cd', 'railway', 'nginx', 'linux'].includes(t)) ||
        text.includes('infrastructure') ||
        text.includes('devops')
      );
    }

    return true;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => matchesCategory(p, selectedCategory));
  }, [projects, selectedCategory]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner matching mockup */}
      <div className="space-y-1.5 px-1 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Projects
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
          A collection of my work, side projects, and experiments.
        </p>
      </div>

      {/* Category Filter Pills (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects List / Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center space-y-3 rounded-3xl border border-neutral-800/80 bg-neutral-900/30">
          <p className="text-sm font-semibold text-neutral-300">No projects found in this category.</p>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-bold text-orange-500 hover:text-orange-400 underline"
          >
            Reset filter to All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.slug}
              className="rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/90 transition-all duration-300 p-3.5 sm:p-4.5 space-y-3.5 flex flex-col justify-between group shadow-xl hover:shadow-2xl"
            >
              <div className="space-y-3.5">
                {/* Project Image Preview */}
                <a
                  href={`/projects/${project.slug}`}
                  className="block relative rounded-2xl overflow-hidden aspect-[16/9] bg-neutral-950 border border-neutral-800/70 group-hover:border-neutral-700 transition-colors"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white shadow-md tracking-wide">
                      Featured
                    </span>
                  )}
                </a>

                {/* Project Title & Description */}
                <div className="space-y-1">
                  <a href={`/projects/${project.slug}`} className="block">
                    <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors tracking-tight">
                      {project.title}
                    </h2>
                  </a>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {project.tags.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-xl bg-neutral-950/80 border border-neutral-800/90 text-[11px] font-medium text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-2.5 flex items-center gap-5 text-xs font-semibold border-t border-neutral-800/60">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <a
                  href={`/projects/${project.slug}`}
                  className="text-neutral-400 hover:text-neutral-200 ml-auto inline-flex items-center gap-1 text-[11px] font-mono"
                >
                  Case Study →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
