export interface DetailedBlog {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: 'Engineering' | 'Backend' | 'Web Dev' | 'AI / ML' | 'DevOps';
  tags: string[];
  featured: boolean;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  toc: { id: string; title: string; level: number }[];
  content: {
    introduction: string;
    sections: {
      id: string;
      title: string;
      paragraphs: string[];
      codeBlock?: {
        filename: string;
        language: string;
        code: string;
      };
      callout?: {
        type: 'note' | 'tip' | 'warning' | 'important';
        title: string;
        message: string;
      };
    }[];
    conclusion: string;
  };
  relatedProjectSlug?: string;
  prevSlug?: string;
  nextSlug?: string;
}

export const BLOGS_LIST: DetailedBlog[] = [
  {
    slug: 'building-autoops-ai-sprint-3',
    title: 'Building AutoOps AI - Sprint 3 Completed',
    subtitle: 'Orchestrating Autonomous Workflow Agents with Resilient Queuing',
    excerpt: 'In this post, I share how we built the workflow execution engine and handled complex async state machines using BullMQ, Redis, and LangChain.',
    date: 'July 19, 2026',
    readTime: '5 min read',
    category: 'Engineering',
    tags: ['Next.js', 'LangChain', 'Redis', 'TypeScript', 'Docker'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Ankit Gupta',
      role: 'Software Engineer & AI Developer',
      avatar: '/images/ankit_hero_avatar.jpg',
      bio: 'Building AutoOps AI and documenting developer tools.',
    },
    toc: [
      { id: 'the-challenge', title: '1. The Core Architecture Challenge', level: 2 },
      { id: 'redis-queuing', title: '2. Redis & BullMQ Workflow Queue', level: 2 },
      { id: 'agent-orchestration', title: '3. Agent Orchestration Engine', level: 2 },
      { id: 'key-takeaways', title: '4. Lessons & Next Steps', level: 2 },
    ],
    content: {
      introduction:
        'Building an autonomous workflow automation platform requires robust queue management and state machine recovery. In Sprint 3 of AutoOps AI, we focused on replacing inline execution with resilient background worker queues.',
      sections: [
        {
          id: 'the-challenge',
          title: '1. The Core Architecture Challenge',
          paragraphs: [
            'When users build multi-step workflow pipelines, individual agent tasks can take anywhere from 500ms to 30 seconds depending on LLM response times and external API calls. Running these synchronously inside HTTP endpoints caused severe gateway timeouts.',
            'We needed a decoupled worker model that could pause workflows mid-step, log execution telemetry, and retry failed API calls automatically without blocking the main event loop.',
          ],
          callout: {
            type: 'important',
            title: 'Architectural Principle',
            message: 'Never process long-running agentic LLM calls directly inside web request handlers. Always offload them to isolated background workers.',
          },
        },
        {
          id: 'redis-queuing',
          title: '2. Redis & BullMQ Workflow Queue',
          paragraphs: [
            'We integrated BullMQ with Redis to manage step execution jobs. Each node in the workflow graph maps to a discrete job with snapshot metadata.',
          ],
          codeBlock: {
            filename: 'services/workflowQueue.ts',
            language: 'typescript',
            code: `import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';

export const workflowQueue = new Queue('workflow-execution', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
});

export const worker = new Worker('workflow-execution', async (job) => {
  const { workflowId, stepId, payload } = job.data;
  console.log(\`[Worker] Executing step \${stepId} for workflow \${workflowId}\`);
  // Agentic execution runner logic...
}, { connection: redisConnection });`,
          },
        },
        {
          id: 'agent-orchestration',
          title: '3. Agent Orchestration Engine',
          paragraphs: [
            'LangChain agents are wrapped in custom schema validators. If an agent produces invalid JSON structured output, a feedback loop sends the schema violation back to the LLM to self-correct.',
          ],
        },
      ],
      conclusion:
        'With Sprint 3 complete, AutoOps AI can execute resilient multi-step workflows with 99.9% queue reliability. Next up in Sprint 4 is real-time WebSocket telemetry and frontend canvas node monitoring!',
    },
    relatedProjectSlug: 'autoops-ai',
    nextSlug: 'understanding-async-workflow-engines',
  },
  {
    slug: 'understanding-async-workflow-engines',
    title: 'Understanding Async Workflow Engines in Node.js',
    subtitle: 'Event-driven Architectures, Queues & State Machine Recovery',
    excerpt: 'A deep dive into building event-driven workflow architectures with queuing systems, idempotency keys, and retry strategies.',
    date: 'July 14, 2026',
    readTime: '8 min read',
    category: 'Backend',
    tags: ['Node.js', 'System Design', 'Redis', 'Architecture'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Ankit Gupta',
      role: 'Software Engineer & AI Developer',
      avatar: '/images/ankit_hero_avatar.jpg',
      bio: 'Building AutoOps AI and documenting developer tools.',
    },
    toc: [
      { id: 'why-queues', title: '1. Why Traditional DBs Fail at Queuing', level: 2 },
      { id: 'idempotency', title: '2. Implementing Idempotency Keys', level: 2 },
    ],
    content: {
      introduction:
        'As software systems scale, background task execution becomes critical. This article breaks down how to build asynchronous workflow engines in Node.js without falling into common concurrency traps.',
      sections: [
        {
          id: 'why-queues',
          title: '1. Why Traditional DBs Fail at Queuing',
          paragraphs: [
            'Using SQL databases as job queues leads to lock contention and high latency. Dedicated in-memory data structures like Redis Streams or BullMQ provide lock-free concurrency handling.',
          ],
          callout: {
            type: 'note',
            title: 'Performance Insight',
            message: 'Redis list operations like RPOPLPUSH execute in O(1) time complexity, whereas SQL queries require table scanning and row locking.',
          },
        },
        {
          id: 'idempotency',
          title: '2. Implementing Idempotency Keys',
          paragraphs: [
            'To prevent duplicate executions when workers crash, every workflow step must accept a unique idempotency key.',
          ],
          codeBlock: {
            filename: 'middleware/idempotency.ts',
            language: 'typescript',
            code: `export function generateIdempotencyKey(workflowId: string, stepId: string): string {
  return \`idempotent:\${workflowId}:\${stepId}\`;
}`,
          },
        },
      ],
      conclusion: 'Building durable workflow engines requires decoupling execution from storage. Redis plus idempotency keys provide the optimal balance.',
    },
    prevSlug: 'building-autoops-ai-sprint-3',
    nextSlug: 'why-i-switched-to-astro',
  },
  {
    slug: 'why-i-switched-to-astro',
    title: 'Why I Switched to Astro for Static Content',
    subtitle: 'Zero JS Footprint, Islands Architecture & Developer Experience',
    excerpt: 'Evaluating Astro vs Next.js for content-rich developer portfolios, documentation sites, and personal operating systems.',
    date: 'July 10, 2026',
    readTime: '4 min read',
    category: 'Web Dev',
    tags: ['Astro', 'React', 'Tailwind', 'Performance'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Ankit Gupta',
      role: 'Software Engineer & AI Developer',
      avatar: '/images/ankit_hero_avatar.jpg',
      bio: 'Building AutoOps AI and documenting developer tools.',
    },
    toc: [
      { id: 'zero-js', title: '1. The Zero-JS Default', level: 2 },
      { id: 'islands', title: '2. React Islands Integration', level: 2 },
    ],
    content: {
      introduction:
        'When building Portfolio OS, performance and fast page load times were paramount. Here is why Astro was chosen over Next.js for content rendering.',
      sections: [
        {
          id: 'zero-js',
          title: '1. The Zero-JS Default',
          paragraphs: [
            'Astro renders HTML on the server and strips unnecessary client-side JavaScript by default. This results in perfect 100 Lighthouse performance scores.',
          ],
        },
        {
          id: 'islands',
          title: '2. React Islands Integration',
          paragraphs: [
            'Where interactivity is needed—such as interactive search bars or complex filters—Astro allows mounting React components using client directives like client:visible.',
          ],
        },
      ],
      conclusion: 'Astro provides the perfect architecture for developer portfolios and technical documentation platforms.',
    },
    prevSlug: 'understanding-async-workflow-engines',
  },
];
