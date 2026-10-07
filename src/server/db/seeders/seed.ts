import { dbManager } from '../connection';
import { ProjectModel } from '../models/Project.model';
import { BlogModel } from '../models/Blog.model';
import { LearningModel } from '../models/Learning.model';
import { JourneyModel } from '../models/Journey.model';
import { AcademicsModel } from '../models/Academics.model';
import { FreelancingModel } from '../models/Freelancing.model';
import { MediaModel } from '../models/Media.model';
import { SettingsModel } from '../models/Settings.model';
import { ContactMessageModel } from '../models/ContactMessage.model';

import { PROJECTS_LIST } from '@/data/projectsData';
import { BLOGS_LIST } from '@/data/blogsData';
import { TECHNOLOGIES_LIST } from '@/data/learningData';
import { MILESTONES_LIST } from '@/data/journeyData';
import { SEMESTERS_LIST } from '@/data/academicsData';
import { CLIENT_WORK_LIST } from '@/data/freelanceData';
import { MEDIA_ASSETS_LIST } from '@/data/mediaData';
import { SITE_SETTINGS } from '@/data/settingsData';
import { logger } from '../../logger/logger';

export async function seedDatabase(): Promise<{ success: boolean; seededCounts: Record<string, number> }> {
  await dbManager.connect();
  logger.info('🌱 Starting Portfolio OS database seeding process...');

  const seededCounts: Record<string, number> = {};

  try {
    // Clear existing collections
    await Promise.all([
      ProjectModel.deleteMany({}),
      BlogModel.deleteMany({}),
      LearningModel.deleteMany({}),
      JourneyModel.deleteMany({}),
      AcademicsModel.deleteMany({}),
      FreelancingModel.deleteMany({}),
      MediaModel.deleteMany({}),
      SettingsModel.deleteMany({}),
      ContactMessageModel.deleteMany({}),
    ]);

    // Seed Projects
    const projectsPayload = PROJECTS_LIST.map((p: any) => ({
      ...p,
      thumbnailUrl: p.thumbnailUrl || p.image || '/images/projects/autoops.jpg',
      summary: p.summary || p.description || '',
      demoUrl: p.demoUrl || p.liveUrl || '',
      published: p.published ?? true,
    }));
    const projects = await ProjectModel.insertMany(projectsPayload);
    seededCounts.projects = projects.length;

    // Seed Blogs
    const blogsPayload = BLOGS_LIST.map((b: any) => ({
      ...b,
      content: typeof b.content === 'object' ? JSON.stringify(b.content) : String(b.content || b.excerpt || ''),
      publishedAt: b.publishedAt || b.date || new Date().toISOString(),
      coverImageUrl: b.coverImageUrl || b.coverImage || '/images/blog/cover1.jpg',
      readingTimeMinutes: b.readingTimeMinutes || parseInt(b.readTime, 10) || 5,
      published: b.published ?? true,
    }));
    const blogs = await BlogModel.insertMany(blogsPayload);
    seededCounts.blogs = blogs.length;

    // Seed Learning
    const learningPayload = TECHNOLOGIES_LIST.map((t: any) => ({
      slug: t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: t.name,
      category: t.category || 'General',
      proficiency: t.progress ?? t.proficiency ?? 80,
      iconName: t.iconName || 'Code2',
      description: t.description || t.whyLearning || '',
      status: t.status || 'Active Learning',
      startedDate: new Date().toISOString(),
      hoursSpent: t.hoursInvested ?? t.hoursSpent ?? 0,
      keyTakeaways: t.lessonsLearned || t.keyTakeaways || [],
      architectureNotes: t.whyLearning || '',
      recommendedResources: (t.resources || []).map((r: any) => ({
        title: r.name || r.title || 'Resource',
        type: r.type || 'Docs',
        url: r.url || '',
      })),
    }));
    const learning = await LearningModel.insertMany(learningPayload);
    seededCounts.learning = learning.length;

    // Seed Journey
    const journey = await JourneyModel.insertMany(MILESTONES_LIST);
    seededCounts.journey = journey.length;

    // Seed Academics
    const academicsPayload = SEMESTERS_LIST.map((s: any) => ({
      slug: s.slug || `semester-${s.semester || s.semesterNumber || 1}`,
      semesterNumber: s.semester || s.semesterNumber || 1,
      title: s.title || `Semester ${s.semester || 1}`,
      institution: s.institution || s.university || 'Technical University',
      degree: s.degree || 'B.Tech Computer Science',
      duration: s.duration || '6 Months',
      sgpa: s.sgpa || s.gpa || 9.0,
      cgpaToDate: s.cgpaToDate || s.cgpa || s.gpa || 9.0,
      status: s.status || 'Completed',
      subjects: s.courses || s.subjects || [],
      keyAchievements: s.achievements || s.keyAchievements || [],
    }));
    const academics = await AcademicsModel.insertMany(academicsPayload);
    seededCounts.academics = academics.length;

    // Seed Freelancing
    const freelancing = await FreelancingModel.insertMany(CLIENT_WORK_LIST);
    seededCounts.freelancing = freelancing.length;

    // Seed Media
    const mediaPayload = MEDIA_ASSETS_LIST.map((m: any) => ({
      filename: m.filename || m.name || 'image.jpg',
      originalName: m.originalName || m.filename || m.name || 'image.jpg',
      url: m.url || m.src || '/images/projects/autoops.jpg',
      mimeType: m.mimeType || m.type || 'image/jpeg',
      sizeBytes: m.sizeBytes || m.size || 102400,
      folder: m.folder || 'general',
      tags: m.tags || [],
    }));
    const media = await MediaModel.insertMany(mediaPayload);
    seededCounts.media = media.length;

    // Seed Settings
    await SettingsModel.create({ ...SITE_SETTINGS, key: 'global_site_settings' });
    seededCounts.settings = 1;
    seededCounts.contactMessages = 0;

    logger.info('✅ Database seeding process completed successfully!', seededCounts);
    return { success: true, seededCounts };
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  }
}
