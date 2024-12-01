import { MetadataRoute } from 'next'
import { createClient } from "@supabase/supabase-js";

async function getBlogPosts() {
  // Use direct Supabase client instead of SSR client during build
  const supabase = createClient(
    process.env.BLOG_SUPABASE_URL!,
    process.env.BLOG_SUPABASE_SERVICE_KEY!
  );

  const { data: posts, error } = await supabase
    .from('contents')
    .select('slug, title, created_at, published_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialtargeter.com';

  // 1. Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  try {
    // 2. Get all blog posts
    const posts = await getBlogPosts();
    
    // 3. Generate blog post routes
    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: new Date(post.published_at || post.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.75,
    }));

    // 4. Combine all routes
    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static routes if blog posts can't be fetched
    return staticRoutes;
  }
}
