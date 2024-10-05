'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Check, ArrowRight, Loader2, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [step, setStep] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [generatedLeads, setGeneratedLeads] = useState<string[]>([])
  const [error, setError] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    "Analyzing social media profiles...",
    "Identifying potential leads...",
    "Generating personalized responses..."
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError('Please enter your target audience or industry')
      toast({
        title: "Error",
        description: "Please enter your target audience or industry before searching.",
        variant: "destructive",
      })
      searchInputRef.current?.focus()
      return
    }
    setError('')
    setIsSearching(true)
    setStep(0)
    setGeneratedLeads([])
  }

  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        if (step < steps.length - 1) {
          setStep(step + 1)
        } else {
          setIsSearching(false)
          setShowResults(true)
          generateLeads()
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isSearching, step])

  const generateLeads = () => {
    const leads = [
      "John Doe - Marketing Manager at TechCorp",
      "Jane Smith - CEO of InnovateNow",
      "Mike Johnson - Sales Director at GrowthInc",
      "Sarah Brown - Entrepreneur and Startup Founder",
      "Alex Lee - Digital Marketing Specialist"
    ]
    setGeneratedLeads(leads)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4">AI-Powered Lead Generation</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Find Your Perfect <span className="text-blue-600 dark:text-blue-400">Leads</span> with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Stop wasting hours manually searching for leads. Our AI analyzes social media profiles, identifies potential leads, and generates personalized responses - all in one go.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full sm:w-96">
            <Input 
              type="text" 
              placeholder="Enter your target audience or industry" 
              className={`pl-10 pr-20 ${error ? 'border-red-500' : ''}`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setError('')
              }}
              ref={searchInputRef}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Button 
              className="absolute right-1 top-1/2 transform -translate-y-1/2" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              {isSearching ? 'Searching' : 'Find Leads'}
            </Button>
          </div>
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}

        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{steps[step]}</span>
                </div>
                <div className="mt-3 flex justify-between">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-1/3 ${
                        index <= step ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                      } rounded-full transition-all duration-300 ease-in-out`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">We've found some great leads for you!</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {generatedLeads.map((lead, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="font-medium">{lead}</span>
                      <Lock className="text-gray-400" size={16} />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Unlock your tailored lead suggestions and start growing your business today!
                </p>
                <Button onClick={() => window.location.href = '/dashboard'} size="lg" className="w-full">
                  Sign In to View Your Leads <ArrowRight className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            'AI-powered lead identification',
            'Multi-platform social media analysis',
            'Personalized engagement suggestions'
          ].map((feature, index) => (
            <div key={index} className="flex items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <Check className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </motion.div>

        <motion.div 
          className="relative mx-auto w-full overflow-hidden rounded-xl bg-gray-900 shadow-2xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="relative p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white mb-4">How SocialTargeter Transforms Your Lead Generation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Traditional Methods</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• Hours of manual social media searching</li>
                  <li>• Limited reach and platform coverage</li>
                  <li>• Generic outreach messages</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">With SocialTargeter</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• AI analyzes multiple platforms instantly</li>
                  <li>• Identifies high-quality, relevant leads</li>
                  <li>• Generates personalized engagement suggestions</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In to View Your Leads</DialogTitle>
            <DialogDescription>
              Create an account to unlock your tailored lead suggestions and start growing your business today!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input id="email" placeholder="Email" className="col-span-4" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input id="password" type="password" placeholder="Password" className="col-span-4" />
            </div>
          </div>
          <Button onClick={() => setIsDialogOpen(false)} className="w-full">
            Create Account
          </Button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <a href="#" className="text-blue-500 hover:underline">Sign in</a>
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}