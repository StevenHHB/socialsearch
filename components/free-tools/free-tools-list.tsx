import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Search, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

const tools = [
  {
    id: 'find-your-sub',
    title: 'FindYourSub',
    description: 'Discover the perfect subreddit to market your product',
    icon: Search,
    color: 'bg-orange-500',
    link: '/free-tools/find-your-sub',
  },
]

export function FreeToolsList() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={tool.link}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <CardHeader className={`${tool.color} text-white`}>
                    <div className="flex justify-between items-center">
                      <tool.icon className="h-8 w-8" />
                      <Badge variant="secondary" className="bg-white text-gray-800">
                        Free
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-2xl">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <CardDescription className="text-gray-600 mt-2">
                      {tool.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
                      Try it now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}