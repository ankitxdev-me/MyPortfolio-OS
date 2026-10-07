export interface DashboardStats {
  projects: number;
  articles: number;
  learningTopics: number;
  journeyEvents: number;
  academicsRecords: number;
  freelancingProjects: number;
  mediaAssets: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  action: string;
  timestamp: string;
}

export interface ContentDraft {
  id: string;
  title: string;
  category: string;
  lastModified: string;
  completion: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'system' | 'update' | 'draft';
}

export interface StorageBreakdown {
  usedGb: number;
  totalGb: number;
  breakdown: { type: string; sizeGb: number; color: string }[];
}

export const DASHBOARD_STATS: DashboardStats = {
  projects: 12,
  articles: 25,
  learningTopics: 18,
  journeyEvents: 14,
  academicsRecords: 6,
  freelancingProjects: 8,
  mediaAssets: 42,
};

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Nexus Fintech Dashboard Case Study',
    action: 'Published Case Study',
    timestamp: '10 minutes ago',
  },
  {
    id: '2',
    title: 'Building Agentic Workflows with LangChain',
    action: 'Updated Article Draft',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    title: 'Distributed Systems & Consensus Architecture',
    action: 'Added Course Note',
    timestamp: '3 hours ago',
  },
  {
    id: '4',
    title: 'fintech_dashboard_preview.png',
    action: 'Uploaded Asset',
    timestamp: 'Yesterday',
  },
];

export const CONTENT_DRAFTS: ContentDraft[] = [
  {
    id: '1',
    title: 'Building High-Throughput Telegram Bots with Grammy.js',
    category: 'Blog Post',
    lastModified: '2 hours ago',
    completion: 80,
  },
  {
    id: '2',
    title: 'Cryptex OS - Decentralized Asset Terminal',
    category: 'Project Case Study',
    lastModified: 'Yesterday',
    completion: 60,
  },
  {
    id: '3',
    title: 'Vector Databases in Production (Pinecone vs Qdrant)',
    category: 'Learning Guide',
    lastModified: '3 days ago',
    completion: 40,
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'System Health Check',
    message: 'All 143 workspace routes generated and static pages pre-rendered cleanly.',
    time: '5m ago',
    unread: true,
    type: 'system',
  },
  {
    id: '2',
    title: 'Draft Auto-saved',
    message: '"Building Agentic Workflows with LangChain" auto-saved to local drafts.',
    time: '1h ago',
    unread: true,
    type: 'draft',
  },
  {
    id: '3',
    title: 'Deployment Ready',
    message: 'Sprint 2.12 Dashboard UI Foundation ready for preview testing.',
    time: '2h ago',
    unread: false,
    type: 'update',
  },
];

export const STORAGE_DATA: StorageBreakdown = {
  usedGb: 4.2,
  totalGb: 10,
  breakdown: [
    { type: 'Images', sizeGb: 2.4, color: 'bg-primary' },
    { type: 'Documents & Code', sizeGb: 1.1, color: 'bg-emerald-400' },
    { type: 'Build Artifacts', sizeGb: 0.7, color: 'bg-amber-400' },
  ],
};
