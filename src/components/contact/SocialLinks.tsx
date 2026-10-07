import React from 'react';
import { Send, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SocialLinkItem {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'telegram' | 'leetcode' | 'googlecloud' | 'gcp';
  url: string;
  label?: string;
}

const GithubSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#FFFFFF"
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedinSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
    <path
      fill="#FFFFFF"
      d="M7.3 19.3H4v-10.7h3.3v10.7zM5.65 7.2c-1.07 0-1.95-.88-1.95-1.95 0-1.08.88-1.95 1.95-1.95s1.95.87 1.95 1.95c0 1.07-.88 1.95-1.95 1.95zm14.35 12.1h-3.3v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.3h-3.3V8.6h3.15v1.45h.05c.44-.83 1.52-1.7 3.12-1.7 3.34 0 3.96 2.2 3.96 5.06v5.89h.05z"
    />
  </svg>
);

const LeetCodeSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
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

const GoogleCloudSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 128 128" aria-hidden="true">
    <path fill="#EA4335" d="M80.6 40.3h.4l-.2-.2 14-14v-.3c-11.8-10.4-28.1-14-43.2-9.5C36.5 20.8 24.9 32.8 20.7 48c.2-.1.5-.2.8-.2 5.2-3.4 11.4-5.4 17.9-5.4 2.2 0 4.3.2 6.4.6.1-.1.2-.1.3-.1 9-9.9 24.2-11.1 34.6-2.6h-.1z"/>
    <path fill="#4285F4" d="M108.1 47.8c-2.3-8.5-7.1-16.2-13.8-22.1L80 39.9c6 4.9 9.5 12.3 9.3 20v2.5c16.9 0 16.9 25.2 0 25.2H63.9v20h-.1l.1.2h25.4c14.6.1 27.5-9.3 31.8-23.1 4.3-13.8-1-28.8-13-36.9z"/>
    <path fill="#34A853" d="M39 107.9h26.3V87.7H39c-1.9 0-3.7-.4-5.4-1.1l-15.2 14.6v.2c6 4.3 13.2 6.6 20.7 6.6z"/>
    <path fill="#FBBC05" d="M40.2 41.9c-14.9.1-28.1 9.3-32.9 22.8-4.8 13.6 0 28.5 11.8 37.3l15.6-14.9c-8.6-3.7-10.6-14.5-4-20.8 6.6-6.4 17.8-4.4 21.7 3.8L68 55.2C61.4 46.9 51.1 42 40.2 42.1z"/>
  </svg>
);

const TwitterSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#1DA1F2" aria-hidden="true">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
  </svg>
);

const GmailSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="52 42 88 66" aria-hidden="true">
    <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>
    <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>
    <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
    <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92"/>
    <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/>
  </svg>
);

const TelegramSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#229ED9" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

export interface SocialLinksProps {
  links: SocialLinkItem[];
  variant?: 'icons' | 'buttons';
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ links, variant = 'icons', className }) => {
  const iconMap: Record<string, React.ReactNode> = {
    github: <GithubSvg className="w-4 h-4" />,
    linkedin: <LinkedinSvg className="w-4 h-4" />,
    twitter: <TwitterSvg className="w-4 h-4" />,
    leetcode: <LeetCodeSvg className="w-4 h-4" />,
    googlecloud: <GoogleCloudSvg className="w-4 h-4" />,
    gcp: <GoogleCloudSvg className="w-4 h-4" />,
    email: <GmailSvg className="w-4 h-4" />,
    telegram: <TelegramSvg className="w-4 h-4" />,
  };

  const brandHoverBorders: Record<string, string> = {
    github: 'hover:border-[#8957E5]/60 hover:shadow-[0_0_12px_rgba(137,87,229,0.25)]',
    linkedin: 'hover:border-[#0A66C2]/60 hover:shadow-[0_0_12px_rgba(10,102,194,0.25)]',
    twitter: 'hover:border-[#1DA1F2]/60 hover:shadow-[0_0_12px_rgba(29,161,242,0.25)]',
    leetcode: 'hover:border-[#FFA116]/60 hover:shadow-[0_0_12px_rgba(255,161,22,0.25)]',
    googlecloud: 'hover:border-[#4285F4]/60 hover:shadow-[0_0_12px_rgba(66,133,244,0.25)]',
    gcp: 'hover:border-[#4285F4]/60 hover:shadow-[0_0_12px_rgba(66,133,244,0.25)]',
    email: 'hover:border-[#EA4335]/60 hover:shadow-[0_0_12px_rgba(234,67,53,0.25)]',
    telegram: 'hover:border-[#229ED9]/60 hover:shadow-[0_0_12px_rgba(34,158,217,0.25)]',
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((link) => {
        const hoverStyle = brandHoverBorders[link.platform] || 'hover:border-primary/50';
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label || link.platform}
            className={cn(
              'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group',
              hoverStyle,
              variant === 'icons'
                ? 'p-2.5 rounded-full bg-surface border border-border text-foreground hover:bg-surface-hover shadow-subtle'
                : 'px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-foreground flex items-center gap-2'
            )}
          >
            <span className="transition-transform group-hover:scale-110 flex items-center justify-center">
              {iconMap[link.platform] || <Mail className="w-4 h-4" />}
            </span>
            {variant === 'buttons' && <span className="capitalize">{link.label || link.platform}</span>}
          </a>
        );
      })}
    </div>
  );
};
