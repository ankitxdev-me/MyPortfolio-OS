import mongoose from 'mongoose';
import { ProjectModel } from '../db/models/Project.model';
import { BlogModel } from '../db/models/Blog.model';
import { LearningModel } from '../db/models/Learning.model';
import { JourneyModel } from '../db/models/Journey.model';
import { AcademicsModel } from '../db/models/Academics.model';
import { FreelancingModel } from '../db/models/Freelancing.model';
import { ContactMessageModel } from '../db/models/ContactMessage.model';
import { AuditLogModel } from '../db/models/AuditLogModel';
import { connectDB } from '../db/connection';
import { logger } from '../logger/logger';

export interface DashboardOverviewStats {
  projects: number;
  articles: number;
  learning: number;
  journey: number;
  academics: number;
  freelancing: number;
  supportMessages: number;
  unreadMessages: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  action: string;
  resource: 'Blog' | 'Project' | 'Learning' | 'Journey' | 'Freelancing' | 'Contact' | 'System';
  timestamp: string;
  date: string;
  link?: string;
}

export interface ContentDraftItem {
  id: string;
  title: string;
  category: 'Blog Post' | 'Project Case Study' | 'Learning Guide' | 'Draft';
  lastModified: string;
  completion: number;
  status: string;
  readyToPost: boolean;
  editUrl: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'support' | 'draft' | 'system' | 'error';
  link?: string;
}

export interface DashboardOverviewData {
  stats: DashboardOverviewStats;
  recentActivities: RecentActivityItem[];
  drafts: ContentDraftItem[];
  notifications: DashboardNotification[];
  systemHealth: {
    connected: boolean;
    database: string;
    auth: string;
    imageLinking: string;
  };
}

