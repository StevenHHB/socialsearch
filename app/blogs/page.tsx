import { useEffect, useState } from 'react';
import React from 'react';
import PageWrapper from "../../components/wrapper/page-wrapper";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"


// Metadata for SEO
export const metadata: Metadata = {
  title: 'SocialTargeter Blog - Latest Insights on Social Media Lead Generation',
  description: 'Discover the latest trends, tips, and strategies for social media lead generation. Learn how to leverage Reddit, X, and LinkedIn for your business growth.',
  openGraph: {
    title: 'SocialTargeter Blog - Social Media Lead Generation Insights',
    description: 'Stay ahead in social media marketing with our expert insights on lead generation strategies for Reddit, X, and LinkedIn.',
    images: [{ url: '/images/og.png' }],
  },
}

async function getBlogPosts() {
  try {
    const res = await fetch(`${process.env.BLOG_API_URL}`, { cache: 'no-store' })
    if (!res.ok) {
      const errorText = await res.text()
      console.error('API response:', res.status, errorText)
      throw new Error(`Failed to fetch blog posts: ${res.status} ${errorText}`)
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }
}

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  let blogPosts = []
  let error = null

  try {
    blogPosts = await getBlogPosts()
  } catch (e) {
    error = e
    console.error('Error in BlogsPage:', e)
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center py-16">
          <h2 className="text-2xl font-bold text-red-600">Error loading blog posts</h2>
          <p>Please try again later.</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center py-16 relative w-screen">
        <div className="flex flex-col items-center p-3 w-full max-w-6xl">
          <div className="flex flex-col justify-start items-center gap-4 w-full mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
              Blog Articles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl">
              Explore our latest blog posts below.
            </p>
          </div>
          <div className="grid blog-grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {blogPosts.map((post: any) => (
              <Link href={`/blogs/${post.slug}`} key={post.id} className="block hover:shadow-lg transition-shadow duration-300">
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <img src={post.image || '/images/default-blog-image.jpg'} alt={post.title} className="w-full h-48 object-cover rounded-t-lg" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardTitle className="text-2xl font-bold mb-2">{post.title}</CardTitle>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <Button variant="ghost" className="text-[#ff6f2c] hover:text-[#ff6f2c]/90">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
