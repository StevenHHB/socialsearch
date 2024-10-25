"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Check, ArrowRight, Loader2, Star, MessageSquare, TrendingUp, Bell, X, BarChart } from 'lucide-react'
import { FiBarChart } from 'react-icons/fi'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Image from 'next/image'
import Head from 'next/head'

export default function LandingPage() {
  const [leadCount, setLeadCount] = useState(1000000)

  const TwitterIcon = ({ size = 40 }) => (
    <svg viewBox="0 0 24 24" className={`w-${size} h-${size} fill-current text-[#1DA1F2]`}>
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
    </svg>
  )

  const RedditIcon = ({ size = 32 }) => (
    <svg viewBox="0 0 24 24" className={`w-${size} h-${size} fill-current text-[#FF4500]`}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )

  const GoogleIcon = ({ size = 32 }) => (
    <svg viewBox="0 0 24 24" className={`w-${size} h-${size} fill-current`}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setLeadCount(prevCount => prevCount + Math.floor(Math.random() * 5) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>SocialTargeter - Find Customers in Seconds</title>
        <meta name="description" content="SocialTargeter finds high impact Reddit conversations to help you naturally promote your product and get more sales. Leverage the power of Reddit's SEO dominance and AI-driven search discovery." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph and Twitter Card meta tags */}
        <meta property="og:title" content="SocialTargeter - Find Customers in Seconds" />
        <meta property="og:description" content="SocialTargeter finds high impact Reddit conversations to help you naturally promote your product and get more sales." />
        <meta property="og:image" content="/images/socialtargeter-og-image.jpg" />
        <meta property="og:url" content="https://www.socialtargeter.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none">
            Social Media AI Lead Generation Done Right
          </Badge>

          <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            Find Customers in{' '}
            <span className="relative inline-flex items-center flex-wrap">
              <span className="relative z-10">
                Seconds
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="#ff6f2c" strokeWidth="2" fill="none" />
                </svg>
              </span>
              <span className="flex items-center space-x-2 mt-2 md:mt-0 md:ml-4">
                <span className="text-sm md:text-base text-gray-500 italic">from</span>
                <RedditIcon size={10} />
                <FaXTwitter className="w-10 h-10 text-black" />
                <FaLinkedin className="w-10 h-10 text-[#0077b5]" />
                <span className="text-sm md:text-base text-gray-500 italic">and more soon!</span>
              </span>
            </span>
          </h1>

          <p className="text-base md:text-xl text-gray-600 mb-8">
            SocialTargeter finds high impact Reddit conversations to help you
            naturally promote your product and get more sales. Leverage the power of
            Reddit's SEO dominance and AI-driven search discovery.
          </p>

          <div className="space-y-4 mb-12">
            <div className="flex items-start space-x-3">
              <div className="bg-[#fff0e5] rounded-full p-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <span className="text-base text-gray-700">Get into relevant Reddit posts ranking high on Google</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-[#fff0e5] rounded-full p-2">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="text-base text-gray-700">Use AI-guided replies to naturally promote your product</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-[#fff0e5] rounded-full p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="text-base text-gray-700">Monitor your brand and competitors 24/7</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-[#fff0e5] rounded-full p-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="text-base text-gray-700">Boost your visibility in AI-driven search results</span>
            </div>
          </div>

          <Link href="/sign-up">
            <Button size="lg" className="mb-8 bg-[#ff6f2c] text-white hover:bg-[#ff6f2c]/90 w-full sm:w-auto">
              Get Customers Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <div className="flex items-start space-x-4">
              <Image src="/images/headshot.jpg" alt="Headshot of David Salman, Co-Founder of Jobmart" className="rounded-full w-12 h-12" width={48} height={48} />
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-2">
                  "Thanks to SocialTargeter, we now get a <span className="text-primary font-semibold">steady stream of 500+ daily new
                  potential leads</span> just from Reddit. It's an absolute game-changer for our growth, allowing us to tap into highly relevant discussions and showcase our expertise!"
                </p>
                <p className="text-sm text-gray-500">
                  David Salman, Co-Founder of Jobmart
                </p> 
              </div>
            </div>
          </div>

          <div className="relative mt-12">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src="/images/screenshot.svg"
                alt="SocialTargeter Interface"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-3">
              <Image src="/images/ai_logo.png" alt="SocialTargeter logo" width={40} height={40} className="mb-2" />
              <p className="text-xs text-gray-600 max-w-[200px]">
                SocialTargeter turns Reddit posts into a professional lead generation tool for your business – no coding required.
              </p>
            </div>
            <Link href="/sign-up" className="absolute -bottom-6 left-8">
              <Button variant="secondary" className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">reddit lead generation</span>
              </Button>
            </Link>
            <Link href="/sign-up" className="absolute -bottom-6 right-8">
              <Button variant="secondary" className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-2">
                <svg className="h-5 w-5 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
                <span className="text-sm font-medium">Click to explore</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="my-12 md:my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card className="bg-red-50 dark:bg-red-900 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-red-800">To find customers manually you need:</h3>
              <ul className="space-y-4">
                {[
                  "Monitor each social network every few hours, searching for keywords related to your product (15 - 30 min)",
                  "Read every mention and analyze whether you can offer your product (15 - 30 min)",
                  "Write a personal text for each suitable mention in which your product will be mentioned (30 - 60 min)"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-red-200 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                      <X size={12} className="text-red-600" />
                    </span>
                    <span className="text-sm text-red-800">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-bold text-red-800">Total: 1 - 2 hours per day for 1 project</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-green-800">To get leads using SocialTargeter you need:</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-green-200 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                    <Check size={12} className="text-green-600" />
                  </span>
                  <span className="text-sm text-green-800">Create a project and add keywords (AI will suggest suitable keywords for your product)</span>
                </li>
              </ul>
              <div className="mt-4 text-sm font-bold text-green-800">Total: 2 minutes one time for 1 project</div>
              <div className="mt-6">
                <Link href="/sign-up">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-300 rounded-full text-sm font-semibold py-3"
                  >
                    Start Getting Customers Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-20">
        <div className="container">
          <div className="flex flex-col items-center space-y-4 text-center">
            <span className="px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] rounded-full">
              Here's how SocialTargeter works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Get more customers in<br />
              <span className="text-[#ff6f2c]">3 simple steps.</span> Automated
            </h2>
            <p className="max-w-[900px] text-gray-600 text-sm md:text-base lg:text-lg">
              Tell us your company, your top 3 competitor keywords and SocialTargeter will find the 
              <span className="font-semibold"> most highly relevant Reddit posts for you to engage with</span>. 
              No manual labor needed. Let us do the hard work. 
              <span className="font-semibold"> You focus on engaging and growing your business</span>.
            </p>
          </div>
          <div className="grid gap-6 mt-12 md:grid-cols-3">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-primary text-white rounded-bl-lg">1</div>
              <CardContent className="pt-12 pb-8">
                <div className="mb-4 h-40 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <div className="bg-white p-2 rounded-md shadow-md">
                    <span className="text-primary font-semibold">socialtargeter.com</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Add your own website</h3>
                <p className="text-gray-500">
                  We analyze your website and identify highly relevant keywords, topics, and user intents.
                  This helps us find the most appropriate Reddit discussions for your business.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-primary text-white rounded-bl-lg">2</div>
              <CardContent className="pt-12 pb-8">
                <div className="mb-4 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex flex-col items-center justify-center space-y-2">
                  <div className="bg-white p-2 rounded-md shadow-md w-3/4">
                    <span className="text-gray-600">competitor1.com</span>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-md w-3/4">
                    <span className="text-gray-600">competitor2.com</span>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-md w-3/4">
                    <span className="text-gray-600">competitor3.com</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Add your top 3 competitors</h3>
                <p className="text-gray-500">
                  Your top three competitors will help us drill even deeper and identify hidden
                  opportunities to engage with your competitors' audience. We'll find discussions
                  where your competitors are mentioned but haven't responded.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-primary text-white rounded-bl-lg">3</div>
              <CardContent className="pt-12 pb-8">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 h-40">
                  <div className="bg-white rounded-lg p-3 space-y-3 h-full overflow-y-auto">
                    {/* Reddit Post 1 */}
                    <div className="border border-gray-200 rounded p-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <RedditIcon size={8} />
                        <span className="text-xs text-gray-500">r/SaaS • u/charlie_mccharlie 2h</span>
                      </div>
                      <h4 className="text-sm font-medium mb-1">Good alternative to competitor1.com?</h4>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          42
                        </span>
                        <span>12 comments</span>
                        <span>Share</span>
                      </div>
                    </div>

                    {/* Reddit Post 2 */}
                    <div className="border border-gray-200 rounded p-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <RedditIcon size={8} />
                        <span className="text-xs text-gray-500">r/marketing • u/saas_founder_123 5h</span>
                      </div>
                      <h4 className="text-sm font-medium mb-1">Any tools to find leads on social media?</h4>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          28
                        </span>
                        <span>8 comments</span>
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mt-4 mb-2">Get highly relevant posts</h3>
                <p className="text-gray-500 mb-4">
                  Receive a curated list of the most relevant Reddit posts where you can engage and
                  promote your business naturally. These posts are actually being read by your target
                  audience and have high potential for conversion.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { title: "Choose keywords", description: "Select keywords relevant to your project for SocialTargeter to scour the web for." },
                { title: "Mention tracking begins", description: "Our platform tracks mentions of your keywords across the internet." },
                { title: "Post selection", description: "Our AI chooses high quality, recent, and relevant posts where your product deserves a shoutout in the replies." },
                { title: "Reply Generation", description: "Our AI generates relevant, useful replies to selected mentions, aiming to genuinely help the original poster and mention your product when relevant." },
                { title: "Sent!", description: "That's it, and then on to the next one." }
              ].map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{index + 1}</div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
              <div className="flex -space-x-2">
                <Image src="/images/avatar1.svg" alt="User 1" className="w-8 h-8 rounded-full border-2 border-white" width={32} height={32} />
                <Image src="/images/avatar2.svg" alt="User 2" className="w-8 h-8 rounded-full border-2 border-white" width={32} height={32} />
                <Image src="/images/avatar3.svg" alt="User 3" className="w-8 h-8 rounded-full border-2 border-white" width={32} height={32} />
                <Image src="/images/avatar4.svg" alt="User 4" className="w-8 h-8 rounded-full border-2 border-white" width={32} height={32} />
              </div>
              <span className="text-sm font-medium text-gray-600">Used by 100+ businesses and founders like you</span>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/sign-up">
              <Button size="lg" className="bg-[#ff6f2c] text-white hover:bg-[#ff6f2c]/90 w-full sm:w-auto">
                Get Customers Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Reddit Section */}
      <section id="why-reddit" className="w-full py-12 md:py-24 lg:py-32 bg-[#fffaf5]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none">
              Why Social Media Lead Generation?
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Reddit, X, and LinkedIn can be <span className="text-primary">goldmines</span> <br /> for your business.
            </h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Top Google rankings are now flooded with Reddit posts and
                AIs like ChatGPT are using these posts to influence product
                recommendations. By strategically placing your brand in top
                Reddit discussions, you're not just winning at SEO but
                also positioning for AI-driven search discovery like ChatGPT.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Ignoring Reddit now is like turning your back on SEO a
                decade ago – a missed opportunity you shouldn't afford.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-[#fff0e5] rounded-full p-2">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Get exposure for competitive terms, skip costly ads</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-[#fff0e5] rounded-full p-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Minimal investment, high organic traffic from comments</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-[#fff0e5] rounded-full p-2">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Secretly sneak into competitors search results</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-[#fff0e5] rounded-full p-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Be included in AI Search responses like ChatGPT</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src="/images/reddit_traffic.png"
                  alt="Graph showing Reddit's prominence in search results"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded-md shadow-md p-3">
                <p className="text-xs text-gray-500">Source: Reddit</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white rounded-full px-6 py-3 shadow-md">
              <div className="flex items-center space-x-2">
                <Image src="/images/reddit_logo.svg" alt="Reddit logo" className="w-12 h-12" width={48} height={48} />
                <span className="text-lg font-medium">+</span>
                <Image src="/images/x_logo.svg" alt="X logo" className="w-6 h-6" width={24} height={24} />
              </div>
              <ArrowRight className="h-6 w-6 text-primary" />
              <div className="flex items-center space-x-2">
                <Image src="/images/google_logo.png" alt="Google logo" className="w-12 h-12" width={48} height={48} />
                <Image src="/images/chatgpt_logo.svg" alt="ChatGPT logo" className="w-12 h-12" width={48} height={48} />
                <Image src="/images/perplexity_logo.svg" alt="Perplexity logo" className="w-12 h-12" width={48} height={48} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything you need to <span className="text-primary">dominate Socials</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI-Powered Post Discovery",
                description: "Our advanced AI algorithms scan Reddit to find the most relevant and high-potential posts for your business.",
                icon: <Search className="h-8 w-8 text-primary" />
              },
              {
                title: "Competitor Monitoring",
                description: "Keep an eye on your competitors' Reddit activity and find opportunities to outshine them.",
                icon: <TrendingUp className="h-8 w-8 text-primary" />
              },
              {
                title: "Smart Engagement Suggestions",
                description: "Get AI-generated response suggestions to help you engage naturally and effectively in Reddit discussions.",
                icon: <MessageSquare className="h-8 w-8 text-primary" />
              },
              {
                title: "SEO Impact Tracking",
                description: "Monitor how your Reddit engagement affects your search engine rankings and visibility.",
                icon: <Zap className="h-8 w-8 text-primary" />
              },
              {
                title: "Automated Alerts",
                description: "Receive real-time notifications for new relevant posts and mentions of your brand or competitors.",
                icon: <Bell className="h-8 w-8 text-primary" />
              },
              {
                title: "Performance Analytics",
                description: "Comprehensive dashboards and reports to track your Reddit marketing performance and ROI.",
                icon: <BarChart className="h-8 w-8 text-primary" />
              }
            ].map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-6">
                <div className="mb-4 p-3 bg-[#fff0e5] rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Trusted by 100+ businesses worldwide</h2>
            <Link href="/sign-up">
              <Button size="lg" className="mb-8 bg-[#ff6f2c] text-white hover:bg-[#ff6f2c]/90 w-full sm:w-auto">
                Try SocialTargeter Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
