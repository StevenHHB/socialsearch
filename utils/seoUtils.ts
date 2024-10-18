import fs from 'fs/promises';
import path from 'path';

export async function updateSitemap(newPost: any) {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  let sitemap = await fs.readFile(sitemapPath, 'utf-8');

  const newUrl = `
    <url>
      <loc>${process.env.NEXT_PUBLIC_SITE_URL}/blog/${newPost.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  </sitemap>`;

  sitemap = sitemap.replace('</sitemap>', newUrl);
  await fs.writeFile(sitemapPath, sitemap);
}

export async function updateRSSFeed(newPost: any) {
  const rssFeedPath = path.join(process.cwd(), 'public', 'rss.xml');
  let rssFeed = await fs.readFile(rssFeedPath, 'utf-8');

  const newItem = `
    <item>
      <title>${newPost.title}</title>
      <link>${process.env.NEXT_PUBLIC_SITE_URL}/blog/${newPost.slug}</link>
      <description>${newPost.excerpt}</description>
      <pubDate>${new Date(newPost.createdAt).toUTCString()}</pubDate>
      <guid>${process.env.NEXT_PUBLIC_SITE_URL}/blog/${newPost.slug}</guid>
    </item>
  </channel>`;

  rssFeed = rssFeed.replace('</channel>', newItem);
  await fs.writeFile(rssFeedPath, rssFeed);
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

