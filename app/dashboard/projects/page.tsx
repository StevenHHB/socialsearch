'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Copy, RefreshCw, Search, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [createProductStep, setCreateProductStep] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data.products)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const createProduct = async (name: string, description: string, keywords: string, url: string) => {
    setIsLoading(true)
    setCreateProductStep(1)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCreateProductStep(2)
      await new Promise(resolve => setTimeout(resolve, 1000))
      const response = await axios.post('/api/products', {
        name,
        description,
        keywords,
        url,
      })
      setProducts((prev) => [response.data.product, ...prev])
      setError(null)
      setCreateProductStep(3)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err: any) {
      console.error('Error creating product:', err)
      setError('Failed to create product')
    } finally {
      setIsLoading(false)
      setCreateProductStep(0)
      setIsDialogOpen(false)
    }
  }

  const getProductStatus = (product: Product) => {
    const currentDate = new Date()
    const createdDate = new Date(product.createdAt)
    const daysSinceCreation = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24))
    return daysSinceCreation <= 30 ? 'active' : 'inactive'
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.leads.some(lead => lead.url.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredProductsByStatus = filteredProducts.filter(product => {
    if (activeTab === 'all') return true
    return getProductStatus(product) === activeTab
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-5xl font-extrabold text-gray-900 mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Product Dashboard
      </motion.h1>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products or leads"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-48 w-full animate-pulse">
              <CardHeader className="bg-gray-100 h-12"></CardHeader>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProductsByStatus.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48">
            <p className="text-gray-500 mb-4">No products found.</p>
            <Button onClick={() => setIsDialogOpen(true)} size="sm">
              Create Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProductsByStatus.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Link href={`/dashboard/projects/${product.id}`}>
                <Card className="overflow-hidden cursor-pointer h-full">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{product.name}</span>
                      <Badge variant={getProductStatus(product) === 'active' ? 'default' : 'secondary'}>
                        {getProductStatus(product)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                    <div className="space-y-2">
                      {product.leads && product.leads.slice(0, 3).map((lead) => (
                        <motion.div
                          key={lead.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                        >
                          <span className="text-sm text-gray-800">{lead.url}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    navigator.clipboard.writeText(lead.url)
                                  }}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  <Copy size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy to clipboard</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      ))}
                    </div>
                    {product.leads && product.leads.length > 3 && (
                      <Button
                        variant="link"
                        className="mt-2 text-sm"
                      >
                        View all {product.leads.length} leads
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white p-8 rounded-lg max-w-3xl w-full m-4 shadow-2xl">
          <DialogTitle className="text-3xl font-semibold text-gray-800 mb-2">Create New Product</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const name = (form.elements.namedItem('name') as HTMLInputElement).value
              const description = (form.elements.namedItem('description') as HTMLInputElement).value
              const keywords = (form.elements.namedItem('keywords') as HTMLInputElement).value
              const url = (form.elements.namedItem('url') as HTMLInputElement).value
              createProduct(name, description, keywords, url)
            }}
            className="space-y-4"
          >
            <Input id="name" placeholder="Product Name" required />
            <Textarea id="description" placeholder="Product Description" required />
            <Input id="keywords" placeholder="Keywords (comma separated)" required />
            <Input id="url" placeholder="Product URL" type="url" required />
            <AnimatePresence>
              {createProductStep > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {/* ... (creation steps) ... */}
                </motion.div>
              )}
            </AnimatePresence>
            <Button type="submit" className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-3 rounded-lg transition-all duration-300 transform hover:scale-105" disabled={createProductStep > 0}>
              <Plus className="mr-2" size={20} />
              Create Product
            </Button>
          </form>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full text-gray-700 hover:text-gray-900 border-2 hover:bg-gray-100 transition-colors duration-200">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}