export interface AdminProfile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  resumeUrl: string;
}

export const ADMIN_PROFILE: AdminProfile = {
  name: 'Ankit Gupta',
  title: 'Full Stack & AI Engineer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  bio: 'Software Engineer specializing in autonomous AI workflows, Next.js SaaS products, high-performance web architecture, and developer tools.',
  resumeUrl: '/assets/resume.pdf',
};
