"use client"

import { TITLE_TAILWIND_CLASS } from '@/utils/constants'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faClipboardList, faIndustry, faCheckCircle, faChartLine, faUserPlus } from '@fortawesome/free-solid-svg-icons'

const FeatureData = [
  {
    id: 1,
    name: 'AI-Powered Search',
    description: 'Harness the power of AI to discover unique and available .com domains in seconds.',
    icon: faSearch,
  },
  {
    id: 2,
    name: 'Bulk Generation',
    description: 'Generate hundreds of domain ideas simultaneously, saving you time and effort.',
    icon: faClipboardList,
  },
  {
    id: 3,
    name: 'Industry-Specific Suggestions',
    description: 'Get tailored domain suggestions based on your industry and target audience.',
    icon: faIndustry,
  },
  {
    id: 4,
    name: 'Instant Availability Check',
    description: 'Real-time domain availability checks to ensure you never miss out on the perfect .com.',
    icon: faCheckCircle,
  },
  {
    id: 5,
    name: 'SEO-Friendly Analysis',
    description: 'Evaluate the SEO potential of each domain to boost your online presence.',
    icon: faChartLine,
  },
  {
    id: 6,
    name: 'One-Click Registration',
    description: 'Seamlessly register your chosen domain without leaving the platform.',
    icon: faUserPlus,
  },
]

const SpringAnimatedFeatures = () => {
  return (
    <div className="flex flex-col justify-center items-center lg:w-[85%]">
      <div className='flex flex-col mb-[4rem]'>
        <h2 className={`${TITLE_TAILWIND_CLASS} mt-2 font-bold tracking-tight text-gray-900 dark:text-white`}>
          Discover Your Perfect .com with useDotCom
        </h2>
        <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-400 text-center mt-4 text-lg">
          Unleash the power of AI to find and secure your ideal .com domain in minutes, not hours.
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
          Try useDotCom Now
        </motion.button>
      </Link>
    </div>
  )
}

export default SpringAnimatedFeatures
