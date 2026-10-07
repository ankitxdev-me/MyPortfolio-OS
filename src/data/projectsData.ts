export interface ProjectChallenge {
  id: string;
  title: string;
  problem: string;
  solution: string;
  outcome: string;
}

export interface DetailedProject {
  slug: string;
  title: string;
  subtitle: string;
  category: 'AI / Automation' | 'Web Development' | 'Web3' | 'DevOps';
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  progress: number;
  featured: boolean;
  startDate: string;
  deadline: string;
  githubUrl: string;
  liveUrl: string;
  image: string;
  gallery: { src: string; caption: string }[];
  metrics: { label: string; value: string }[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  overview: string;
  architectureOverview: string;
  features: string[];
  timeline: { date: string; title: string; description: string; status: 'Completed' | 'In Progress' | 'Planned' }[];
  challenges: ProjectChallenge[];
  lessonsLearned: {
    engineering: string;
    architecture: string;
    performance: string;
  };
  relatedArticleSlug?: string;
}

export const PROJECTS_LIST: DetailedProject[] = [
  {
    slug: 'autoops-ai',
    title: 'AutoOps AI',
    subtitle: 'Autonomous Agentic Workflow Automation Platform',
    category: 'AI / Automation',
    description: 'An AI-powered business automation platform that executes multi-step workflows with autonomous agents, real-time telemetry, and resilient task queuing.',
    status: 'In Progress',
    progress: 75,
    featured: true,
    startDate: 'Jul 2026',
    deadline: 'Sep 2026',
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.example.com',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', caption: 'Workflow Canvas Dashboard' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', caption: 'Real-time Telemetry Logs' },
      { src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop', caption: 'Agent Execution Queue' },
    ],
    metrics: [
      { label: 'Execution Speed', value: '120ms' },
      { label: 'Active Agents', value: '14' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Commits', value: '180+' },
    ],
    techStack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      backend: ['Node.js', 'LangChain', 'Express', 'Redis'],
      database: ['PostgreSQL', 'Prisma ORM', 'Pinecone Vector DB'],
      infrastructure: ['Docker', 'Vercel', 'AWS S3', 'GitHub Actions'],
    },
    overview:
      'AutoOps AI solves the challenge of orchestrating multi-agent LLM workflows without manual human intervention. It enables teams to define complex sequence pipelines where autonomous AI agents handle sub-tasks, error retries, and schema validation.',
    architectureOverview:
      'Built around a decoupled event-driven architecture. The frontend submits workflow graphs which are parsed by the execution service, queued via Redis BullMQ, and processed by autonomous agent handlers.',
    features: [
      'Visual Drag-and-Drop Workflow Canvas',
      'Autonomous LLM Agent Task Orchestration',
      'Real-time WebSocket Execution Telemetry',
      'Automatic Fallback & Retry Handling',
      'Vector Memory & Context Retrieval',
    ],
    timeline: [
      { date: 'Jul 10, 2026', title: 'Architecture & Database Design', description: 'Defined entity relationship models and event contract schemas.', status: 'Completed' },
      { date: 'Jul 15, 2026', title: 'Auth & RBAC Module', description: 'Built JWT token validation and role permissions.', status: 'Completed' },
      { date: 'Jul 19, 2026', title: 'Workflow Execution Engine', description: 'Built async queue processing and agent step runners.', status: 'In Progress' },
      { date: 'Sep 30, 2026', title: 'Production Release v1.0', description: 'Final telemetry polish and public deployment.', status: 'Planned' },
    ],
    challenges: [
      {
        id: '1',
        title: 'Async State Machine Desynchronization',
        problem: 'Long-running multi-agent tasks occasionally lost state when sub-steps failed mid-execution.',
        solution: 'Implemented Redis-backed state machine snapshots before each step execution.',
        outcome: 'Zero data loss during execution interruptions with 100% resume reliability.',
      },
      {
        id: '2',
        title: 'LLM Rate Limiting & Latency',
        problem: 'Parallel agent requests frequently hit provider rate limits, causing pipeline timeouts.',
        solution: 'Built an exponential backoff token bucket queue to balance LLM API requests.',
        outcome: 'Reduced failed API calls by 94% under heavy concurrent workflow loads.',
      },
    ],
    lessonsLearned: {
      engineering: 'Always design state machine snapshots early when working with non-deterministic LLM output streams.',
      architecture: 'Event-driven message queues decouple client responsiveness from heavy background processing tasks.',
      performance: 'Caching context vectors locally significantly reduces redundant embedding API calls.',
    },
    relatedArticleSlug: 'building-autoops-ai-sprint-3',
  },
  {
    slug: 'teleadmin-bot',
    title: 'TeleAdmin Bot',
    subtitle: 'Automated Community Management Bot',
    category: 'AI / Automation',
    description: 'High-throughput Telegram bot for automated group moderation, verification, analytics, and auto-publishing.',
    status: 'Completed',
    progress: 100,
    featured: false,
    startDate: 'Mar 2026',
    deadline: 'May 2026',
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.example.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', caption: 'Analytics Dashboard' },
    ],
    metrics: [
      { label: 'Active Users', value: '15,000+' },
      { label: 'Messages Moderated', value: '1.2M' },
      { label: 'Response Time', value: '45ms' },
    ],
    techStack: {
      frontend: ['React', 'Tailwind CSS'],
      backend: ['Node.js', 'Grammy.js', 'Express'],
      database: ['MongoDB', 'Mongoose'],
      infrastructure: ['Docker', 'Railway'],
    },
    overview: 'TeleAdmin Bot manages large Telegram communities automatically filtering spam, processing subscriptions, and delivering analytics.',
    architectureOverview: 'Built with Node.js and Grammy.js bot framework with MongoDB Atlas webhooks.',
    features: ['Anti-Spam Verification', 'Automated Subscription Billing', 'User Activity Heatmaps'],
    timeline: [
      { date: 'Mar 2026', title: 'Bot Core Setup', description: 'Grammy.js setup and command handlers.', status: 'Completed' },
      { date: 'May 2026', title: 'v1.0 Production Launch', description: 'Deployed to Railway with webhook support.', status: 'Completed' },
    ],
    challenges: [
      {
        id: '1',
        title: 'Telegram Rate Limits',
        problem: 'Mass broadcast messages triggered HTTP 429 rate limit errors from Telegram API.',
        solution: 'Paced messages using a leaky bucket rate limiter queue.',
        outcome: 'Broadcasts executed smoothly without hitting Telegram limits.',
      },
    ],
    lessonsLearned: {
      engineering: 'Always pace outgoing bot webhooks to comply with third-party rate limits.',
      architecture: 'Decoupling event handlers from API webhooks ensures rapid response times.',
      performance: 'Indexing user chat IDs in MongoDB improves query speeds tenfold.',
    },
  },
  {
    slug: 'cryptex-os',
    title: 'Cryptex OS',
    subtitle: 'Decentralized Asset & Portfolio Dashboard',
    category: 'Web3',
    description: 'A Web3 analytics platform tracking multi-chain wallet balances, DeFi yields, and token swaps in real-time.',
    status: 'Completed',
    progress: 100,
    featured: false,
    startDate: 'Jan 2026',
    deadline: 'Feb 2026',
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.example.com',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop', caption: 'Wallet Overview' },
    ],
    metrics: [
      { label: 'Chains Supported', value: '6' },
      { label: 'Token Tracked', value: '5,000+' },
    ],
    techStack: {
      frontend: ['React', 'Wagmi', 'Vite', 'Tailwind CSS'],
      backend: ['Ethers.js', 'Alchemy API'],
      database: ['IndexedDB'],
      infrastructure: ['Vercel'],
    },
    overview: 'Cryptex OS aggregates wallet analytics across Ethereum, Polygon, Arbitrum, and Solana.',
    architectureOverview: 'Client-side RPC polling combined with Alchemy WebSockets.',
    features: ['Multi-chain Wallet Aggregation', 'Real-time Yield Tracker', 'Gas Fee Predictor'],
    timeline: [
      { date: 'Jan 2026', title: 'RPC Integration', description: 'Connected Wagmi & Alchemy APIs.', status: 'Completed' },
      { date: 'Feb 2026', title: 'Launch', description: 'Released v1 Web3 dashboard.', status: 'Completed' },
    ],
    challenges: [
      {
        id: '1',
        title: 'Multi-Chain RPC Polling Overhead',
        problem: 'Polling RPC providers across 6 chains consumed massive browser memory.',
        solution: 'Implemented dynamic interval backoff and fallback RPC endpoints.',
        outcome: 'Decreased memory footprint by 60%.',
      },
    ],
    lessonsLearned: {
      engineering: 'Cache token metadata locally to minimize Web3 RPC calls.',
      architecture: 'Decouple chain logic into independent adapter hooks.',
      performance: 'Virtualize token lists to maintain 60fps UI rendering.',
    },
  },
  {
    slug: 'portfolio-cms',
    title: 'Portfolio CMX',
    subtitle: 'Integrated Personal Operating System CMS',
    category: 'Web Development',
    description: 'Custom content management system powering Portfolio OS with dynamic rich text editing, Cloudinary media management, and analytics.',
    status: 'In Progress',
    progress: 90,
    featured: false,
    startDate: 'Jul 2026',
    deadline: 'Aug 2026',
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.example.com',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', caption: 'CMS Dashboard' },
    ],
    metrics: [
      { label: 'Modules', value: '8' },
      { label: 'Editor', value: 'Tiptap' },
    ],
    techStack: {
      frontend: ['Astro', 'React', 'Tailwind CSS', 'shadcn/ui'],
      backend: ['Astro Endpoints', 'TypeScript'],
      database: ['MongoDB Atlas'],
      infrastructure: ['Vercel', 'Cloudinary'],
    },
    overview: 'Portfolio CMX is the administrative engine of Portfolio OS allowing single-admin content operations without code changes.',
    architectureOverview: 'Integrated Astro endpoints with MongoDB Atlas repositories.',
    features: ['Rich Text Tiptap Editor', 'Cloudinary Media Gallery', 'Project Timeline Builder'],
    timeline: [
      { date: 'Jul 2026', title: 'UI Foundation', description: 'Design tokens and component library setup.', status: 'Completed' },
      { date: 'Aug 2026', title: 'CMS Integration', description: 'Connecting forms and DB services.', status: 'In Progress' },
    ],
    challenges: [
      {
        id: '1',
        title: 'Single Application SSR/SSG Hybrid',
        problem: 'Integrating dynamic CMS dashboard routes within static portfolio pages.',
        solution: 'Configured Astro hybrid rendering mode per route.',
        outcome: 'Optimal static performance for public site and instant SSR for dashboard.',
      },
    ],
    lessonsLearned: {
      engineering: 'Isolate administrative dashboard styles from public design system tokens.',
      architecture: 'Repository pattern makes switching databases painless.',
      performance: 'Static generation of public content maximizes Lighthouse performance.',
    },
  },
];
