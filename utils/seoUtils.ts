import { parseStringPromise, Builder } from 'xml2js'
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { BlogPostMetadata } from '@/utils/types';
import { escapeXml, formatXmlDate, wrapCdata } from './xmlUtils';

export async function updateSitemap(newPost: BlogPostMetadata) {
  try {

    console.log('updateSitemap called'); 
    // 1. 重新验证 sitemap.xml
    await revalidatePath('/sitemap.xml');
    
    // 2. 重新验证其他相关路径
    await Promise.all([
      revalidatePath('/blogs'),
      revalidatePath(`/blogs/${newPost.slug}`),
      revalidatePath('/api/rss')
    ]);

    // 3. 通知搜索引擎
    await Promise.all([
      fetch(`http://www.google.com/ping?sitemap=${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`),
      fetch(`http://www.bing.com/ping?sitemap=${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`)
    ]);
  } catch (error) {
    console.error('Error updating sitemap:', error);
    throw error;
  }
}

export async function updateRSSFeed() {
  await Promise.all([
    revalidatePath('/api/rss')
  ]);
}

export async function generateMetadata(newPost: any) {
  // This function would generate metadata for the new post
  // You can implement this based on your specific needs
  // For example, creating a JSON file with metadata for each post
  const metadataPath = path.join(process.cwd(), 'public', 'blog-metadata', `${newPost.slug}.json`);
  const metadata = {
    title: newPost.title,
    description: newPost.excerpt,
    author: newPost.author,
    date: newPost.createdAt,
    image: newPost.image,
  };
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

export async function invalidateCaches(newPost: any) {
  try {
    // Revalidate specific paths
    revalidatePath('/api/sitemap/blog');
    revalidatePath('/api/rss');
    revalidatePath('/blogs');
    revalidatePath(`/blogs/${newPost.slug}`);

    // Ping search engines
    await Promise.all([
      fetch(`http://www.google.com/ping?sitemap=${process.env.NEXT_PUBLIC_SITE_URL}/api/sitemap/index`),
      fetch(`http://www.bing.com/ping?sitemap=${process.env.NEXT_PUBLIC_SITE_URL}/api/sitemap/index`)
    ]);

  } catch (error) {
    console.error('Error invalidating caches:', error);
  }
}

export async function generateRSSFeed(posts: BlogPostMetadata[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:wfw="http://wellformedweb.org/CommentAPI/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:atom="http://www.w3.org/2005/Atom"
      xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
      xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
      <channel>
        <title>SocialTargeter Blog</title>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
        <link>${baseUrl}</link>
        <description>Latest insights on social media lead generation</description>
        <language>en-US</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${posts.map(post => `
          <item>
            <title>${escapeXml(post.title)}</title>
            <link>${baseUrl}/blogs/${post.slug}</link>
            <pubDate>${new Date(post.publishedDate).toUTCString()}</pubDate>
            <guid isPermaLink="false">${baseUrl}/blogs/${post.slug}</guid>
            <description>${escapeXml(post.excerpt)}</description>
            <content:encoded><![CDATA[${post.content}]]></content:encoded>
            <dc:creator>${escapeXml(post.author)}</dc:creator>
          </item>
        `).join('')}
      </channel>
    </rss>`;
}

// Add cache headers utility
export function getSEOHeaders(maxAge: number = 3600) {
  return {
    'Content-Type': 'application/xml',
    'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    'X-Robots-Tag': 'noarchive'
  };
}

export function generateBlogJsonLd(post: BlogPostMetadata) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : [],
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SocialTargeter',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blogs/${post.slug}`
    },
    keywords: post.keywords?.join(', '),
    articleBody: post.content,
    wordCount: post.content.split(/\s+/).length,
    inLanguage: 'en-US'
  };
}

export function generateBlogMetadata(post: BlogPostMetadata) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: `${post.title} | SocialTargeter Blog`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    alternates: {
      canonical: `${baseUrl}/blogs/${post.slug}`,
    }
  };
}

export function generateArticleSchema(post: BlogPostMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: {
      '@type': 'Person',
      name: post.author,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/author/${post.author.toLowerCase()}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'SocialTargeter',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${post.slug}`
    },
    articleBody: post.content,
    keywords: post.keywords?.join(','),
    wordCount: post.content.split(/\s+/).length,
    articleSection: 'Social Media Marketing'
  };
}

