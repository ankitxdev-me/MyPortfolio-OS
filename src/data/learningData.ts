export interface TechnologyDetail {
  slug: string;
  name: string;
  category: 'AI / ML' | 'Backend' | 'Web Dev' | 'DevOps' | 'Database';
  level: 'Advanced' | 'Intermediate' | 'Exploring';
  progress: number;
  status: 'Mastered' | 'Active Learning' | 'Exploring';
  hoursInvested: number;
  projectsCount: number;
  blogsCount: number;
  description: string;
  whyLearning: string;
  lessonsLearned: string[];
  resources: { name: string; type: 'Course' | 'Book' | 'Docs'; url: string }[];
  connectedProjectSlugs: string[];
  connectedBlogSlugs: string[];
}

export interface ActiveCourse {
  id: string;
  title: string;
  platform: string;
  progress: number;
  nextChapter: string;
  estimatedCompletion: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  url: string;
}

export const ACTIVE_COURSES: ActiveCourse[] = [
  {
    id: '1',
    title: 'Advanced System Design & Distributed Queues',
    platform: 'Educative.io',
    progress: 75,
    nextChapter: 'Chapter 8: Redis Pub/Sub & Stream Processing',
    estimatedCompletion: 'Aug 2026',
  },
  {
    id: '2',
    title: 'LangChain & Autonomous AI Agent Architectures',
    platform: 'DeepLearning.AI',
    progress: 85,
    nextChapter: 'Chapter 5: Memory & Vector Retrieval Systems',
    estimatedCompletion: 'Aug 2026',
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    id: '1',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issueDate: 'May 2026',
    credentialId: 'AWS-ASA-99201',
    url: 'https://aws.amazon.com',
  },
  {
    id: '2',
    title: 'LangChain Agent Developer Certification',
    issuer: 'DeepLearning.AI',
    issueDate: 'Jun 2026',
    credentialId: 'DL-LC-55102',
    url: 'https://deeplearning.ai',
  },
];

export const TECHNOLOGIES_LIST: TechnologyDetail[] = [
  {
    slug: 'langchain',
    name: 'LangChain & Agentic AI',
    category: 'AI / ML',
    level: 'Intermediate',
    progress: 80,
    status: 'Active Learning',
    hoursInvested: 110,
    projectsCount: 2,
    blogsCount: 1,
    description: 'Framework for developing applications powered by language models with state management and tool calling.',
    whyLearning: 'Essential for building autonomous AI agents capable of multi-step task execution and vector retrieval in AutoOps AI.',
    lessonsLearned: [
      'Always enforce strict JSON schema output validation for non-deterministic LLM calls.',
      'Vector databases perform best when documents are chunked dynamically by semantic context rather than fixed token length.',
    ],
    resources: [
      { name: 'LangChain Official Documentation', type: 'Docs', url: 'https://js.langchain.com' },
      { name: 'Generative AI with LLMs', type: 'Course', url: 'https://coursera.org' },
    ],
    connectedProjectSlugs: ['autoops-ai', 'teleadmin-bot'],
    connectedBlogSlugs: ['building-autoops-ai-sprint-3'],
  },
  {
    slug: 'typescript',
    name: 'TypeScript',
    category: 'Web Dev',
    level: 'Advanced',
    progress: 95,
    status: 'Mastered',
    hoursInvested: 240,
    projectsCount: 4,
    blogsCount: 2,
    description: 'Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    whyLearning: 'Primary language across Portfolio OS codebase ensuring type safety, rapid refactoring, and strict interfaces.',
    lessonsLearned: [
      'Use discriminating unions for state machine types to guarantee exhaustive pattern matching.',
      'Prefer interface extensions over type intersection for cleaner diagnostic error messages.',
    ],
    resources: [
      { name: 'TypeScript Handbook', type: 'Docs', url: 'https://typescriptlang.org' },
      { name: 'Total TypeScript', type: 'Course', url: 'https://totaltypescript.com' },
    ],
    connectedProjectSlugs: ['autoops-ai', 'cryptex-os', 'portfolio-cms'],
    connectedBlogSlugs: ['building-autoops-ai-sprint-3', 'understanding-async-workflow-engines'],
  },
  {
    slug: 'nextjs',
    name: 'Next.js 14',
    category: 'Web Dev',
    level: 'Advanced',
    progress: 90,
    status: 'Mastered',
    hoursInvested: 180,
    projectsCount: 3,
    blogsCount: 1,
    description: 'The React Framework for the Web with App Router, Server Components, and Streaming.',
    whyLearning: 'Used for high-performance full-stack web applications and SaaS platforms.',
    lessonsLearned: [
      'Keep Server Components as leaves when possible to reduce client bundle hydration costs.',
      'Use Route Handlers for decoupled JSON API endpoints.',
    ],
    resources: [
      { name: 'Next.js Docs', type: 'Docs', url: 'https://nextjs.org' },
    ],
    connectedProjectSlugs: ['autoops-ai'],
    connectedBlogSlugs: ['why-i-switched-to-astro'],
  },
  {
    slug: 'redis',
    name: 'Redis & BullMQ',
    category: 'Backend',
    level: 'Intermediate',
    progress: 75,
    status: 'Active Learning',
    hoursInvested: 85,
    projectsCount: 2,
    blogsCount: 2,
    description: 'In-memory data structure store used as a database, cache, streaming engine, and message broker.',
    whyLearning: 'Powers background task execution queues and real-time state machine recovery.',
    lessonsLearned: [
      'Always configure eviction policies (allkeys-lru) when using Redis as a cache.',
      'Use Redis Streams for event pub/sub with consumer groups.',
    ],
    resources: [
      { name: 'Redis University', type: 'Course', url: 'https://redis.io' },
    ],
    connectedProjectSlugs: ['autoops-ai'],
    connectedBlogSlugs: ['building-autoops-ai-sprint-3', 'understanding-async-workflow-engines'],
  },
  {
    slug: 'docker',
    name: 'Docker & Containers',
    category: 'DevOps',
    level: 'Intermediate',
    progress: 85,
    status: 'Mastered',
    hoursInvested: 95,
    projectsCount: 3,
    blogsCount: 1,
    description: 'Set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.',
    whyLearning: 'Ensures identical production environments and seamless multi-container microservice local development.',
    lessonsLearned: [
      'Multi-stage Docker builds reduce final production image size by up to 80%.',
      'Never run containers as root user in production environments.',
    ],
    resources: [
      { name: 'Docker Docs', type: 'Docs', url: 'https://docker.com' },
    ],
    connectedProjectSlugs: ['autoops-ai', 'teleadmin-bot'],
    connectedBlogSlugs: ['building-autoops-ai-sprint-3'],
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL & Prisma ORM',
    category: 'Database',
    level: 'Advanced',
    progress: 90,
    status: 'Mastered',
    hoursInvested: 130,
    projectsCount: 3,
    blogsCount: 1,
    description: 'Powerful, open source object-relational database system with Prisma ORM type safety.',
    whyLearning: 'Primary relational database for user accounts, workflow metadata, and audit logs.',
    lessonsLearned: [
      'Index foreign keys and frequent query filters to prevent full table scans.',
      'Use database migrations for reproducible deployment schema changes.',
    ],
    resources: [
      { name: 'PostgreSQL Docs', type: 'Docs', url: 'https://postgresql.org' },
    ],
    connectedProjectSlugs: ['autoops-ai'],
    connectedBlogSlugs: ['understanding-async-workflow-engines'],
  },
];
