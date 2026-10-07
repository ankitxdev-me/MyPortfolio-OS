import type { SocialLinkItem } from '@/components/contact/SocialLinks';

export interface ContactFAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Availability' | 'Freelancing' | 'Open Source' | 'Hiring';
}

export interface ContactInfo {
  email: string;
  location: string;
  timezone: string;
  availability: string;
  responseTime: string;
  languages: string[];
  preferredCommunication: string;
}

export const CONTACT_INFO: ContactInfo = {
  email: 'ankit@example.com',
  location: 'San Francisco, CA (Open to Remote)',
  timezone: 'UTC-7 (PST) / IST',
  availability: 'Available for Full-time Roles & Engineering Consulting',
  responseTime: 'Within 24 Hours',
  languages: ['English (Fluent)', 'Hindi (Native)'],
  preferredCommunication: 'Email or Scheduled Video Call',
};

export const SOCIAL_LINKS: SocialLinkItem[] = [
  { platform: 'github', url: 'https://github.com', label: 'GitHub' },
  { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
  { platform: 'twitter', url: 'https://x.com', label: 'X (Twitter)' },
  { platform: 'email', url: 'mailto:ankit@example.com', label: 'Email' },
  { platform: 'telegram', url: 'https://t.me', label: 'Telegram' },
];

export const CONTACT_FAQS: ContactFAQItem[] = [
  {
    id: '1',
    category: 'Availability',
    question: 'Are you currently open to full-time engineering roles or contracts?',
    answer: 'Yes! I am actively considering Senior Full Stack, AI Engineering, and Lead Frontend roles, as well as high-impact consulting engagements.',
  },
  {
    id: '2',
    category: 'Freelancing',
    question: 'What is your typical project engagement process for freelance clients?',
    answer: 'Every engagement begins with an initial requirements discovery call, followed by a technical architecture proposal, milestone agreement, iterative sprint updates, and final deployment with complete documentation.',
  },
  {
    id: '3',
    category: 'Open Source',
    question: 'How can we collaborate on open-source projects or developer tools?',
    answer: 'Feel free to submit issues or PRs on my public GitHub repositories, or reach out via email/Twitter if you would like to co-maintain a library.',
  },
  {
    id: '4',
    category: 'Hiring',
    question: 'What is the fastest way to get in touch for an interview or quick chat?',
    answer: 'Direct email (ankit@example.com) or submitting the contact form on this page ensures a response within 24 hours.',
  },
];
