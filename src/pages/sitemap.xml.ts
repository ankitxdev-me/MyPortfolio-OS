import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';
import { projectRepository } from '@/server/db/repositories/ProjectRepository';
import { blogRepository } from '@/server/db/repositories/BlogRepository';
import { learningRepository } from '@/server/db/repositories/LearningRepository';
import { journeyRepository } from '@/server/db/repositories/JourneyRepository';
import { freelancingRepository } from '@/server/db/repositories/FreelancingRepository';

import { TECHNOLOGIES_LIST } from '@/data/learningData';
import { MILESTONES_LIST } from '@/data/journeyData';

export const GET: APIRoute = async () => {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const currentDate = new Date().toISOString().split('T')[0];

  // Static Pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/projects', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    { url: '/learning', priority: '0.8', changefreq: 'weekly' },
    { url: '/journey', priority: '0.8', changefreq: 'monthly' },
    { url: '/academics', priority: '0.7', changefreq: 'monthly' },
    { url: '/freelancing', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/resume', priority: '0.7', changefreq: 'monthly' },
  ];

  // Dynamic Content Collections
  let projects: any[] = [];
  let blogs: any[] = [];
  let learning: any[] = [];
  let journey: any[] = [];
  let freelancing: any[] = [];

  try { projects = (await projectRepository.find({ published: { $ne: false }, status: { $nin: ['Draft', 'Planned'] } })) || []; } catch { projects = []; }
  try { blogs = (await blogRepository.find({ published: { $ne: false }, status: { $nin: ['draft', 'Draft', 'Planned', 'archived'] } })) || []; } catch { blogs = []; }
  try { learning = (await learningRepository.find()) || []; } catch { learning = []; }
  try { journey = (await journeyRepository.find()) || []; } catch { journey = []; }
  try { freelancing = (await freelancingRepository.find({ published: { $ne: false }, status: { $nin: ['Draft', 'draft', 'Planned'] } })) || []; } catch { freelancing = []; }

  const activeProjects = projects;
  const activeBlogs = blogs;
  const activeLearning = learning.length > 0 ? learning : TECHNOLOGIES_LIST;
  const activeJourney = journey.length > 0 ? journey : MILESTONES_LIST;
  const activeFreelancing = freelancing;

  const dynamicUrls: { url: string; priority: string; changefreq: string }[] = [];

  activeProjects.forEach((p) => dynamicUrls.push({ url: `/projects/${p.slug}`, priority: '0.8', changefreq: 'monthly' }));
  activeBlogs.forEach((b) => dynamicUrls.push({ url: `/blog/${b.slug}`, priority: '0.8', changefreq: 'monthly' }));
  activeLearning.forEach((l) => dynamicUrls.push({ url: `/learning/${l.slug}`, priority: '0.7', changefreq: 'monthly' }));
  activeJourney.forEach((j) => dynamicUrls.push({ url: `/journey/${j.slug}`, priority: '0.6', changefreq: 'monthly' }));
  activeFreelancing.forEach((f) => dynamicUrls.push({ url: `/freelancing/${f.slug}`, priority: '0.7', changefreq: 'monthly' }));

  const allEntries = [...staticPages, ...dynamicUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=14400',
    },
  });
};
