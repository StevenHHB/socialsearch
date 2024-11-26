import { MetadataRoute } from 'next'
import { createServerClient } from "@supabase/ssr";

async function getBlogPosts() {
  const supabase = createServerClient(
    process.env.BLOG_SUPABASE_URL!,
    process.env.BLOG_SUPABASE_SERVICE_KEY!,
    { cookies: {} }
  );

  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, title, created_at, published_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('sitemap called');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // 1. 静态路由
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

  // 2. 获取所有博客文章
  const posts = await getBlogPosts();
  
  // 3. 生成博客文章路由
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.published_at || post.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.75,
  }));

  // 4. 合并所有路由
  return [...staticRoutes, ...blogRoutes];
}
