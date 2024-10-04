import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { remark } from 'remark'
import html from 'remark-html'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { TITLE_TAILWIND_CLASS } from '@/utils/constants'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params
  const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/blogs?id=${id}`)
  const post = await response.json()

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  }
}

async function getBlogPost(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/api/blogs?id=${id}`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    return null
  }

  const post = await response.json()
  return post
}

async function parseMarkdown(content: string) {
  const result = await remark()
    .use(html)
    .use(rehypeHighlight)
    .process(content)
  return result.toString()
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const { id } = params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  const contentHTML = await parseMarkdown(post.content)

  return (
    <PageWrapper>
      <article className="flex flex-col items-center py-16 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Link>
          <h1 className={`${TITLE_TAILWIND_CLASS} font-bold text-4xl mb-6 text-gray-900 dark:text-white`}>{post.title}</h1>
          <div className="mb-8 text-gray-600 dark:text-gray-400">
            Published on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="rounded-lg shadow-lg mb-10 w-full h-auto"
            />
          )}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mt-8 text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: contentHTML }}
          />
        </div>
      </article>
    </PageWrapper>
  )
}