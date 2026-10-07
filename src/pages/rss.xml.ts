import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';
import { blogRepository } from '@/server/db/repositories/BlogRepository';

export const GET: APIRoute = async () => {
  const baseUrl = siteConfig.url.replace(/\/$/, '');

  let blogs: any[] = [];
  try {
    blogs = (await blogRepository.find({ published: { $ne: false }, status: { $nin: ['draft', 'Draft', 'Planned', 'archived'] } })) || [];
  } catch (e) {
    blogs = [];
  }

  const activeBlogs = blogs;

  const itemsXml = activeBlogs
    .map(
      (b) => `    <item>
      <title><![CDATA[${b.title}]]></title>
      <link>${baseUrl}/blog/${b.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${b.slug}</guid>
      <description><![CDATA[${b.excerpt || b.title}]]></description>
      <pubDate>${new Date(b.date || Date.now()).toUTCString()}</pubDate>
      <category><![CDATA[${b.category || 'Engineering'}]]></category>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.name} | Technical Articles]]></title>
    <link>${baseUrl}/blog</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=14400',
    },
  });
};
