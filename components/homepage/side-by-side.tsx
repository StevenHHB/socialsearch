'use client'

import { Sparkles, Zap, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    name: 'AI-Powered Suggestions',
    description:
      'Our advanced AI algorithms generate creative and relevant domain suggestions based on your input, saving you time and sparking inspiration.',
    icon: Sparkles,
  },
  {
    name: 'Lightning-Fast Search',
    description: 'Instantly check the availability of multiple domains simultaneously, allowing you to explore more options in less time.',
    icon: Zap,
  },
  {
    name: 'Global TLD Support',
    description: 'While we specialize in .com domains, our platform supports a wide range of TLDs to ensure you find the perfect domain for your needs.',
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
              Revolutionize Your Domain Search
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              useDotCom leverages cutting-edge AI technology to streamline your domain search process, 
              making it easier than ever to find the perfect .com domain for your brand.
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
            className="lg:pl-16"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80"
                alt="AI-powered domain search visualization"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="/dashboard" // Updated link
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
                >
                  Start Your Search
                </a>
              </div>
              <div className="ml-3 inline-flex">
                <a
                  href="/dashboard" // Updated link
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-800 px-5 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Learn More
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/*import { Computer, Network } from 'lucide-react'
import { FaBusinessTime } from 'react-icons/fa'
import { OrbitingCirclesComponent } from './orbiting-circles'
import { TITLE_TAILWIND_CLASS } from '@/utils/constants'

const features = [
  {
    name: 'Build faster.',
    description:
      'Get up and running in no time with pre-configured settings and best practices. Say goodbye to setup and focus on what truly matters - building your application.',
    icon: Computer,
  },
  {
    name: 'Focus on business logic.',
    description: 'Concentrate on solving business problems instead of dealing with the repetitive setup.',
    icon: FaBusinessTime,
  },
  {
    name: 'Ready for scale.',
    description: 'Prepare for growth from day one. With built-in optimizations and scalable architecture, your application will be ready to handle increased traffic and complexity.',
    icon: Network,
  },
]

export default function SideBySide() {
  return (
    <div className="overflow-hidden ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}>
                Nextjs Starter Kit: A faster way to production
              </p>
              <p className="mt-6 leading-8 text-gray-600 dark:text-gray-400">
                Accelerate your development with this powerful Nextjs Starter Kit
              </p>
              <dl className="mt-10 max-w-xl space-y-8 leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold dark:text-gray-100 text-gray-900">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline dark:text-gray-400">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <OrbitingCirclesComponent />
        </div>
      </div>
    </div>
  )
}
*/