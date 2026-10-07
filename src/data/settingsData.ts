export interface SiteSettings {
  siteName: string;
  siteTitle?: string;
  siteDescription: string;
  contactEmail: string;
  location?: string;
  authorName?: string;
  authorEmail?: string;
  authorRole?: string;
  authorBio?: string;
  authorAvatar?: string;
  resumeUrl?: string;
  currentStatus?: string;
  currentProject?: string;
  currentProjectStatus?: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  leetcodeUrl?: string;
  googleCloudUrl?: string;
  socialLinks?: { platform: string; url: string; icon: string; label?: string }[];
  seoDefaults?: { metaTitle?: string; metaDescription?: string; ogImage?: string; keywords?: string[] };
  analytics?: { enabled: boolean; trackingId?: string };
}

export const SITE_SETTINGS: SiteSettings = {
  siteName: 'Portfolio OS — Ankit Gupta',
  siteTitle: 'Ankit Gupta — Lead Full-Stack & AI Engineer',
  siteDescription: 'Production-grade Personal Portfolio Operating System for Ankit Gupta. Software Engineer, AI Systems Developer, and Full-Stack Architect.',
  contactEmail: (typeof process !== 'undefined' && process.env?.CONTACT_EMAIL) || 'contact@example.com',
  location: 'Pune, India / Remote',
  authorName: 'Ankit Gupta',
  authorEmail: (typeof process !== 'undefined' && process.env?.AUTHOR_EMAIL) || 'contact@example.com',
  authorRole: 'Full-Stack Software Engineer',
  authorBio: 'Software Engineer specializing in autonomous AI workflows, Next.js SaaS products, high-performance web architecture, and developer tools.',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  resumeUrl: '/assets/resume.pdf',
  currentStatus: 'Currently Building AutoOps AI',
  currentProject: 'AutoOps AI',
  currentProjectStatus: 'Sprint 3 Active',
  githubUrl: 'https://github.com/ankit-gupta',
  linkedinUrl: 'https://linkedin.com/in/ankit-gupta',
  twitterUrl: 'https://twitter.com/ankit_dev',
  leetcodeUrl: 'https://leetcode.com/u/ankitgupta',
  googleCloudUrl: 'https://www.cloudskillsboost.google/public_profiles/ankitgupta',
  socialLinks: [
    { platform: 'github', url: 'https://github.com/ankit-gupta', icon: 'Github', label: 'GitHub' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/ankit-gupta', icon: 'Linkedin', label: 'LinkedIn' },
    { platform: 'leetcode', url: 'https://leetcode.com/u/ankitgupta', icon: 'Code', label: 'LeetCode' },
    { platform: 'googlecloud', url: 'https://www.cloudskillsboost.google/public_profiles/ankitgupta', icon: 'Cloud', label: 'Google Cloud' },
    { platform: 'twitter', url: 'https://twitter.com/ankit_dev', icon: 'Twitter', label: 'Twitter' },
  ],
  seoDefaults: {
    metaTitle: 'Ankit Gupta — Portfolio OS',
    metaDescription: 'Personal Portfolio Operating System',
    ogImage: '/images/og-image.png',
    keywords: ['Full-Stack', 'AI Engineer', 'Astro', 'React', 'TypeScript'],
  },
  analytics: {
    enabled: false,
  },
};
