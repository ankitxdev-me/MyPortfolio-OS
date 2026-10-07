import React from 'react';
import { cn } from '@/lib/utils';
import { SocialLinks, type SocialLinkItem } from '@/components/contact/SocialLinks';

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  brandName?: string;
  description?: string;
  linkGroups?: FooterLinkGroup[];
  socialLinks?: SocialLinkItem[];
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  brandName = 'Portfolio OS',
  description = 'Personal Operating System documenting engineering projects, learning progress, technical blogs, and professional growth.',
  linkGroups = [],
  socialLinks = [
    { platform: 'github', url: 'https://github.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
  ],
  className,
}) => {
  return (
    <footer className={cn('w-full border-t border-border bg-background text-foreground py-12 px-4 sm:px-8 lg:px-12', className)}>
      <div className="w-full max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-extrabold text-lg tracking-tight text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> {brandName}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">{description}</p>
          <SocialLinks links={socialLinks} variant="icons" />
        </div>

        {linkGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">{group.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {group.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="w-full max-w-[1720px] mx-auto pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4 font-mono">
        <p>© {new Date().getFullYear()} {brandName}. Built with Astro, React & Tailwind CSS.</p>
        <p className="flex items-center gap-1">
          Designed for <span className="text-primary font-semibold">Engineering Excellence</span>
        </p>
      </div>
    </footer>
  );
};
