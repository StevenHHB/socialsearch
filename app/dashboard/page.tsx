'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, Plus, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  keywords: string;
  url: string;
  leads: Lead[];
  createdAt: string;
}

interface Lead {
  id: string;
  content: string;
  url: string;
  reply?: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await axios.get('/api/products');
      console.log('Products response:', response.data);
      setProducts(response.data.products);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.leads.some(lead => lead.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getProductStatus = (product: Product) => {
    const currentDate = new Date();
    const createdDate = new Date(product.createdAt);
    const daysSinceCreation = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    return daysSinceCreation <= 30 ? 'active' : 'inactive';
  };

  const filteredProductsByStatus = filteredProducts.filter(product => {
    if (activeTab === 'all') return true;
    return getProductStatus(product) === activeTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Dashboard</h1>
        <p className="text-gray-600">Manage your products and leads</p>
      </motion.div>

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
          <Button onClick={() => window.location.href = '/dashboard/products'} size="sm">
            My Products
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredProductsByStatus.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48">
            <p className="text-gray-500 mb-4">No products found.</p>
            <Button onClick={() => window.location.href = '/dashboard/products'} size="sm">
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
            <Card key={product.id} className="overflow-hidden">
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
                  {product.leads.slice(0, 3).map((lead) => (
                    <div key={lead.id} className="text-sm text-gray-800 truncate">
                      {lead.url}
                    </div>
                  ))}
                </div>
                {product.leads.length > 3 && (
                  <Button
                    variant="link"
                    className="mt-2 text-sm"
                    onClick={() => window.location.href = `/dashboard/products/${product.id}`}
                  >
                    View all {product.leads.length} leads
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}