function formatTimeAgo(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export class DashboardService {
  /**
   * Aggregates live overview metrics, dynamic activities, real drafts, and alerts from MongoDB.
   */
  public async getOverview(): Promise<DashboardOverviewData> {
    await connectDB();

    try {
      // 1. Parallel Collection Counts
      const [
        projectsCount,
        blogsCount,
        learningCount,
        journeyCount,
        academicsCount,
        freelancingCount,
        totalMessagesCount,
        unreadMessagesCount,
      ] = await Promise.all([
        ProjectModel.countDocuments({ isDeleted: { $ne: true } }),
        BlogModel.countDocuments({ isDeleted: { $ne: true } }),
        LearningModel.countDocuments({ isDeleted: { $ne: true } }),
        JourneyModel.countDocuments({ isDeleted: { $ne: true } }),
        AcademicsModel.countDocuments({ isDeleted: { $ne: true } }),
        FreelancingModel.countDocuments({ isDeleted: { $ne: true } }),
        ContactMessageModel.countDocuments({ isDeleted: { $ne: true } }),
        ContactMessageModel.countDocuments({ isDeleted: { $ne: true }, status: 'unread' }),
      ]);

      const stats: DashboardOverviewStats = {
        projects: projectsCount,
        articles: blogsCount,
        learning: learningCount,
        journey: journeyCount,
        academics: academicsCount,
        freelancing: freelancingCount,
        supportMessages: totalMessagesCount,
        unreadMessages: unreadMessagesCount,
      };

      // 2. Fetch Recent Activities across collections & Audit Logs
      const [
        recentAuditLogs,
        recentBlogs,
        recentProjects,
        recentLearning,
        recentMessages,
      ] = await Promise.all([
        AuditLogModel.find().sort({ createdAt: -1 }).limit(10).lean().exec().catch(() => []),
        BlogModel.find({ isDeleted: { $ne: true } }).sort({ updatedAt: -1 }).limit(5).lean().exec().catch(() => []),
        ProjectModel.find({ isDeleted: { $ne: true } }).sort({ updatedAt: -1 }).limit(5).lean().exec().catch(() => []),
        LearningModel.find({ isDeleted: { $ne: true } }).sort({ updatedAt: -1 }).limit(5).lean().exec().catch(() => []),
        ContactMessageModel.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5).lean().exec().catch(() => []),
      ]);

      const activityItems: RecentActivityItem[] = [];

      // A) Audit logs if available
      for (const log of recentAuditLogs) {
        const title = (log.details?.title as string) || `${log.resource} ${log.action.toLowerCase()}`;
        activityItems.push({
          id: String(log._id),
          title,
          action: `${log.action.toUpperCase()} ${log.resource}`,
          resource: (log.resource as any) || 'System',
          timestamp: formatTimeAgo(log.createdAt),
          date: new Date(log.createdAt).toISOString(),
          link: log.resource === 'Blog' ? '/dashboard/blogs' : log.resource === 'Project' ? '/dashboard/projects' : '/dashboard',
        });
      }

      // B) Recent Blogs
      for (const blog of recentBlogs) {
        const isPublished = blog.published && blog.status === 'published';
        activityItems.push({
          id: `blog-${blog._id}`,
          title: blog.title || 'Untitled Blog',
          action: isPublished ? 'Published Article' : 'Updated Blog Draft',
          resource: 'Blog',
          timestamp: formatTimeAgo(blog.updatedAt || blog.createdAt),
          date: new Date(blog.updatedAt || blog.createdAt).toISOString(),
          link: '/dashboard/blogs',
        });
      }

      // C) Recent Projects
      for (const proj of recentProjects) {
        activityItems.push({
          id: `proj-${proj._id}`,
          title: proj.title || 'Untitled Project',
          action: proj.published ? 'Published Case Study' : `Updated Project (${proj.progress || 0}%)`,
          resource: 'Project',
          timestamp: formatTimeAgo(proj.updatedAt || proj.createdAt),
          date: new Date(proj.updatedAt || proj.createdAt).toISOString(),
          link: '/dashboard/projects',
        });
      }

      // D) Recent Learning
      for (const learn of recentLearning) {
        activityItems.push({
          id: `learn-${learn._id}`,
          title: learn.name || learn.title || 'Learning Topic',
          action: 'Updated Skill / Course',
          resource: 'Learning',
          timestamp: formatTimeAgo(learn.updatedAt || learn.createdAt),
          date: new Date(learn.updatedAt || learn.createdAt).toISOString(),
          link: '/dashboard/learning',
        });
      }

      // E) Recent Contact Messages
      for (const msg of recentMessages) {
        activityItems.push({
          id: `msg-${msg._id}`,
          title: `${msg.name} — ${msg.subject || 'Inquiry'}`,
          action: 'New Contact / Support Message',
          resource: 'Contact',
          timestamp: formatTimeAgo(msg.createdAt),
          date: new Date(msg.createdAt).toISOString(),
          link: '/dashboard/support',
        });
      }

      // Sort all combined activities by date descending and pick top 8
      activityItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const dedupedActivities = activityItems.slice(0, 8);

      // 3. Query Real Drafts in Progress
      const [draftBlogs, draftProjects, inProgressLearning] = await Promise.all([
        BlogModel.find({
          isDeleted: { $ne: true },
          $or: [{ status: 'draft' }, { published: false }],
        })
          .sort({ updatedAt: -1 })
          .limit(4)
          .lean()
          .exec()
          .catch(() => []),

        ProjectModel.find({
          isDeleted: { $ne: true },
          $or: [{ status: 'Draft' }, { status: 'In Progress' }, { published: false }],
        })
          .sort({ updatedAt: -1 })
          .limit(4)
          .lean()
          .exec()
          .catch(() => []),

        LearningModel.find({
          isDeleted: { $ne: true },
          $or: [{ status: 'In Progress' }, { published: false }],
        })
          .sort({ updatedAt: -1 })
          .limit(4)
          .lean()
          .exec()
          .catch(() => []),
      ]);

      const drafts: ContentDraftItem[] = [];

      for (const b of draftBlogs) {
        let completion = 40;
        if (b.title) completion += 15;
        if (b.excerpt) completion += 15;
        if (b.content && b.content.length > 200) completion += 20;
        if (b.coverImage) completion += 10;
        completion = Math.min(completion, 95);

        drafts.push({
          id: String(b._id),
          title: b.title || 'Untitled Blog Post',
          category: 'Blog Post',
          lastModified: formatTimeAgo(b.updatedAt || b.createdAt),
          completion,
          status: b.status || 'Draft',
          readyToPost: completion >= 75,
          editUrl: '/dashboard/blogs',
        });
      }

      for (const p of draftProjects) {
        const completion = p.progress || (p.title && p.description ? 65 : 40);
        drafts.push({
          id: String(p._id),
          title: p.title || 'Untitled Project',
          category: 'Project Case Study',
          lastModified: formatTimeAgo(p.updatedAt || p.createdAt),
          completion,
          status: p.status || 'Draft',
          readyToPost: completion >= 70,
          editUrl: '/dashboard/projects',
        });
      }

      for (const l of inProgressLearning) {
        const completion = l.progressPercent || l.proficiency || 50;
        drafts.push({
          id: String(l._id),
          title: l.name || l.title || 'Learning Guide',
          category: 'Learning Guide',
          lastModified: formatTimeAgo(l.updatedAt || l.createdAt),
          completion,
          status: l.status || 'In Progress',
          readyToPost: completion >= 80,
          editUrl: '/dashboard/learning',
        });
      }

      // 4. Generate Live Notifications & Alerts
      const notifications: DashboardNotification[] = [];

      // Unread support messages alerts
      const unreadMessages = await ContactMessageModel.find({
        isDeleted: { $ne: true },
        status: 'unread',
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean()
        .exec()
        .catch(() => []);

      for (const msg of unreadMessages) {
        notifications.push({
          id: `notif-msg-${msg._id}`,
          title: `Support Message: ${msg.name}`,
          message: `${msg.subject ? `"${msg.subject}": ` : ''}${msg.message.slice(0, 75)}${msg.message.length > 75 ? '...' : ''}`,
          time: formatTimeAgo(msg.createdAt),
          unread: true,
          type: 'support',
          link: '/dashboard/support',
        });
      }

      // Ready-to-post drafts alert
      const readyDrafts = drafts.filter((d) => d.readyToPost);
      if (readyDrafts.length > 0) {
        notifications.push({
          id: 'notif-drafts-ready',
          title: `${readyDrafts.length} Draft${readyDrafts.length > 1 ? 's' : ''} Ready to Post`,
          message: `"${readyDrafts[0].title}" is ready for publication.`,
          time: readyDrafts[0].lastModified,
          unread: true,
          type: 'draft',
          link: readyDrafts[0].editUrl,
        });
      }

      // MongoDB System Health Notification
      const isConnected = mongoose.connection.readyState === 1;
      notifications.push({
        id: 'notif-sys-health',
        title: isConnected ? 'Database Connected' : 'Database Alert',
        message: isConnected
          ? `MongoDB Atlas operational across ${stats.projects + stats.articles + stats.learning} tracked entities.`
          : 'Database connection is re-establishing.',
        time: 'Live',
        unread: false,
        type: 'system',
      });

      return {
        stats,
        recentActivities: dedupedActivities,
        drafts: drafts.slice(0, 6),
        notifications,
        systemHealth: {
          connected: isConnected,
          database: 'MongoDB Atlas',
          auth: 'JWT Active',
          imageLinking: 'External Direct URL',
        },
      };
    } catch (error) {
      logger.error('DashboardService.getOverview failed', { error });
      // Fallback
      return {
        stats: {
          projects: 0,
          articles: 0,
          learning: 0,
          journey: 0,
          academics: 0,
          freelancing: 0,
          supportMessages: 0,
          unreadMessages: 0,
        },
        recentActivities: [],
        drafts: [],
        notifications: [
          {
            id: 'err-load',
            title: 'Connection Warning',
            message: 'Could not fetch live dashboard metrics. Retrying in background...',
            time: 'Just now',
            unread: true,
            type: 'error',
          },
        ],
        systemHealth: {
          connected: false,
          database: 'MongoDB Atlas',
          auth: 'JWT Active',
          imageLinking: 'External Direct URL',
        },
      };
    }
  }
}

export const dashboardService = new DashboardService();
