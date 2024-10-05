"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Check, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const [leadCount, setLeadCount] = useState(1000000)

  useEffect(() => {
    const interval = setInterval(() => {
      setLeadCount(prevCount => prevCount + Math.floor(Math.random() * 5) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Badge variant="outline" className="mb-4">AI-Powered Lead Generation</Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Find Your <span className="text-blue-600 dark:text-blue-400">Customers</span> In Seconds
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Our AI-powered bot scans Twitter and Reddit to find customers ready to buy your product or service, saving you time and boosting your sales.
        </p>
        <div className="mb-8">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            100,000+ leads generated
          </div>
        </div>
        <Button 
          size="lg"
          onClick={() => window.location.href = '/sign-up'}
          className="text-xl px-8 py-4"
        >
          Try SocialTargeter Free
        </Button>
      </motion.div>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">How SocialTargeter Works</h2>
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
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Why Use SocialTargeter?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-red-50 dark:bg-red-900">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">To find customers manually you need:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="bg-red-100 text-red-600 p-1 rounded-full mr-2">
                    <Check size={16} />
                  </span>
                  Monitor each social network every few hours, searching for keywords related to your product (15 - 30 min)
                </li>
                <li className="flex items-center">
                  <span className="bg-red-100 text-red-600 p-1 rounded-full mr-2">
                    <Check size={16} />
                  </span>
                  Read every mention and analyze whether you can offer your product (15 - 30 min)
                </li>
                <li className="flex items-center">
                  <span className="bg-red-100 text-red-600 p-1 rounded-full mr-2">
                    <Check size={16} />
                  </span>
                  Write a personal text for each suitable mention in which your product will be mentioned (30 - 60 min)
                </li>
              </ul>
              <div className="mt-4 font-bold">Total: 1 - 2 hours per day for 1 project</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">To get leads using SocialTargeter you need:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="bg-green-100 text-green-600 p-1 rounded-full mr-2">
                    <Check size={16} />
                  </span>
                  Create a project and add keywords (AI will suggest suitable keywords for your product)
                </li>
              </ul>
              <div className="mt-4 font-bold">Total: 2 minutes one time for 1 project</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Sample Posts Found by SocialTargeter:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
                <p className="text-lg font-medium">"Airtable can get expensive pretty quickly! Who are the indie hackers making a cheaper alternative?"</p>
              </div>
              <h3 className="text-xl font-semibold mb-2">SocialTargeter's reply inspiration:</h3>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="text-lg font-medium">"Hi there! 👋 Have you checked out EasyForms? It's an affordable alternative to expensive form builders. We offer a lifetime deal for just $20, which includes unlimited responses. Perfect for indie hackers!"</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
                <p className="text-lg font-medium">"Looking for a tool to automate my social media posting. Any recommendations that won't break the bank?"</p>
              </div>
              <h3 className="text-xl font-semibold mb-2">SocialTargeter's reply inspiration:</h3>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="text-lg font-medium">"Hey! 😊 You might want to try SocialPilot. It's a budget-friendly option for social media automation with a great set of features. They offer a 14-day free trial too, so you can test it out risk-free!"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Trusted by 100+ businesses worldwide</h2>
        <Button size="lg" onClick={() => {}} className="mb-8">
          Try SocialTargeter Free
        </Button>
      </section>
    </div>
  )
}