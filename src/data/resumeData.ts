export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Internship';
  highlights: string[];
  technologies: string[];
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level: 'Expert' | 'Advanced' | 'Proficient'; years: string }[];
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

export const RESUME_SUMMARY = `Senior Software Engineer & AI Systems Developer with 3+ years of experience engineering high-throughput full-stack web platforms, autonomous AI agent pipelines, and high-performance Web3/Telegram integrations. Dedicated to clean architecture, glassmorphism UI design systems, and zero-downtime microservice deployments.`;

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: '1',
    role: 'Lead Full Stack & AI Engineer',
    company: 'Nexus Fintech & Systems',
    location: 'San Francisco, CA (Remote)',
    period: '2024 — Present',
    type: 'Full-time',
    highlights: [
      'Architected high-speed transaction dashboard processing $2.5M+ in volume using Next.js 14, Tailwind, and PostgreSQL.',
      'Designed multi-agent task runner reducing API latency by 45% through Redis caching and BullMQ execution queues.',
      'Mentored a team of 4 junior engineers on TypeScript strict safety and design system token compliance.',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    id: '2',
    role: 'Full Stack Engineer',
    company: 'AutoFlow Global',
    location: 'Remote',
    period: '2023 — 2024',
    type: 'Full-time',
    highlights: [
      'Built automated tier-1 customer support agent with LangChain and vector databases, reducing ticket resolution time by 70%.',
      'Developed 5+ high-throughput Telegram automation bots serving over 50,000 active community members.',
      'Implemented automated CI/CD pipelines with GitHub Actions and Docker containers deployed to Railway and Vercel.',
    ],
    technologies: ['React', 'LangChain', 'Node.js', 'Grammy.js', 'MongoDB', 'Docker'],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Frontend Engineering',
    skills: [
      { name: 'React / Next.js', level: 'Expert', years: '3+ Yrs' },
      { name: 'Astro Framework', level: 'Expert', years: '2+ Yrs' },
      { name: 'TypeScript', level: 'Expert', years: '3+ Yrs' },
      { name: 'Tailwind CSS', level: 'Expert', years: '3+ Yrs' },
    ],
  },
  {
    category: 'Backend & Systems',
    skills: [
      { name: 'Node.js / Express', level: 'Expert', years: '3+ Yrs' },
      { name: 'PostgreSQL & Prisma', level: 'Advanced', years: '2+ Yrs' },
      { name: 'Redis & Queues', level: 'Advanced', years: '2+ Yrs' },
      { name: 'REST & GraphQL APIs', level: 'Expert', years: '3+ Yrs' },
    ],
  },
  {
    category: 'AI & Automation',
    skills: [
      { name: 'LangChain & Agents', level: 'Advanced', years: '2+ Yrs' },
      { name: 'Vector DBs (Pinecone)', level: 'Advanced', years: '1+ Yr' },
      { name: 'Telegram Bot APIs', level: 'Expert', years: '3+ Yrs' },
    ],
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: '1',
    title: 'Top Department Standing (Top 5%)',
    organization: 'Computer Science Department',
    year: '2025',
    description: 'Awarded for consistent academic excellence and maintaining an 8.9 CGPA across 6 semesters.',
  },
  {
    id: '2',
    title: 'Hackathon First Prize — AI Track',
    organization: 'Global AI & Web3 Hackathon',
    year: '2024',
    description: 'Built AutoOps AI agent workflow system within 48 hours, defeating 120+ international teams.',
  },
];
