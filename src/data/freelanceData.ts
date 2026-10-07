export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  techStack: string[];
}

export interface ClientTestimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  projectTitle: string;
  rating: number;
  feedback: string;
  avatar?: string;
}

export interface DetailedClientWork {
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  projectType: string;
  duration: string;
  status: 'Completed' | 'In Progress' | 'Draft' | 'Planned' | string;
  published?: boolean;
  featured?: boolean;
  techStack: string[];
  description: string;
  objectives: string[];
  deliverables: string[];
  challenges: { problem: string; solution: string; outcome: string }[];
  businessImpact: { metric: string; label: string }[];
  testimonial?: ClientTestimonial;
  connectedProjectSlug?: string;
}

export const FREELANCE_SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'Full Stack Web Applications',
    category: 'Web Engineering',
    description: 'Custom, high-performance web applications built with Next.js, React, Astro, TypeScript, and modern database architectures.',
    features: ['Responsive Glassmorphism UI', 'Serverless & SSR Integration', 'Database & API Architecture', 'SEO & Performance Optimization'],
    techStack: ['Next.js', 'React', 'Astro', 'TypeScript', 'Tailwind', 'PostgreSQL'],
  },
  {
    id: '2',
    title: 'Autonomous AI & Agentic Workflows',
    category: 'AI & Automation',
    description: 'Integrating LLM agents, vector databases, LangChain, and automated workflow execution into existing products.',
    features: ['Multi-Agent Task Runners', 'Vector Memory & Retrieval', 'LLM Schema Correction', 'Redis Execution Queues'],
    techStack: ['LangChain', 'Node.js', 'Redis', 'Pinecone', 'Python'],
  },
  {
    id: '3',
    title: 'High-Throughput Telegram Bots & Automation',
    category: 'Bot Systems',
    description: 'Automated community management, billing integration, anti-spam verification, and custom Web3 Telegram bots.',
    features: ['Webhook Infrastructure', 'Payment Gateway Billing', 'Anti-Spam Verification', 'Analytics Dashboards'],
    techStack: ['Node.js', 'Grammy.js', 'MongoDB', 'Docker', 'Railway'],
  },
];

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: '1',
    clientName: 'Alex Rivera',
    role: 'Founder & CEO',
    company: 'Nexus Fintech',
    projectTitle: 'Nexus Fintech Dashboard',
    rating: 5,
    feedback: 'Ankit delivered an exceptional dashboard ahead of schedule. The execution speed, attention to detail, and modern UI design exceeded our expectations.',
  },
  {
    id: '2',
    clientName: 'Elena Rostova',
    role: 'Head of Operations',
    company: 'AutoFlow Global',
    projectTitle: 'AI Support Automation',
    rating: 5,
    feedback: 'The AI workflow runner Ankit built reduced our ticket triage response times by 70%. Highly professional engineer!',
  },
];

export const CLIENT_WORK_LIST: DetailedClientWork[] = [
  {
    slug: 'nexus-fintech-dashboard',
    title: 'Nexus Fintech Dashboard',
    clientName: 'Nexus Fintech Inc.',
    industry: 'Fintech & Payments',
    projectType: 'Full-Stack Dashboard',
    duration: '6 Weeks',
    status: 'Completed',
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma'],
    description: 'A high-speed analytics and payment management dashboard processing high-frequency transaction data with real-time charts.',
    objectives: [
      'Build real-time transaction streaming views.',
      'Implement multi-tenant role-based access control (RBAC).',
      'Optimize Lighthouse performance scores above 95.',
    ],
    deliverables: [
      'Interactive Analytics Canvas',
      'Stripe & Crypto Billing Integration',
      'Automated PDF Invoice Exporter',
    ],
    challenges: [
      {
        problem: 'Real-time WebSocket data stream caused laggy UI re-renders.',
        solution: 'Debounced chart state updates and used React virtualized data tables.',
        outcome: 'Maintained smooth 60fps table scrolling under 1,000+ live transactions.',
      },
    ],
    businessImpact: [
      { metric: '70%', label: 'Faster Load Times' },
      { metric: '100%', label: 'On-Time Delivery' },
      { metric: '$2.5M+', label: 'Volume Processed' },
    ],
    testimonial: CLIENT_TESTIMONIALS[0],
    connectedProjectSlug: 'autoops-ai',
  },
  {
    slug: 'ai-support-automation',
    title: 'AI Customer Support Automation',
    clientName: 'AutoFlow Global',
    industry: 'SaaS & E-Commerce',
    projectType: 'AI Agentic Integration',
    duration: '4 Weeks',
    status: 'Completed',
    techStack: ['Node.js', 'LangChain', 'Redis', 'BullMQ', 'Docker'],
    description: 'Autonomous customer support agent executing multi-step refund verification and ticket triage automatically.',
    objectives: [
      'Automate tier-1 support ticket classification.',
      'Integrate LLM tool calling with Shopify API.',
      'Provide fallback human handoff alerts.',
    ],
    deliverables: [
      'LangChain Agentic Runner',
      'Redis Task Queue',
      'Slack Handoff Webhooks',
    ],
    challenges: [
      {
        problem: 'LLMs occasionally returned invalid JSON formatting.',
        solution: 'Implemented schema validation middleware with automated retry loops.',
        outcome: 'Achieved 99.4% structured output reliability.',
      },
    ],
    businessImpact: [
      { metric: '70%', label: 'Ticket Triage Reduction' },
      { metric: '24/7', label: 'Automated Coverage' },
    ],
    testimonial: CLIENT_TESTIMONIALS[1],
  },
];
