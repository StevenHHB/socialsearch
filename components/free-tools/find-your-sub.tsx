'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Lightbulb, ArrowRight, Edit, Loader2 } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../components/ui/use-toast"

interface Subreddit {
  name: string
  subscribers: number
  description: string
}

export function FindYourSub() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<Subreddit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const response = await fetch('/api/tools/find-subreddits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, nsfw: false }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch subreddits')
      }
      const data = await response.json()
      setResults(data.results)
    } catch (error: any) {
      console.error('Error searching subreddits:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Edit className="mr-2 h-6 w-6" />
                  FindYourSub
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-white text-orange-600 text-sm">
                AI-Powered
              </Badge>
              <CardDescription className="text-gray-100 text-sm mt-2">
                Discover the best subreddits for your product marketing
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Input
              type="text"
              placeholder="Enter your product keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSearching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isSearching ? 'Searching...' : 'AI Search'}
            </Button>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="p-3">
                <CardTitle className="text-sm flex items-center text-yellow-700">
                  <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                  Keyword Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  <li>Use specific product features or benefits</li>
                  <li>Include your target audience or industry</li>
                  <li>Try different variations of your product name</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
                  <CardTitle className="text-lg">Results for "{keyword}"</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-4">
                    {results.map((sub, index) => (
                      <li key={index}>
                        <Card className="border border-gray-200">
                          <CardHeader className="p-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-md text-blue-600 truncate flex-1 mr-2">r/{sub.name}</CardTitle>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs whitespace-nowrap">
                                {sub.subscribers.toLocaleString()} members
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <p className="text-xs text-gray-600 line-clamp-3">{sub.description || 'No description available'}</p>
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold mb-2">Ready to supercharge your lead generation?</h3>
            <p className="mb-4 text-sm">Sign up now to automate finding leads and replying daily!</p>
            <Button size="sm" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
