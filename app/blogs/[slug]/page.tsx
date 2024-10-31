import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import PageWrapper from "../../../components/wrapper/page-wrapper";
import 'tailwindcss/tailwind.css'; // Make sure this import is present
import 'github-markdown-css/github-markdown-light.css'; // Add this import
import { marked } from 'marked'; // Update this import
import { generateBlogJsonLd } from '@/utils/seoUtils';
import { generateBlogMetadata } from '@/utils/seoUtils';

// This is necessary for dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  return generateBlogMetadata(post);
}

async function getBlogPost(slug: string) {
  console.log('Fetching blog post with slug:', slug);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/blogs?slug=${slug}`, { cache: 'no-store' });
  console.log('API response status:', res.status);
  
  if (!res.ok) {
    if (res.status === 404) {
      console.log('Blog post not found');
      notFound();
    }
    console.error('Failed to fetch blog post:', await res.text());
    throw new Error('Failed to fetch blog post');
  }
  
  const data = await res.json();
  console.log('Received blog post data:', data);
  return data;
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  const htmlContent = marked.parse(post.content) // Update this line
  const jsonLd = generateBlogJsonLd(post);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blogs" className="inline-flex items-center text-[#ff6f2c] hover:underline mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>

        <header className="mb-8">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none">
            Social Media Lead Generation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 text-sm">
            <User className="mr-2 h-4 w-4" />
            <span className="mr-4">{post.author}</span>
            <Calendar className="mr-2 h-4 w-4" />
            <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </header>

        {post.image && (
          <div className="mb-8">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              priority={true}
              className="rounded-lg shadow-lg"
              itemProp="image"
            />
          </div>
        )}

        <div className="markdown-body prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#ff6f2c] prose-strong:text-gray-900">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </article>
    </PageWrapper>
  )
}
