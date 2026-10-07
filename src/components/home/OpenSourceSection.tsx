import React from 'react';
import { Card } from '@/components/cards/Card';
import type { GitHubStats } from '@/server/services/github.service';
import { Github, GitCommit, GitPullRequest, Star, ExternalLink, GitFork, BookOpen } from 'lucide-react';

export interface OpenSourceSectionProps {
  stats?: GitHubStats;
}

export const OpenSourceSection: React.FC<OpenSourceSectionProps> = ({ stats }) => {
  const profileUrl = stats?.profileUrl || 'https://github.com/ankit-gupta';
  const displayCommits = stats?.commits ? `${stats.commits}+` : '65+';
  const displayStars = stats?.totalStars !== undefined ? String(stats.totalStars) : '0';
  const displayPRs = stats?.pullRequests !== undefined ? String(stats.pullRequests) : '5';
  const displayRepos = stats?.publicRepos !== undefined ? String(stats.publicRepos) : '5+';
  const isLive = stats?.isLive ?? false;

  return (
    <section className="py-16 md:py-24 border-t border-border/80 relative">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
              <Github className="w-4 h-4" /> Open Source & Community
              {isLive && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono lowercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  live github sync
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              GitHub <span className="orange-gradient-text">Activity</span>
            </h2>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-primary flex items-center gap-1.5 hover:underline transition-colors"
          >
            <span>View @{stats?.username || 'GitHub'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* GitHub Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="glass" padding="md" className="flex items-center gap-4 hover:border-primary/40 transition-colors">
            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-mono text-foreground">{displayCommits}</p>
              <p className="text-xs text-muted-foreground">Recent Commits</p>
            </div>
          </Card>

          <Card variant="glass" padding="md" className="flex items-center gap-4 hover:border-primary/40 transition-colors">
            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-mono text-foreground">{displayStars}</p>
              <p className="text-xs text-muted-foreground">Stars Earned</p>
            </div>
          </Card>

          <Card variant="glass" padding="md" className="flex items-center gap-4 hover:border-primary/40 transition-colors">
            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-mono text-foreground">{displayPRs}</p>
              <p className="text-xs text-muted-foreground">Pull Requests</p>
            </div>
          </Card>

          <Card variant="glass" padding="md" className="flex items-center gap-4 hover:border-primary/40 transition-colors">
            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-mono text-foreground">{displayRepos}</p>
              <p className="text-xs text-muted-foreground">Public Repositories</p>
            </div>
          </Card>
        </div>

        {/* Top Public Repositories (if any returned) */}
        {stats?.topRepos && stats.topRepos.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Active Repositories
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.topRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-xl glass-card border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                        <span className="truncate">{repo.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {repo.description || 'No description provided.'}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                  </div>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40 text-xs font-mono text-muted-foreground">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forks}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
