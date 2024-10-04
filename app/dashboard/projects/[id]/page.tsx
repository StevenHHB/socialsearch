'use client'

import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Loader2, Copy, ChevronLeft, ChevronRight, AlertCircle, Twitter, Linkedin, MessageCircle, Globe, X } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent } from '../../../../components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip"

interface Product {
  id: string
  name: string
  description: string
  keywords: string
  url: string
  leads: Lead[]
  createdAt: string
}

interface Lead {
  id: string
  content: string
  url: string
  reply?: string
  source?: 'twitter' | 'linkedin' | 'reddit' | 'unknown'
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const leadsPerPage = 5

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/products/${params.id}`);
      setProduct(response.data.product);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError('Failed to fetch product');
    } finally {
      setIsLoading(false);
    }
  };

  const findLeads = useCallback(async () => {
    if (!product) return

    setIsSearching(true)
    setError(null)

    try {
      const response = await axios.post(`/api/products/${product.id}/find-leads`)
      
      if (response.status !== 200) {
        throw new Error('Failed to find leads: ' + response.data.error)
      }

      const newLeads = response.data.leads
      setProduct(prev => prev ? { ...prev, leads: [...prev.leads, ...newLeads] } : null)

    } catch (err: any) {
      console.error('Error finding leads:', err)
      setError('Failed to find leads: ' + err.message)
    } finally {
      setIsSearching(false)
    }
  }, [product])

  const generateReply = useCallback(async (leadId: string) => {
    if (!product) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(`/api/leads/${leadId}/generate-reply`)
      
      if (response.status !== 200) {
        throw new Error('Failed to generate reply: ' + response.data.error)
      }

      const updatedLead = response.data.lead

      setProduct(prev => {
        if (!prev) return null
        const updatedLeads = prev.leads.map(lead => 
          lead.id === updatedLead.id ? updatedLead : lead
        )
        return { ...prev, leads: updatedLeads }
      })

      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [product])

  const getLeadSource = (url: string): 'twitter' | 'linkedin' | 'reddit' | 'unknown' => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('twitter.com')) return 'twitter';
      if (parsedUrl.hostname.includes('linkedin.com')) return 'linkedin';
      if (parsedUrl.hostname.includes('reddit.com')) return 'reddit';
      return 'unknown';
    } catch (error) {
      console.error('Error parsing URL:', error);
      return 'unknown';
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Product not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const indexOfLastLead = currentPage * leadsPerPage
  const indexOfFirstLead = indexOfLastLead - leadsPerPage
  const currentLeads = product.leads.slice(indexOfFirstLead, indexOfLastLead)
  const totalPages = Math.ceil(product.leads.length / leadsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">{product.name}</h1>
      <p className="text-gray-600 mt-2 text-lg">{product.description}</p>
      
      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Available Leads</h3>
      {currentLeads.map((lead) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {getLeadSource(lead.url) === 'twitter' && <Twitter className="mr-2 text-blue-400" size={18} />}
              {getLeadSource(lead.url) === 'linkedin' && <Linkedin className="mr-2 text-blue-600" size={18} />}
              {getLeadSource(lead.url) === 'reddit' && <MessageCircle className="mr-2 text-orange-500" size={18} />}
              {getLeadSource(lead.url) === 'unknown' && <Globe className="mr-2 text-gray-400" size={18} />}
              <a href={lead.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {lead.url}
              </a>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText(lead.url)}
                    aria-label={`Copy ${lead.url}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Copy size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-gray-300 mb-2">{lead.content}</p>
          {lead.reply ? (
            <div className="mt-2 p-2 bg-blue-900 rounded-md">
              <p className="text-sm text-blue-200">{lead.reply}</p>
            </div>
          ) : (
            <Button
              onClick={() => generateReply(lead.id)}
              className="mt-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              Generate Reply
            </Button>
          )}
        </motion.div>
      ))}
      {product.leads.length > leadsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      <Button
        onClick={findLeads}
        className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg py-3 rounded-lg transition-all duration-300 transform hover:scale-105 mt-6"
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2" size={20} />
            Analyze & Find Leads
          </>
        )}
      </Button>

      <Button
        onClick={() => router.push('/dashboard/projects')}
        className="mt-4 w-full text-gray-700 hover:text-gray-900 border-2 hover:bg-gray-100 transition-colors duration-200"
      >
        <X className="mr-2" size={18} />
        Back to Projects
      </Button>
    </div>
  )
}
