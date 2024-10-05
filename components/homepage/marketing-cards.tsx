"use client"

import { TITLE_TAILWIND_CLASS } from '@/utils/constants'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faChartLine, faUserFriends, faLightbulb, faCog, faShieldAlt } from '@fortawesome/free-solid-svg-icons'

const FeatureData = [
  {
    id: 1,
    name: 'AI-Powered Lead Discovery',
    description: 'Our advanced algorithms analyze social media profiles to identify high-quality leads tailored to your business.',
    icon: faRobot,
  },
  {
    id: 2,
    name: 'Multi-Platform Analysis',
    description: 'Simultaneously search for leads across multiple social media platforms, expanding your reach and opportunities.',
    icon: faChartLine,
  },
  {
    id: 3,
    name: 'Personalized Engagement',
    description: 'Generate customized outreach messages for each lead, increasing your chances of successful connections.',
    icon: faUserFriends,
  },
  {
    id: 4,
    name: 'Smart Recommendations',
    description: 'Receive intelligent suggestions for optimizing your lead generation and engagement strategies.',
    icon: faLightbulb,
  },
  {
    id: 5,
    name: 'Automated Workflows',
    description: 'Set up automated lead nurturing sequences to save time and improve conversion rates.',
    icon: faCog,
  },
  {
    id: 6,
    name: 'Data Privacy & Security',
    description: 'Rest easy knowing your data and your leads\' information is protected with enterprise-grade security.',
    icon: faShieldAlt,
  },
]

const SpringAnimatedFeatures = () => {
  return (
    <div className="flex flex-col justify-center items-center lg:w-[85%]">
      <div className='flex flex-col mb-[4rem]'>
        <h2 className={`${TITLE_TAILWIND_CLASS} mt-2 font-bold tracking-tight text-gray-900 dark:text-white`}>
          Discover Your Perfect Leads with SocialTargeter
        </h2>
        <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-400 text-center mt-4 text-lg">
          Unleash the power of AI to find and engage with ideal leads across social media platforms in minutes, not hours.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FeatureData.map((feature) => (
          <motion.div
            whileHover={{
              y: -12,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            key={feature.id}
            className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="mb-4">
              <FontAwesomeIcon icon={feature.icon} size="4x" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              {feature.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
      <Link href="/dashboard" className="mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
        >
          Try SocialTargeter Now
        </motion.button>
      </Link>
    </div>
  )
}

export default SpringAnimatedFeatures