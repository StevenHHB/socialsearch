import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // Static pages sitemap
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/blogs', priority: 0.9, changefreq: 'daily' },
    { url: '/pricing', priority: 0.8, changefreq: 'weekly' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/terms', priority: 0.6, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.6, changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map(page => `
        <url>
          <loc>${baseUrl}${page.url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
    </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400' // 24 hours for static pages
    }
  });
}
