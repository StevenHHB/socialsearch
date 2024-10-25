'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RefreshCw, Loader2, Copy, ChevronLeft, ChevronRight, AlertCircle, ExternalLink, Eye, ArrowUpRight, MessageSquare, Sparkles, Pencil, Tag } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../../components/ui/table'
import { Badge } from '../../../../components/ui/badge'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogTitle } from '../../../../components/ui/dialog'
import { AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { highlightKeywords } from '../../../../utils/textUtils'
import { KeywordEditor } from '../../../../components/KeywordEditor'
import { useToast } from '../../../../components/ui/use-toast'
import { Progress } from '../../../../components/ui/progress'
import { differenceInDays } from 'date-fns'

interface Product {
  id: number;
  name: string;
  description: string;
  keywords: string;
  url: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductWithLeads extends Product {
  leads: Lead[];
}

interface Lead {
  id: string
  content: string
  url: string
  authorName: string | null
  authorId: string | null
  authorUrl: string | null
  creationDate: string
  subredditName: string | null
  subredditUrl: string | null
  subredditTitle: string | null
  score: number | null
  nsfw: boolean
  contentLanguage: string | null
  upvoteRatio: number | null
  numComments: number | null
  contentType: string | null
  postTitle: string | null
  postUrl: string | null
  productId: number
  createdAt: string
  updatedAt: string
  reply: string | null
  isComment: boolean
  keyword?: string;
}

export default function ProjectPage() {
  const [product, setProduct] = useState<ProductWithLeads | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [replyGenerating, setReplyGenerating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const leadsPerPage = 10;
  const { id } = useParams();
  const router = useRouter();

  const [remainingLeadFinds, setRemainingLeadFinds] = useState(0);
  const [remainingReplyGenerations, setRemainingReplyGenerations] = useState(0);
  const [isEditingKeywords, setIsEditingKeywords] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [showRefreshReminder, setShowRefreshReminder] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchUserLimits();
  }, [id]);

  useEffect(() => {
    if (product?.keywords) {
      const keywords = product.keywords.split(',').map(k => k.trim()).filter(k => k);
      if (keywords.length > 0) {
        setSelectedKeyword(keywords[0]);
      }
    }
  }, [product?.keywords]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data.product as ProductWithLeads);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError('Failed to fetch product');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLimits = async () => {
    try {
      const response = await fetch('/api/user/limits');
      const data = await response.json();
      setRemainingLeadFinds(data.remainingLeadFinds);
      setRemainingReplyGenerations(data.remainingReplyGenerations);
    } catch (error) {
      console.error('Error fetching user limits:', error);
    }
  };

  const findLeads = async () => {
    if (remainingLeadFinds <= 0) {
      toast({ description: 'No remaining lead finds. Please upgrade your account.' });
      router.push('/dashboard/finance');
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${id}/find-leads`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to find leads');
      const data = await response.json();
      await fetchProduct(); // Refresh product data
      setRemainingLeadFinds(prev => prev - 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const generateReply = async (leadId: string) => {
    if (remainingReplyGenerations <= 0) {
      toast({ description: 'No remaining reply generations. Please upgrade your account.' });
      router.push('/dashboard/finance');
      return;
    }

    if (!product) return;
    setReplyGenerating(leadId);
    setError(null);
    try {
      const response = await fetch(`/api/leads/${leadId}/generate-reply`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to generate reply');
      const data = await response.json();
      setProduct((prev) => {
        if (!prev) return null;
        const updatedLeads = prev.leads.map((lead) =>
          lead.id === data.lead.id ? { ...lead, reply: data.lead.reply } : lead
        );
        return { ...prev, leads: updatedLeads };
      });
      setRemainingReplyGenerations(prev => prev - 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setReplyGenerating(null);
    }
  };

  const copyReply = useCallback((reply: string) => {
    navigator.clipboard.writeText(reply)
  }, [])

  const getSourceIcon = (url: string) => {
    if (url.includes('twitter.com')) return <span className="font-bold text-[#1DA1F2]">Twitter</span>
    if (url.includes('linkedin.com')) return <span className="font-bold text-[#0A66C2]">LinkedIn</span>
    if (url.includes('reddit.com')) return <span className="font-bold text-muted-foreground">Reddit</span>
    return <span className="font-bold text-muted-foreground">Web</span>
  }

  // Sort leads by date, newest to oldest
  const sortedLeads = product?.leads?.sort((a, b) => 
    new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
  ) || []

  const indexOfLastLead = currentPage * leadsPerPage
  const indexOfFirstLead = indexOfLastLead - leadsPerPage
  const currentLeads = sortedLeads.slice(indexOfFirstLead, indexOfLastLead)
  const totalPages = Math.ceil(sortedLeads.length / leadsPerPage)

  const showLeadDetails = (lead: Lead) => {
    setSelectedLead(lead)
  }

  const PaginationControls = () => (
    <div className="flex justify-center mt-4 mb-4 space-x-2">
      <Button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
      >
        <ChevronLeft size={16} />
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  )

  // Updated URL display logic
  const ProjectUrl = () => (
    <div>
      <h3 className="font-semibold mb-2">URL</h3>
      {product?.url ? (
        <a href={product.url} className="text-primary hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
          {product.url}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      ) : (
        <p className="text-muted-foreground">No URL provided</p>
      )}
    </div>
  )

  const renderLeadContent = (lead: Lead, keywords: string) => {
    const keywordArray = keywords.split(',').map(k => k.trim());
    const content = lead.content || lead.postTitle || '';
    const highlightedContent = highlightKeywords(content, keywordArray);
    
    return (
      <div className="max-w-xs">
        <p dangerouslySetInnerHTML={{ __html: highlightedContent }} />
      </div>
    );
  };

  const handleSaveKeywords = async (keywords: string[]) => {
    if (keywords.length > 5) {
      setError('You can only save up to 5 keywords.');
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}/keywords`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords }),
      });
      if (!response.ok) throw new Error('Failed to update keywords');
      const data = await response.json();
      setProduct(prevProduct => {
        if (!prevProduct) return null;
        return { ...prevProduct, ...data.product };
      });
      setIsEditingKeywords(false);
      setError(null); // Clear any previous errors

      if (response.ok) {
        setShowRefreshReminder(true);
        setTimeout(() => setShowRefreshReminder(false), 10000); // Hide reminder after 10 seconds
      }
    } catch (error: any) {
      console.error('Error updating keywords:', error);
      setError('Failed to update keywords');
    }
  };

  const getNewestLeads = useCallback(async () => {
    if (remainingLeadFinds <= 0) {
      toast({
        title: "No remaining lead finds",
        description: "Please upgrade your account to find more leads.",
        variant: "destructive",
      });
      router.push('/dashboard/finance');
      return;
    }

    setIsRefreshing(true);
    setProgress(0);
    setError(null);

    const keywords = product?.keywords.split(',').map(k => k.trim()).filter(k => k) || [];

    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];

      try {
        const response = await fetch(`/api/products/${id}/find-leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getNewestLeads', keyword }),
        });

        if (!response.ok) {
          throw new Error('Failed to find leads');
        }

        const data = await response.json();

        // Update product leads
        setProduct(prevProduct => {
          if (!prevProduct) return null;
          const newLeads = [...data.leads, ...prevProduct.leads]
            .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
          return { ...prevProduct, leads: newLeads };
        });

        setProgress(((i + 1) / keywords.length) * 100);
      } catch (error) {
        console.error('Error fetching leads for keyword:', keyword, error);
        toast({
          title: "Error finding leads",
          description: `Failed to fetch leads for keyword: ${keyword}. Skipping to next keyword.`,
          variant: "destructive",
        });
      }
    }

    setRemainingLeadFinds(prev => prev - 1);
    setIsRefreshing(false);
    toast({
      title: "New leads found",
      description: `Finished searching for new leads.`,
    });
  }, [product, remainingLeadFinds, router, toast, id]);

  useEffect(() => {
    if (product?.leads && product.leads.length > 0) {
      const newestLeadDate = new Date(product.leads[0].creationDate);
      const daysSinceNewestLead = differenceInDays(new Date(), newestLeadDate);
      
      if (daysSinceNewestLead >= 1) {
        toast({
          title: "New leads may be available",
          description: "It's been a while since you last refreshed. Click 'Get Newest Leads' to check for updates.",
          duration: 10000,
        });
      }
    }
  }, [product?.leads]);

  const filteredLeads = React.useMemo(() => {
    if (!selectedKeyword) return [];
    return (product?.leads || []).filter(lead => 
      (lead.content || lead.postTitle || '').toLowerCase().includes(selectedKeyword.toLowerCase())
    );
  }, [product?.leads, selectedKeyword]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... Rest of your component remains the same */}
    </div>
  )
}

const EmptyState = ({ isSearching, onFindLeads }: { isSearching: boolean; onFindLeads: () => void }) => (
  <div className="text-center py-12">
    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-semibold">No leads found yet</h3>
    <p className="mt-2 text-muted-foreground">
      Click "Discover New Leads" to start finding potential customers for your product.
    </p>
    <Button 
      className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={onFindLeads}
      disabled={isSearching}
    >
      {isSearching ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Discover New Leads
        </>
      )}
    </Button>
  </div>
)
