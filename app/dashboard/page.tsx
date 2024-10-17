// Redesigned Projects Page (projects page.tsx)
'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, Search, AlertCircle, Zap, X, Check, ArrowRight, Calendar, Hash, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface Product {
  id: string;
  name: string;
  description: string;
  keywords: string;
  url: string;
  leads: Lead[];
  createdAt: string;
  totalLeads: number;
  lastLeadDate: string | null;
}

interface Lead {
  id: string;
  content: string;
  url: string;
  reply?: string;
  source?: 'twitter' | 'linkedin' | 'reddit' | 'unknown';
  creationDate: string; // Add this line
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [newProduct, setNewProduct] = useState<{
    name: string;
    description: string;
    keywords: string[];
    url: string;
  }>({ name: '', description: '', keywords: [], url: '' });
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [keywordError, setKeywordError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/products');
      const productsWithLeadInfo = response.data.products.map((product: Product) => ({
        ...product,
        totalLeads: product.leads.length,
        lastLeadDate: product.leads.length > 0
          ? new Date(Math.max(...product.leads.map(lead => new Date(lead.creationDate).getTime()))).toISOString()
          : null
      }));
      setProducts(productsWithLeadInfo);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const productData = {
        ...newProduct,
        keywords: newProduct.keywords.join(',')
      };
      const response = await axios.post('/api/products', productData);
      setProducts([...products, response.data.product]);
      setIsDialogOpen(false);
      setNewProduct({ name: '', description: '', keywords: [], url: '' });
      setError(null);
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError('Failed to create product: ' + err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && newProduct.keywords.length < 5) {
      if (newProduct.keywords.includes(currentKeyword.trim())) {
        setKeywordError('This keyword already exists.');
        return;
      }
      setNewProduct(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
      setKeywordError('');
    }
  };

  const removeKeyword = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewProduct({ ...newProduct, url });
    setIsCheckingUrl(true);
    setIsValidUrl(null);

    // Simple URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    setTimeout(() => {
      setIsCheckingUrl(false);
      if (url.trim() !== '') {
        setIsValidUrl(urlPattern.test(url));
      } else {
        setIsValidUrl(null);
      }
    }, 1000); // Simulated delay for URL checking
  };

  const getProductStatus = (product: Product) => {
    const currentDate = new Date();
    const createdDate = new Date(product.createdAt);
    const daysSinceCreation = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    return daysSinceCreation <= 30 ? 'active' : 'inactive';
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Projects
        </motion.h1>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white border-gray-300 text-gray-700 shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchProducts} variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-200">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setIsDialogOpen(true)} size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-8">
          <TabsList className="bg-white border-gray-300">
            <TabsTrigger value="all" className="text-gray-600 data-[state=active]:bg-blue-500">All Projects</TabsTrigger>
            <TabsTrigger value="active" className="text-gray-600 data-[state=active]:bg-blue-500">Active</TabsTrigger>
            <TabsTrigger value="inactive" className="text-gray-600 data-[state=active]:bg-blue-500">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-48 w-full animate-pulse bg-gray-200 border-gray-300">
                <CardHeader className="bg-gray-300 h-12"></CardHeader>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="bg-white border-gray-300 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Project Hub!</h2>
                <p className="text-gray-600 mb-6">Let's kickstart your journey to finding amazing leads.</p>
                <ol className="text-left text-gray-700 mb-8 space-y-4">
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">1</span>
                    <span>Click on "New Project" to create your first project.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">2</span>
                    <span>Give your project a name and brief description.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">3</span>
                    <span>Add some keywords related to your product or service.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">4</span>
                    <span>Sit back and let our AI find the best leads for you!</span>
                  </li>
                </ol>
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Project
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => window.location.href = `/dashboard/projects/${product.id}`}
              >
                <CardHeader className="bg-blue-500 text-white">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{product.name}</span>
                    <Badge variant={getProductStatus(product) === 'active' ? 'default' : 'secondary'} className="bg-white text-blue-600">
                      {getProductStatus(product)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Hash className="w-4 h-4 mr-2 text-blue-500" />
                      Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.keywords.split(',').map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        Total Leads
                      </h4>
                      <span className="text-2xl font-bold text-blue-600">{product.totalLeads}</span>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        Last Lead
                      </h4>
                      <span className="text-sm font-medium text-purple-600">
                        {product.lastLeadDate ? new Date(product.lastLeadDate).toLocaleDateString() : 'No leads yet'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {product.leads && product.leads.length > 0 ? (
                      product.leads.slice(0, 2).map((lead) => (
                        <div key={lead.id} className="text-sm text-gray-800">
                          {lead.content.substring(0, 100)}...
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-600 italic">
                        Click to start generating leads for this project!
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-medium text-blue-600">Manage Leads</span>
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogTitle className="text-2xl font-bold mb-4">Create New Project</DialogTitle>
          <form onSubmit={handleCreateProduct}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-lg">Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3 h-16 text-lg" // Increased height
                  placeholder="Enter a concise, descriptive name for your project."
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right text-lg mt-2">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="col-span-3 h-48 text-lg" // Increased height
                  placeholder="Provide key features and benefits of your product or service that would appeal to potential leads."
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="keywords" className="text-right text-lg mt-2">Keywords</Label>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newProduct.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-base">
                        {keyword}
                        <X
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={() => removeKeyword(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="keywords"
                      value={currentKeyword}
                      onChange={(e) => setCurrentKeyword(e.target.value)}
                      placeholder="Type a keyword and click 'Add' (up to 5)"
                      className="flex-grow h-16 text-lg"
                    />
                    <Button 
                      type="button" 
                      onClick={addKeyword} 
                      size="lg" 
                      className={`bg-blue-500 hover:bg-blue-600 ${newProduct.keywords.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      disabled={newProduct.keywords.length >= 5}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Add keywords one by one. Don't use commas.</p>
                  {keywordError && <p className="text-red-500 text-sm mt-1">{keywordError}</p>}
                  
                  {/* New Keyword Guidance Section */}
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">Keyword Tips</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Use specific product features or benefits</li>
                      <li>Include your target audience or industry</li>
                      <li>Try "[Competitor] + alternative" (e.g., "Airtable alternative")</li>
                      <li>Add problem-specific phrases (e.g., "streamline project management")</li>
                      <li>Incorporate current trends or pain points in your industry</li>
                    </ul>
                    <div className="mt-3">
                      <strong className="text-blue-700">Examples:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="bg-white">project management software</Badge>
                        <Badge variant="outline" className="bg-white">remote team collaboration</Badge>
                        <Badge variant="outline" className="bg-white">agile workflow tool</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right text-lg">URL (Optional)</Label>
                <div className="col-span-3 relative">
                  <Input
                    id="url"
                    value={newProduct.url}
                    onChange={handleUrlChange}
                    className="pr-10 h-16 text-lg" // Increased height
                    placeholder="Enter your product or service URL (optional)"
                  />
                  {isCheckingUrl && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {!isCheckingUrl && isValidUrl === true && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-6 w-6" />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg">
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CSS for loading animation (add this to your CSS file) */}
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Further improvement continues for the product[id] page ...

// Redesigned elements:
// 1. Redesigned UI and light theme for better consistency.
// 2. Added smooth hover and transition animations.
// 3. Enhanced spacing, card borders, and shadow effects for a more elegant look.
// 4. Included additional product information such as total leads and last lead generated date.
// 5. Improved visual cues for creating new projects and adding leads.
