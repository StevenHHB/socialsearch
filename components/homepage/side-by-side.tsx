'use client'

import { Sparkles, Zap, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    name: 'AI-Powered Lead Discovery',
    description:
      'Our advanced AI algorithms analyze social media profiles to identify potential leads based on your target audience and industry, saving you time and sparking new opportunities.',
    icon: Sparkles,
  },
  {
    name: 'Multi-Platform Analysis',
    description: 'Simultaneously analyze leads from multiple social media platforms, allowing you to explore more opportunities in less time.',
    icon: Zap,
  },
  {
    name: 'Personalized Engagement',
    description: 'Generate tailored responses for each potential lead, increasing your chances of successful engagement and conversion.',
    icon: Globe,
  },
]

export default function SideBySide() {
  return (
    <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          <div>
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Revolutionize Your Lead Generation
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              SocialTargeter leverages cutting-edge AI technology to streamline your lead generation process, 
              making it easier than ever to find and engage with potential customers across social media platforms.
            </motion.p>
            <motion.div 
              className="mt-10 space-y-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <Card key={feature.name}>
                  <CardContent className="flex items-start p-6">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
              <img
                src="/images/dashboard-preview.jpg"
                alt="SocialTargeter Dashboard Preview"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Powerful Dashboard</h3>
              <p className="text-gray-300">
                Manage your leads, track engagement, and optimize your outreach efforts all in one place.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}