export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { cache } from 'react';
import { escapeXml, formatXmlDate } from '@/utils/xmlUtils';

const getCachedBlogPosts = cache(async () => {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { cookies: {} }
  );

  const { data: posts, error } = await supabase
    .from('BlogPost')
    .select('slug, title, createdAt, updatedAt')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return posts;
});

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    // Static pages configuration
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/blogs', priority: 0.9, changefreq: 'daily' },
      { url: '/pricing', priority: 0.8, changefreq: 'weekly' },
      { url: '/about', priority: 0.7, changefreq: 'monthly' },
      { url: '/terms', priority: 0.6, changefreq: 'monthly' },
      { url: '/privacy', priority: 0.6, changefreq: 'monthly' },
    ];

    // Generate sitemap based on request path
    let xml = '';
    const posts = await getCachedBlogPosts();

    if (pathname.endsWith('/index')) {
      // Index sitemap
      xml = `<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <sitemap>
            <loc>${baseUrl}/api/sitemap/static</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
          </sitemap>
          <sitemap>
            <loc>${baseUrl}/api/sitemap/blog</loc>
            <lastmod>${posts[0]?.updatedAt || new Date().toISOString()}</lastmod>
          </sitemap>
        </sitemapindex>`;
    } else if (pathname.endsWith('/static')) {
      // Static pages sitemap
      xml = `<?xml version="1.0" encoding="UTF-8"?>
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
    } else if (pathname.endsWith('/blog')) {
      // Blog posts sitemap
      xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
          ${posts.map(post => `
            <url>
              <loc>${baseUrl}/blogs/${escapeXml(post.slug)}</loc>
              <lastmod>${formatXmlDate(post.updatedAt || post.createdAt)}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
              <news:news>
                <news:publication>
                  <news:name>SocialTargeter Blog</news:name>
                  <news:language>en</news:language>
                </news:publication>
                <news:publication_date>${formatXmlDate(post.createdAt)}</news:publication_date>
                <news:title>${escapeXml(post.title)}</news:title>
              </news:news>
            </url>
          `).join('')}
        </urlset>`;
    }

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
