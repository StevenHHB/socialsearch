'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RefreshCw, Loader2, Copy, ChevronLeft, ChevronRight, AlertCircle, Twitter, Linkedin, MessageCircle, Globe, ExternalLink, Eye, ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react'
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

interface Product {
  id: number
  name: string
  description: string
  keywords: string
  url: string
  leads: Lead[]
  createdAt: string
  updatedAt: string
  userId: number
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
}

export default function ProjectPage() {
  const [product, setProduct] = useState<Product | null>(null);
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

  useEffect(() => {
    fetchProduct();
    fetchUserLimits();
  }, [id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data.product);
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
      toast.error('No remaining lead finds. Please upgrade your account.');
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
      toast.error('No remaining reply generations. Please upgrade your account.');
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
  const sortedLeads = product?.leads.sort((a, b) => 
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
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors duration-200"
        >
          <ChevronLeft className="mr-2" size={18} />
          Back to Projects
        </Button>
        <h1 className="text-4xl font-extrabold text-primary">
          {product?.name} project
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden mb-8">
          <CardHeader className="bg-muted border-b p-6">
            <CardTitle className="text-2xl font-bold">Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product?.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Keywords</h3>
              <p className="text-muted-foreground">{product?.keywords}</p>
            </div>
            <ProjectUrl />
            <div>
              <h3 className="font-semibold mb-2">Total Leads</h3>
              <p className="text-3xl font-bold text-primary">{product?.leads.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden mb-8">
          <CardHeader className="bg-muted border-b p-6 flex flex-col sm:flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold mb-4 sm:mb-0">Lead Analytics</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Remaining Leads: {remainingLeadFinds * 50}
              </div>
              <Button
                onClick={findLeads}
                disabled={isSearching || remainingLeadFinds <= 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
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
          </CardHeader>
          <CardContent className="p-6">
            {product?.leads.length === 0 ? (
              <EmptyState isSearching={isSearching} onFindLeads={findLeads} />
            ) : (
              <>
                {(product?.leads?.length ?? 0) > leadsPerPage && <PaginationControls />}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/12">Source</TableHead>
                      <TableHead className="w-2/12">Author</TableHead>
                      <TableHead className="w-5/12">Content</TableHead>
                      <TableHead className="w-1/12">Engagement</TableHead>
                      <TableHead className="w-2/12">Date</TableHead>
                      <TableHead className="w-1/12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentLeads.map((lead) => (
                        <React.Fragment key={lead.id}>
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-b border-muted"
                          >
                            <TableCell>{getSourceIcon(lead.url)}</TableCell>
                            <TableCell className="font-medium">{lead.authorName}</TableCell>
                            <TableCell>
                              {renderLeadContent(lead, product?.keywords || '')}
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline">{lead.score || 0}</Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{lead.isComment ? 'Comment score' : 'Post score'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>{format(new Date(lead.creationDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-2">
                                <Button
                                  onClick={() => showLeadDetails(lead)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-primary hover:text-primary-dark transition-colors"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                                <Button
                                  onClick={() => window.open(lead.url, '_blank')}
                                  size="sm"
                                  variant="ghost"
                                  className="text-primary hover:text-primary-dark transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Open lead
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-muted/50"
                          >
                            <TableCell colSpan={6}>
                              <div className="flex flex-col space-y-2">
                                {lead.reply && (
                                  <div className="bg-white p-2 rounded-md">
                                    <strong>Generated Reply:</strong>
                                    <p>{lead.reply}</p>
                                  </div>
                                )}
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    onClick={() => generateReply(lead.id)}
                                    size="sm"
                                    variant="outline"
                                    disabled={replyGenerating === lead.id || remainingReplyGenerations <= 0}
                                    className="bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                  >
                                    {replyGenerating === lead.id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        {lead.reply ? 'Regenerate Reply' : 'Generate Reply'}
                                      </>
                                    )}
                                  </Button>
                                  {lead.reply && (
                                    <Button
                                      onClick={() => {
                                        copyReply(lead.reply!)
                                        window.open(lead.url, '_blank')
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="bg-green-500 text-white hover:bg-green-600 transition-colors"
                                    >
                                      <ArrowUpRight className="mr-2 h-4 w-4" />
                                      Post Reply
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </motion.tr>
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                {(product?.leads?.length ?? 0) > leadsPerPage && <PaginationControls />}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogTitle className="text-2xl font-bold mb-4">
            {selectedLead?.isComment ? 'Comment Details' : 'Post Details'}
          </DialogTitle>
          <div className="grid gap-4 overflow-y-auto pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong className="text-muted-foreground">Author:</strong>
                <p>{selectedLead?.authorName}</p>
              </div>
              <div>
                <strong className="text-muted-foreground">Source:</strong>
                <p>{selectedLead?.subredditName || getSourceIcon(selectedLead?.url || '')}</p>
              </div>
              <div>
                <strong className="text-muted-foreground">Engagement:</strong>
                <p>{selectedLead?.score}</p>
              </div>
              <div>
                <strong className="text-muted-foreground">Created:</strong>
                <p>{selectedLead?.creationDate && format(new Date(selectedLead.creationDate), 'PPP')}</p>
              </div>
            </div>
            <div>
              <strong className="text-muted-foreground">Content:</strong>
              <p className="mt-1 p-4 bg-muted rounded-md break-words">{selectedLead?.content}</p>
            </div>
            <div>
              <strong className="text-muted-foreground">URL:</strong>
              <a href={selectedLead?.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center mt-1 break-all">
                {selectedLead?.url}
                <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0" />
              </a>
            </div>
            {selectedLead?.reply && (
              <div>
                <strong className="text-muted-foreground">Generated Reply:</strong>
                <p className="mt-1 p-4 bg-muted rounded-md break-words">{selectedLead.reply}</p>
                <Button
                  onClick={() => copyReply(selectedLead.reply!)}
                  size="sm"
                  variant="outline"
                  className="mt-2"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Reply
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
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