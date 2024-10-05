'use client'
import { TITLE_TAILWIND_CLASS } from '@/utils/constants'
import Image from 'next/image'
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

export default function BlogSample() {
  const articles = [
    {
      id: 1,
      image: "https://plus.unsplash.com/premium_photo-1677093906033-dc2beb53ace3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9tYWlufGVufDB8fDB8fHww",
      title: "How AI is Revolutionizing Domain Name Selection",
      excerpt: "Discover how artificial intelligence is making it easier than ever to find the perfect .com domain for your business.",
      date: "2024-04-15"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1687524690542-2659f268cde8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8LmNvbXxlbnwwfHwwfHx8MA%3D%3D",
      title: "The Impact of a Great .com Domain on Brand Success",
      excerpt: "Learn why choosing the right .com domain is crucial for your brand's online presence and long-term success.",
      date: "2024-04-16"
    },
    {
      id: 3,
      image: "https://plus.unsplash.com/premium_photo-1670044020191-934d7264fc85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NXxlbnwwfHwwfHx8MA%3D%3D",
      title: "5 Tips for Choosing a Memorable .com Domain",
      excerpt: "Expert advice on selecting a domain name that sticks in your customers' minds and boosts your brand.",
      date: "2024-04-17"
    }
  ]

  return (
    <div className="flex flex-col justify-center items-center py-16 bg-gray-50 dark:bg-gray-900">
      <div className='flex flex-col items-center p-3 w-full max-w-6xl'>
        <div className='flex flex-col justify-start items-center gap-4 w-full mb-12'>
          <h2 className={`${TITLE_TAILWIND_CLASS} font-bold tracking-tight text-gray-900 dark:text-white text-center`}>
            Insights from the SocialTargeter Blog
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl">
            Dive into our latest articles on domain strategies, AI technology, and online branding.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles?.map((article) => (
            <Link href={`/blog/${article.id}`} key={article?.id} className="group">
              <article className="flex flex-col space-y-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <Image
                  src={article?.image!}
                  alt={article.title}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article?.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Read more <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300">
            View All Articles
          </button>
        </Link>
      </div>
    </div>
  )
}

/*import { TITLE_TAILWIND_CLASS } from '@/utils/constants'
import Image from 'next/image'
import Link from "next/link"
export default function BlogSample() {

  const articles = [
    {
      id: 1,
      image: "https://seo-heist.s3.amazonaws.com/user_2cxTR5I0BjOLeNCnee3qUze0LUo/1af01aca-6ce1-4a3f-8e54-e945e3104889.png",
      title: "The Importance of Storytelling in Modern Branding",
      date: "2024-04-15 21:16:04.765648-05"
    },
    {
      id: 2,
      image: "https://seo-heist.s3.amazonaws.com/user_2cxTR5I0BjOLeNCnee3qUze0LUo/96bf3bb0-9e15-4745-b966-91d719651429.png",
      title: "How to Choose the Right Dog for Your Lifestyle",
      date: "2024-04-16 08:29:32.188999-05"
    },
    {
      id: 3,
      image: "https://seo-heist.s3.amazonaws.com/user_2cxTR5I0BjOLeNCnee3qUze0LUo/36292d36-cfae-4106-8d59-ace222f4bc82.png",
      title: "Top Automation Testing Suites for Seamless Software Testing",
      date: "2024-04-16 15:20:52.368844-05"
    }
  ]

  return (
    <div className="flex flex-col justify-center items-center">
      <div className='flex flex-col items-center p-3 w-full'>
        <div className='flex flex-col justify-start items-center gap-2 w-full'>
          <div className='flex gap-3 justify-start items-center w-full'>
            <h1 className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}>
              Some Sample Blog Cards
            </h1>
          </div>
          <div className='flex gap-3 justify-start items-center w-full border-b pb-4'>
            <p className="text-gray-600 dark:text-gray-400">
              All these articles were generated using Sample Articles AI
            </p>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-start'>
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-5">
          {articles?.map((article) => (
            <Link href={"/"} key={article?.id}>
              <article
                className="flex flex-col space-y-2 p-4 rounded-md border dark:bg-black"
              >
                <Image
                  src={article?.image!}
                  alt={"blog image"}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors"
                />
                <div className='flex lg:flex-row w-full justify-between items-center'>
                  <h2 className="text-md lg:text-lg font-bold">{article?.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(article?.date!)?.toLocaleDateString()}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>

  )
}
*/