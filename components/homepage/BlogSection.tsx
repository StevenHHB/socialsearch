"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import Image from 'next/image'

const blogPosts = [
  {
    id: 1,
    title: "Mastering Social Media Lead Generation: Strategies for Reddit, X, and LinkedIn",
    excerpt: "Discover the most effective strategies to enhance your social media marketing efforts in 2024. Learn how to engage authentically, leverage AMAs, create valuable content, and monitor effectively.",
    image: "https://www.fenews.co.uk/wp-content/uploads/2022/01/social-media-1200x800.jpg",
    author: "SocialTargeter",
    createdAt: "2024-10-18 07:08",
    slug: "Mastering-Social-Media-Lead-Generation-Strategies-for-Reddit-X-and-LinkedIn"
  },
  {
    id: 2,
    title: "10 Proven Strategies to Skyrocket Your Social Media Lead Generation in 2024",
    excerpt: "Discover 10 cutting-edge strategies that will transform your social media presence into a lead-generating powerhouse. Learn how to leverage AI, personalization, and emerging platforms to capture high-quality leads and stay ahead of the competition in 2024 and beyond.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "SocialTargeter",
    createdAt: "2024-10-18 07:56",
    slug: "10-proven-strategies-skyrocket-social-media-lead-generation-2024"
  },
  {
    id: 3,
    title: "The Ultimate Guide to LinkedIn Lead Generation: From Zero to 10,000 Qualified Leads in 6 Months",
    excerpt: "Unlock the full potential of LinkedIn for B2B lead generation with our comprehensive guide. Learn step-by-step how to optimize your profile, create compelling content, and leverage LinkedIn's powerful tools to generate a steady stream of high-quality leads for your business.",
    image: "https://images.unsplash.com/photo-1592093947163-51f1d258d110?q=80&w=3450&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "SocialTargeter",
    createdAt: "2024-10-17 20:47",
    slug: "ultimate-guide-linkedin-lead-generation-zero-to-10000-qualified-leads"
  }
]

const BlogSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#fffaf5]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none">
            Latest Insights
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Discover Our <span className="text-[#ff6f2c]">Latest Blog Posts</span>
          </h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Stay up to date with the latest trends and strategies in social media lead generation.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blogs/${post.slug}`}>
                <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <Image src={post.image} alt={post.title} width={400} height={200} className="w-full h-48 object-cover rounded-t-lg" />
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <CardTitle className="text-2xl font-bold mb-2">{post.title}</CardTitle>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-6 bg-gray-50">
                    <div className="text-sm text-gray-500">
                      By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <Button variant="ghost" className="text-[#ff6f2c] hover:text-[#ff6f2c]/90">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link href="/blogs">
            <Button size="lg" className="bg-[#ff6f2c] text-white hover:bg-[#ff6f2c]/90 w-full sm:w-auto">
              View All Blog Posts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
