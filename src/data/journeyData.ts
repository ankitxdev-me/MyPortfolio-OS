export interface DetailedMilestone {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  year: string;
  category: 'Projects' | 'Learning' | 'Academics' | 'Career' | 'Achievements';
  type: 'major' | 'minor';
  status: 'Completed' | 'In Progress' | 'Planned';
  tags: string[];
  summary: string;
  story: string;
  challenges: string[];
  lessonsLearned: string[];
  connectedProjectSlugs: string[];
  connectedBlogSlugs: string[];
  prevSlug?: string;
  nextSlug?: string;
}

export interface FutureGoal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  status: 'Planned' | 'In Progress';
}

export const FUTURE_GOALS: FutureGoal[] = [
  {
    id: '1',
    title: 'Launch AutoOps AI v1.0 Production Release',
    category: 'Projects',
    targetDate: 'Q3 2026',
    status: 'In Progress',
  },
  {
    id: '2',
    title: 'Publish Open Source LLM Schema Validator Package',
    category: 'Open Source',
    targetDate: 'Q4 2026',
    status: 'Planned',
  },
  {
    id: '3',
    title: 'AWS Certified DevOps Engineer Professional',
    category: 'Learning',
    targetDate: 'Q4 2026',
    status: 'Planned',
  },
];

export const MILESTONES_LIST: DetailedMilestone[] = [
  {
    slug: 'started-building-autoops-ai',
    title: 'Started Building AutoOps AI',
    subtitle: 'Flagship Autonomous Agent Platform',
    date: 'Jul 2026',
    year: '2026',
    category: 'Projects',
    type: 'major',
    status: 'In Progress',
    tags: ['Next.js', 'LangChain', 'Redis', 'TypeScript'],
    summary: 'Initiated development of AutoOps AI to solve multi-agent workflow automation challenges.',
    story: 'After experiencing friction with manual LLM prompt orchestration, I set out to create AutoOps AI—an event-driven workflow engine supporting visual graph execution and resilient queue recovery.',
    challenges: [
      'Managing async task state machine snapshots across Redis background workers.',
      'Handling non-deterministic LLM structured JSON output validation.',
    ],
    lessonsLearned: [
      'Event-driven message queues decouple client responsiveness from long-running background tasks.',
      'Enforcing strict schema validation loops reduces invalid agent responses to near zero.',
    ],
    connectedProjectSlugs: ['autoops-ai'],
    connectedBlogSlugs: ['building-autoops-ai-sprint-3'],
    nextSlug: 'built-first-fullstack-app',
  },
  {
    slug: 'built-first-fullstack-app',
    title: 'Launched TeleAdmin Bot v1.0',
    subtitle: 'Automated Community Management Tool',
    date: 'May 2026',
    year: '2026',
    category: 'Projects',
    type: 'major',
    status: 'Completed',
    tags: ['Node.js', 'Grammy.js', 'MongoDB', 'Docker'],
    summary: 'Deployed high-throughput Telegram bot managing 15,000+ active community members.',
    story: 'TeleAdmin Bot was built to automate user verification, subscription payments, and anti-spam moderation for large Telegram communities.',
    challenges: [
      'Handling Telegram HTTP 429 rate limits during high-volume broadcasts.',
    ],
    lessonsLearned: [
      'Always rate limit outgoing API webhooks using leaky bucket queue algorithms.',
    ],
    connectedProjectSlugs: ['teleadmin-bot'],
    connectedBlogSlugs: ['understanding-async-workflow-engines'],
    prevSlug: 'started-building-autoops-ai',
    nextSlug: 'entered-computer-science-degree',
  },
  {
    slug: 'entered-computer-science-degree',
    title: 'Reached 8.9 CGPA Academic Benchmark',
    subtitle: 'B.Tech Computer Science Engineering',
    date: 'Jan 2026',
    year: '2026',
    category: 'Academics',
    type: 'minor',
    status: 'Completed',
    tags: ['Algorithms', 'DBMS', 'Operating Systems'],
    summary: 'Maintained top academic standing across core Computer Science Engineering coursework.',
    story: 'Consistently applied theoretical computer science concepts—such as database normalization, process scheduling, and memory management—directly to practical software engineering projects.',
    challenges: [
      'Balancing demanding academic coursework with building production software projects.',
    ],
    lessonsLearned: [
      'Theoretical understanding of data structures dramatically improves day-to-day software design choices.',
    ],
    connectedProjectSlugs: [],
    connectedBlogSlugs: [],
    prevSlug: 'built-first-fullstack-app',
  },
];
