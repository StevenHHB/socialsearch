import { Metadata } from 'next'

export interface BlogPostMetadata {
  title: string
  excerpt: string
  author: string
  publishedDate: string
  modifiedDate: string
  image: string
  slug: string
}

export async function generateBlogMetadata(post: BlogPostMetadata): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

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
      canonical: `${baseUrl}/blog/${post.slug}`,
    }
  }
}
