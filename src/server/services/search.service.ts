import { projectRepository } from '../db/repositories/ProjectRepository';
import { blogRepository } from '../db/repositories/BlogRepository';
import { learningRepository } from '../db/repositories/LearningRepository';
import { journeyRepository } from '../db/repositories/JourneyRepository';
import { academicsRepository } from '../db/repositories/AcademicsRepository';
import { freelancingRepository } from '../db/repositories/FreelancingRepository';

import { TECHNOLOGIES_LIST } from '@/data/learningData';
import { MILESTONES_LIST } from '@/data/journeyData';

export interface SearchResultItem {
  id: string;
  type: 'project' | 'blog' | 'learning' | 'journey' | 'academic' | 'freelance';
  title: string;
  subtitle?: string;
  description: string;
  slug: string;
  url: string;
  category?: string;
  tags?: string[];
  image?: string;
  score: number;
}

export interface SearchOptions {
  query?: string;
  type?: 'all' | 'project' | 'blog' | 'learning' | 'journey' | 'academic' | 'freelance';
  category?: string;
  tag?: string;
  limit?: number;
  page?: number;
}

export class SearchService {
  /**
   * Search across all portfolio modules with relevance scoring
   */
  public async globalSearch(options: SearchOptions) {
    const q = (options.query || '').trim().toLowerCase();
    const targetType = options.type || 'all';
    const limit = options.limit || 20;
    const page = options.page || 1;

    let items: SearchResultItem[] = [];

    // 1. Projects
    if (targetType === 'all' || targetType === 'project') {
      let dbProjects: any[] = [];
      try {
        dbProjects = await projectRepository.find({ published: { $ne: false }, status: { $nin: ['Draft', 'Planned'] } });
      } catch (e) {
        dbProjects = [];
      }

      const projectsSource = dbProjects;
      projectsSource.forEach((p) => {
        const score = this.calculateRelevance(q, p.title, p.description, p.category, p.techStack?.frontend || []);
        if (!q || score > 0) {
          items.push({
            id: p.id || p.slug,
            type: 'project',
            title: p.title,
            description: p.description,
            slug: p.slug,
            url: `/projects/${p.slug}`,
            category: p.category || 'Engineering',
            tags: p.techStack?.frontend || [],
            image: p.image,
            score,
          });
        }
      });
    }

    // 2. Blogs
    if (targetType === 'all' || targetType === 'blog') {
      let dbBlogs: any[] = [];
      try {
        dbBlogs = await blogRepository.find({ published: { $ne: false }, status: { $nin: ['draft', 'Draft', 'Planned', 'archived'] } });
      } catch (e) {
        dbBlogs = [];
      }

      const blogsSource = dbBlogs;
      blogsSource.forEach((b) => {
        const score = this.calculateRelevance(q, b.title, b.excerpt, b.category, b.tags || []);
        if (!q || score > 0) {
          items.push({
            id: b.id || b.slug,
            type: 'blog',
            title: b.title,
            description: b.excerpt,
            slug: b.slug,
            url: `/blog/${b.slug}`,
            category: b.category,
            tags: b.tags || [],
            image: b.coverImage,
            score,
          });
        }
      });
    }

    // 3. Learning
    if (targetType === 'all' || targetType === 'learning') {
      let dbLearning: any[] = [];
      try {
        dbLearning = await learningRepository.find();
      } catch (e) {
        dbLearning = [];
      }

      const learningSource = dbLearning.length > 0 ? dbLearning : TECHNOLOGIES_LIST;
      learningSource.forEach((t) => {
        const score = this.calculateRelevance(q, t.name, t.description, t.category, []);
        if (!q || score > 0) {
          items.push({
            id: t.id || t.slug,
            type: 'learning',
            title: t.name,
            description: t.description,
            slug: t.slug,
            url: `/learning/${t.slug}`,
            category: t.category,
            score,
          });
        }
      });
    }

    // 4. Journey
    if (targetType === 'all' || targetType === 'journey') {
      let dbJourney: any[] = [];
      try {
        dbJourney = await journeyRepository.find();
      } catch (e) {
        dbJourney = [];
      }

      const journeySource = dbJourney.length > 0 ? dbJourney : MILESTONES_LIST;
      journeySource.forEach((m) => {
        const score = this.calculateRelevance(q, m.title, m.summary, m.category, m.tags || []);
        if (!q || score > 0) {
          items.push({
            id: m.id || m.slug,
            type: 'journey',
            title: m.title,
            subtitle: m.subtitle,
            description: m.summary,
            slug: m.slug,
            url: `/journey/${m.slug}`,
            category: m.category,
            tags: m.tags || [],
            score,
          });
        }
      });
    }

    // 5. Academics
    if (targetType === 'all' || targetType === 'academic') {
      let dbAcademics: any[] = [];
      try {
        dbAcademics = await academicsRepository.find({ published: { $ne: false }, status: { $nin: ['Draft', 'draft', 'Planned'] } });
      } catch (e) {
        dbAcademics = [];
      }

      const academicsSource = dbAcademics;
      academicsSource.forEach((s) => {
        const score = this.calculateRelevance(q, s.title, s.summary, 'Academic', []);
        if (!q || score > 0) {
          items.push({
            id: s.id || s.slug,
            type: 'academic',
            title: s.title,
            description: s.summary,
            slug: s.slug,
            url: '/academics',
            category: 'Academic Transcript',
            score,
          });
        }
      });
    }

    // 6. Freelance
    if (targetType === 'all' || targetType === 'freelance') {
      let dbFreelance: any[] = [];
      try {
        dbFreelance = await freelancingRepository.find({ published: { $ne: false }, status: { $nin: ['Draft', 'draft', 'Planned'] } });
      } catch (e) {
        dbFreelance = [];
      }

      const freelanceSource = dbFreelance;
      freelanceSource.forEach((w) => {
        const score = this.calculateRelevance(q, w.title, w.description, w.projectType, w.techStack || []);
        if (!q || score > 0) {
          items.push({
            id: w.id || w.slug,
            type: 'freelance',
            title: w.title,
            subtitle: w.clientName,
            description: w.description,
            slug: w.slug,
            url: `/freelancing/${w.slug}`,
            category: w.projectType,
            tags: w.techStack || [],
            score,
          });
        }
      });
    }

    // Sort by relevance score descending
    items.sort((a, b) => b.score - a.score);

    // Apply pagination
    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      results: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Quick Auto-Complete Suggestions
   */
  public async getSuggestions(query: string, limit = 5): Promise<string[]> {
    const searchRes = await this.globalSearch({ query, limit });
    return searchRes.results.map((r) => r.title);
  }

  /**
   * Recommend related items based on shared tags, category, or tech stack
   */
  public async getRelatedContent(slug: string, type: string, limit = 3): Promise<SearchResultItem[]> {
    const all = await this.globalSearch({ limit: 100 });
    const currentItem = all.results.find((i) => i.slug === slug);

    if (!currentItem) {
      return all.results.filter((i) => i.slug !== slug).slice(0, limit);
    }

    const currentTags = new Set(currentItem.tags || []);
    const related = all.results
      .filter((i) => i.slug !== slug)
      .map((item) => {
        let similarity = 0;
        if (item.category === currentItem.category) similarity += 2;
        if (item.type === currentItem.type) similarity += 1;
        (item.tags || []).forEach((t) => {
          if (currentTags.has(t)) similarity += 3;
        });
        return { item, similarity };
      });

    related.sort((a, b) => b.similarity - a.similarity);
    return related.slice(0, limit).map((r) => r.item);
  }

  /**
   * Scoring helper: title matches (3x), category/tags (2x), description (1x)
   */
  private calculateRelevance(query: string, title: string, description: string, category?: string, tags: string[] = []): number {
    if (!query) return 1;

    let score = 0;
    const q = query.toLowerCase();

    if (title.toLowerCase().includes(q)) score += 3;
    if (category && category.toLowerCase().includes(q)) score += 2;
    if (tags.some((t) => t.toLowerCase().includes(q))) score += 2;
    if (description.toLowerCase().includes(q)) score += 1;

    return score;
  }
}

export const searchService = new SearchService();
