'use client'

import React, { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Lightbulb, ArrowRight, Edit, Loader2 } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../components/ui/use-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"

interface Subreddit {
  name: string
  subscribers: number
  description: string
}

export function FindYourSub() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<Subreddit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSignInDialog, setShowSignInDialog] = useState(false)
  const { isLoaded, userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSearch = async () => {
    if (!isLoaded) return

    if (!userId) {
      setShowSignInDialog(true)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch('/api/tools/find-subreddits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, nsfw: false }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch subreddits')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (error: any) {
      console.error('Error searching subreddits:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold flex items-center">
                  <Edit className="mr-2 h-8 w-8" />
                  FindYourSub
                </CardTitle>
                <Badge variant="secondary" className="bg-white text-orange-600">
                  AI-Powered
                </Badge>
              </div>
              <CardDescription className="text-gray-100 mt-2">
                Discover the best subreddits for your product marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-4 mb-6">
                <Input
                  type="text"
                  placeholder="Enter your product keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-grow text-lg"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSearching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  {isSearching ? 'Searching...' : 'AI Search'}
                </Button>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-yellow-700">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                    Keyword Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Use specific product features or benefits</li>
                    <li>Include your target audience or industry</li>
                    <li>Try different variations of your product name</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Card className="bg-white shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <CardTitle className="text-2xl">Best Subreddits for "{keyword}"</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {results.map((sub, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-white border-2 border-gray-200 hover:border-blue-500 transition-colors duration-300">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg text-blue-600">r/{sub.name}</CardTitle>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {sub.subscribers.toLocaleString()} members
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{sub.description || 'No description available'}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-b-lg">
                  <div className="w-full text-center py-6">
                    <h3 className="text-2xl font-bold mb-2">Ready to supercharge your lead generation?</h3>
                    <p className="mb-4">Sign up now to automate finding leads and replying daily!</p>
                    <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                      Start Your Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              To use this powerful tool and discover the best subreddits for your product, please sign in or create an account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button asChild onClick={() => setShowSignInDialog(false)} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/sign-in">
                Sign In / Register
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
