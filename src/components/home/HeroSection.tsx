import React from 'react';
import {
  Download,
  ArrowRight,
  Sparkles,
  Folder,
  FileText,
  Layers,
  GraduationCap,
  BarChart3,
  GitBranch,
} from 'lucide-react';

export interface HeroStatItem {
  label: string;
  value: string | number;
}

export interface HeroSocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  leetcode?: string;
  googleCloud?: string;
}

export interface HeroProfile {
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  resumeUrl?: string;
  status?: string;
  currentProject?: string;
  currentProjectStatus?: string;
  currentProjectSlug?: string;
}

export interface HeroSectionProps {
  stats?: HeroStatItem[];
  socialLinks?: HeroSocialLinks;
  profile?: HeroProfile;
}

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
    <path
      fill="#FFFFFF"
      d="M7.3 19.3H4v-10.7h3.3v10.7zM5.65 7.2c-1.07 0-1.95-.88-1.95-1.95 0-1.08.88-1.95 1.95-1.95s1.95.87 1.95 1.95c0 1.07-.88 1.95-1.95 1.95zm14.35 12.1h-3.3v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.3h-3.3V8.6h3.15v1.45h.05c.44-.83 1.52-1.7 3.12-1.7 3.34 0 3.96 2.2 3.96 5.06v5.89h.05z"
    />
  </svg>
);

const LeetCodeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 128 128" aria-hidden="true">
    <path
      fill="#FFA116"
      d="M76.992.002C75.171-.035 73.362.627 72 1.998l-53.432 53.87c-5.19 5.237-7.904 12.464-7.904 20.454s2.715 15.447 7.904 20.674l23.004 23.26c5.19 5.221 12.363 7.744 20.283 7.744s15.095-2.731 20.295-7.969l13.803-14.064c2.72-2.742 2.625-7.281-.207-10.135s-7.334-2.948-10.049-.207l-14.273 13.904c-2.464 2.491-5.878 3.532-9.649 3.532s-7.18-1.04-9.654-3.532L29.197 86.26c-2.47-2.49-3.71-6.134-3.71-9.937s1.24-7.237 3.71-9.728l22.856-23.362c2.47-2.49 5.953-3.439 9.718-3.439 3.766 0 7.18 1.038 9.649 3.53l14.271 13.9c2.72 2.746 7.223 2.65 10.055-.203 2.832-2.86 2.927-7.398.207-10.14L82.15 32.823c-3.461-3.445-7.845-5.952-12.757-7.093l-.182-.04 13.05-13.35c2.732-2.74 2.636-7.284-.197-10.138a7.36 7.36 0 0 0-5.072-2.2"
    />
    <path
      fill="#D1D5DB"
      d="M56.937 69.379c-3.712 0-6.718 3.22-6.718 7.178s3.001 7.18 6.718 7.18h53.678c3.712.005 6.72-3.217 6.72-7.18 0-3.958-3.008-7.178-6.72-7.178z"
    />
  </svg>
);

const GoogleCloudIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 128 128" aria-hidden="true">
    <path fill="#EA4335" d="M80.6 40.3h.4l-.2-.2 14-14v-.3c-11.8-10.4-28.1-14-43.2-9.5C36.5 20.8 24.9 32.8 20.7 48c.2-.1.5-.2.8-.2 5.2-3.4 11.4-5.4 17.9-5.4 2.2 0 4.3.2 6.4.6.1-.1.2-.1.3-.1 9-9.9 24.2-11.1 34.6-2.6h-.1z"/>
    <path fill="#4285F4" d="M108.1 47.8c-2.3-8.5-7.1-16.2-13.8-22.1L80 39.9c6 4.9 9.5 12.3 9.3 20v2.5c16.9 0 16.9 25.2 0 25.2H63.9v20h-.1l.1.2h25.4c14.6.1 27.5-9.3 31.8-23.1 4.3-13.8-1-28.8-13-36.9z"/>
    <path fill="#34A853" d="M39 107.9h26.3V87.7H39c-1.9 0-3.7-.4-5.4-1.1l-15.2 14.6v.2c6 4.3 13.2 6.6 20.7 6.6z"/>
    <path fill="#FBBC05" d="M40.2 41.9c-14.9.1-28.1 9.3-32.9 22.8-4.8 13.6 0 28.5 11.8 37.3l15.6-14.9c-8.6-3.7-10.6-14.5-4-20.8 6.6-6.4 17.8-4.4 21.7 3.8L68 55.2C61.4 46.9 51.1 42 40.2 42.1z"/>
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#1DA1F2" aria-hidden="true">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
  </svg>
);

const GmailIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="52 42 88 66" aria-hidden="true">
    <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>
    <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>
    <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
    <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92"/>
    <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/>
  </svg>
);

const getStatIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('project')) {
    return <Folder className="w-5 h-5 text-orange-500" />;
  }
  if (l.includes('blog') || l.includes('post') || l.includes('article')) {
    return <FileText className="w-5 h-5 text-orange-500" />;
  }
  if (l.includes('commit') || l.includes('github')) {
    return (
      <svg className="w-5 h-5 text-orange-500 fill-current" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (l.includes('tech') || l.includes('stack')) {
    return <Layers className="w-5 h-5 text-orange-500" />;
  }
  if (l.includes('cgpa') || l.includes('gpa') || l.includes('academic')) {
    return <GraduationCap className="w-5 h-5 text-orange-500" />;
  }
  if (l.includes('year') || l.includes('learn')) {
    return <BarChart3 className="w-5 h-5 text-orange-500" />;
  }
  return <Sparkles className="w-5 h-5 text-orange-500" />;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ stats, socialLinks, profile }) => {
  const defaultStats: HeroStatItem[] = [
    { label: 'Projects', value: '4+' },
    { label: 'Blog Posts', value: '3+' },
    { label: 'GitHub Commits', value: '24+' },
    { label: 'Technologies', value: '6' },
    { label: 'CGPA', value: '9.1' },
    { label: 'Years Learning', value: '4+' },
  ];

  const displayStats = stats && stats.length >= 6 ? stats : defaultStats;
  const githubHref = socialLinks?.github || 'https://github.com/ankit-gupta';
  const linkedinHref = socialLinks?.linkedin || 'https://linkedin.com/in/ankit-gupta';
  const twitterHref = socialLinks?.twitter || 'https://twitter.com/ankit_dev';
  const leetcodeHref = socialLinks?.leetcode || 'https://leetcode.com/u/ankitgupta';
  const googleCloudHref = socialLinks?.googleCloud || 'https://www.cloudskillsboost.google/public_profiles/ankitgupta';
  const emailHref = `mailto:${socialLinks?.email || 'ankitgupta72724@gmail.com'}`;

  const fullName = profile?.name || 'Ankit Gupta';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const jobHeadline =
    profile?.title && profile.title !== 'Full-Stack Software Engineer'
      ? profile.title
      : 'Software Engineer • AI Developer • Builder';

  const bioText =
    profile?.bio && !profile.bio.includes('Software Engineer specializing in')
      ? profile.bio
      : 'Building intelligent web applications and documenting my journey in tech, one project at a time.';

  const avatarUrl =
    profile?.avatar && profile.avatar.includes('ankit_avatar.png')
      ? profile.avatar
      : '/images/ankit_avatar.png';

  const resumeHref = profile?.resumeUrl || '/assets/resume.pdf';
  const currentProjectName = profile?.currentProject || 'AutoOps AI';
  const currentProjectStatus = profile?.currentProjectStatus || 'Sprint 3 Active';
  const currentProjectSlug = profile?.currentProjectSlug;
  const projectHref = currentProjectSlug ? `/projects/${currentProjectSlug}` : '/projects';
  const statusText = profile?.status || 'Available for opportunities';

  return (
    <section className="relative w-full pt-[clamp(0.5rem,1vw,1.25rem)] pb-[clamp(1rem,1.8vw,2rem)] bg-[#08080a] text-white overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col">
        {/* Main Hero Split Grid - 2 columns side-by-side down to 600px */}
        <div className="grid grid-cols-1 min-[600px]:grid-cols-12 gap-[clamp(1rem,2vw,3rem)] items-end">
          {/* Main Info Column - Scales proportionally with avatar */}
          <div className="min-[600px]:col-span-7 space-y-[clamp(0.65rem,1.1vw,1.35rem)] text-left pb-1 sm:pb-2 md:pb-3 lg:pb-4 flex flex-col items-start">
            {/* Availability Status Badge */}
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-[clamp(0.6rem,0.8vw,0.9rem)] py-[clamp(0.25rem,0.35vw,0.4rem)] rounded-full bg-emerald-950/50 border border-emerald-500/30 text-[clamp(0.65rem,0.75vw,0.75rem)] font-semibold text-emerald-400 shadow-xs">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>
                <span>{statusText}</span>
              </div>
            </div>

            {/* Name Heading with Orange Slash - Scales gradually with screen size */}
            <div className="space-y-[clamp(0.2rem,0.3vw,0.35rem)] w-full text-left">
              <p className="text-[clamp(0.8rem,1.15vw,1.25rem)] font-medium text-neutral-400 flex items-center justify-start">
                <span className="text-orange-500 font-bold text-[clamp(0.9rem,1.3vw,1.4rem)] mr-1.5 sm:mr-2 font-mono">/</span>
                <span>Hey, I'm</span>
              </p>
              <h1 className="text-[clamp(1.85rem,4.2vw,4.5rem)] font-extrabold tracking-tight text-white leading-[1.05] text-left">
                {firstName} {lastName && <span className="text-orange-500">{lastName}</span>}
              </h1>
              <p className="text-[clamp(0.75rem,1.15vw,1.25rem)] font-semibold text-neutral-300 flex items-center justify-start gap-1.5 sm:gap-2 flex-wrap pt-0.5">
                <span>{jobHeadline}</span>
              </p>
            </div>

            {/* Bio Paragraph - Scales proportionally */}
            <p className="text-[clamp(0.75rem,1.05vw,1.125rem)] text-neutral-400 leading-relaxed max-w-xl lg:max-w-2xl text-left">
              {bioText}
            </p>

            {/* Action Buttons: Scaled proportionally */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-0.5 w-full sm:w-auto">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-[clamp(1rem,1.5vw,1.75rem)] py-[clamp(0.55rem,0.85vw,1rem)] rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[clamp(0.75rem,0.95vw,0.95rem)] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all active:scale-98 cursor-pointer shrink-0"
              >
                <span>View My Work</span>
                <ArrowRight className="w-[clamp(0.85rem,1vw,1.1rem)] h-[clamp(0.85rem,1vw,1.1rem)]" />
              </a>

              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-[clamp(1rem,1.5vw,1.75rem)] py-[clamp(0.55rem,0.85vw,1rem)] rounded-xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-100 font-semibold text-[clamp(0.75rem,0.95vw,0.95rem)] transition-all active:scale-98 shadow-xs shrink-0"
              >
                <span>Download Resume</span>
                <Download className="w-[clamp(0.85rem,1vw,1.1rem)] h-[clamp(0.85rem,1vw,1.1rem)] text-neutral-400" />
              </a>
            </div>

            {/* Social Icons Row: Scales proportionally */}
            <div className="flex items-center justify-start gap-[clamp(0.5rem,0.75vw,0.85rem)] flex-wrap pt-0.5 w-full sm:w-auto">
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="GitHub Profile"
                className="w-[clamp(2.1rem,2.6vw,3rem)] h-[clamp(2.1rem,2.6vw,3rem)] rounded-[clamp(0.6rem,0.8vw,1rem)] bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 text-white flex items-center justify-center transition-all active:scale-95 shadow-xs group shrink-0"
              >
                <GithubIcon className="w-[clamp(0.9rem,1.1vw,1.25rem)] h-[clamp(0.9rem,1.1vw,1.25rem)] transition-transform group-hover:scale-110" />
              </a>
              <a
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
                className="w-[clamp(2.1rem,2.6vw,3rem)] h-[clamp(2.1rem,2.6vw,3rem)] rounded-[clamp(0.6rem,0.8vw,1rem)] bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center transition-all active:scale-95 shadow-xs group shrink-0"
              >
                <LinkedinIcon className="w-[clamp(0.9rem,1.1vw,1.25rem)] h-[clamp(0.9rem,1.1vw,1.25rem)] transition-transform group-hover:scale-110" />
              </a>
              <a
                href={leetcodeHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode Profile"
                title="LeetCode Profile"
                className="w-[clamp(2.1rem,2.6vw,3rem)] h-[clamp(2.1rem,2.6vw,3rem)] rounded-[clamp(0.6rem,0.8vw,1rem)] bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center transition-all active:scale-95 shadow-xs group shrink-0"
              >
                <LeetCodeIcon className="w-[clamp(0.9rem,1.1vw,1.25rem)] h-[clamp(0.9rem,1.1vw,1.25rem)] transition-transform group-hover:scale-110" />
              </a>
              <a
                href={googleCloudHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Cloud Profile"
                title="Google Cloud Profile"
                className="w-[clamp(2.1rem,2.6vw,3rem)] h-[clamp(2.1rem,2.6vw,3rem)] rounded-[clamp(0.6rem,0.8vw,1rem)] bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center transition-all active:scale-95 shadow-xs group shrink-0"
              >
                <GoogleCloudIcon className="w-[clamp(0.9rem,1.1vw,1.25rem)] h-[clamp(0.9rem,1.1vw,1.25rem)] transition-transform group-hover:scale-110" />
              </a>
              <a
                href={twitterHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X Profile"
                title="Twitter / X Profile"
                className="w-[clamp(2.1rem,2.6vw,3rem)] h-[clamp(2.1rem,2.6vw,3rem)] rounded-[clamp(0.6rem,0.8vw,1rem)] bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center transition-all active:scale-95 shadow-xs group shrink-0"
              >
                <TwitterIcon className="w-[clamp(0.9rem,1.1vw,1.25rem)] h-[clamp(0.9rem,1.1vw,1.25rem)] transition-transform group-hover:scale-110" />
              </a>
              <a
                href={emailHref}
                aria-label="Send Email"
                title="Send Email"
                className="w-[clamp(2.1rem,2.6vw,3rem)] h-[clamp(2.1rem,2.6vw,3rem)] rounded-[clamp(0.6rem,0.8vw,1rem)] bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center transition-all active:scale-95 shadow-xs group shrink-0"
              >
                <GmailIcon className="w-[clamp(0.9rem,1.1vw,1.25rem)] h-[clamp(0.9rem,1.1vw,1.25rem)] transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Avatar Column - Sits side-by-side down to 600px and scales in exact lockstep */}
          <div className="min-[600px]:col-span-5 relative flex flex-col items-center min-[600px]:items-end justify-end z-10 pt-2 min-[600px]:pt-0">
            <div className="relative w-[clamp(200px,27vw,420px)] flex items-end justify-center min-[600px]:justify-end">
              {/* Studio Amber Rim Lighting Backdrop */}
              <div className="absolute top-[38%] left-[46%] -translate-x-1/2 -translate-y-1/2 w-[clamp(180px,25vw,380px)] h-[clamp(180px,25vw,380px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.32)_0%,rgba(194,65,12,0.18)_42%,rgba(124,45,18,0.06)_68%,transparent_82%)] blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />

              {/* Vertical Handwriting Tagline - Scales gradually with viewport */}
              <div className="absolute right-0 translate-x-[clamp(0.5rem,1.1vw,1.4rem)] top-[26%] -translate-y-1/2 flex flex-col font-handwriting text-[clamp(0.75rem,1.4vw,1.65rem)] text-neutral-400/90 select-none pointer-events-none leading-[1.3] tracking-wider z-20 rotate-1">
                <span>Build</span>
                <span>Learn</span>
                <span>Improve</span>
                <span>Repeat</span>
                <div className="w-[clamp(1.8rem,2.8vw,3.5rem)] h-[clamp(2px,0.22vw,4px)] bg-orange-500 rounded-full mt-1 -rotate-6 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </div>

              {/* Portrait Image Cutout - Scales proportionally to lock the ratio with text */}
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-auto max-h-[clamp(250px,31vw,470px)] object-contain object-bottom select-none pointer-events-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)] block -translate-x-[clamp(0.3rem,0.7vw,1rem)]"
              />

              {/* Floating Active Project Pill Card - Scales gradually */}
              <a
                href={projectHref}
                title={`View ${currentProjectName} details`}
                className="absolute bottom-[clamp(1rem,2vw,2.5rem)] right-0 sm:right-0.5 md:right-1 lg:right-1.5 px-[clamp(0.5rem,0.75vw,0.85rem)] py-[clamp(0.3rem,0.45vw,0.55rem)] rounded-2xl bg-neutral-950/95 hover:bg-neutral-900 border border-neutral-800/90 hover:border-orange-500/60 shadow-2xl backdrop-blur-md flex items-center gap-[clamp(0.35rem,0.5vw,0.6rem)] z-30 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
              >
                <div className="w-[clamp(1.25rem,1.6vw,1.75rem)] h-[clamp(1.25rem,1.6vw,1.75rem)] rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-500 shrink-0 shadow-xs group-hover:bg-orange-500/25 transition-colors">
                  <GitBranch className="w-[clamp(0.65rem,0.85vw,0.9rem)] h-[clamp(0.65rem,0.85vw,0.9rem)] text-orange-500" />
                </div>
                <div className="pr-0.5 text-left">
                  <p className="font-bold text-[clamp(0.58rem,0.72vw,0.75rem)] text-white leading-tight group-hover:text-orange-400 transition-colors">
                    {currentProjectName}
                  </p>
                  <p className="text-[clamp(0.5rem,0.62vw,0.65rem)] text-neutral-400 font-medium leading-tight mt-0.5 flex items-center gap-0.5">
                    <span>{currentProjectStatus}</span>
                    <span className="text-orange-500">→</span>
                  </p>
                </div>
                {/* Orange glowing live dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)] shrink-0 ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero Statistics: 6 Individual Cards - Sized proportionally */}
        <div className="w-full relative z-20 mt-[clamp(0.75rem,1.2vw,1.5rem)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[clamp(0.5rem,0.9vw,1rem)]">
            {displayStats.map((stat, idx) => (
              <div
                key={idx}
                className="p-[clamp(0.6rem,0.9vw,1rem)] rounded-[clamp(0.75rem,1vw,1.25rem)] bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/80 hover:bg-neutral-900/60 transition-all flex items-center gap-[clamp(0.5rem,0.8vw,0.9rem)] shadow-xs"
              >
                <div className="w-[clamp(1.75rem,2.2vw,2.5rem)] h-[clamp(1.75rem,2.2vw,2.5rem)] rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  {getStatIcon(stat.label)}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[clamp(0.95rem,1.3vw,1.35rem)] font-bold text-white tracking-tight font-mono leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-[clamp(0.6rem,0.75vw,0.75rem)] text-neutral-400 font-medium leading-tight mt-0.5 truncate">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
