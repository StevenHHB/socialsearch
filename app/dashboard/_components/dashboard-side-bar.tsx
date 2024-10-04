'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import clsx from 'clsx'
import {
  Banknote,
  Zap,
  Folder,
  HomeIcon,
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  MessageSquare
} from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardSideBarProps {
  remainingLeadFinds: number;
  remainingReplyGenerations: number;
}

export default function DashboardSideBar({ remainingLeadFinds, remainingReplyGenerations }: DashboardSideBarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' }
  };

  const linkVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      className="h-full border-r bg-white dark:bg-gray-900 overflow-hidden"
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-[60px] items-center justify-between border-b px-4">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link className="flex items-center gap-2 font-semibold" href="/">
                  <span className="text-xl">UseDotCom PRO</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto"
          >
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-4 px-3">
          <nav className="grid gap-2">
            {[
              { href: "/dashboard", icon: HomeIcon, label: "Leads" },
              { href: "/dashboard/projects", icon: Folder, label: "Projects" },
              { href: "/dashboard/finance", icon: Banknote, label: "Billings" },
              { href: "/dashboard/settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === item.href ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"
                )}
              >
                <div className="rounded-md bg-white p-1 shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      className="font-medium"
                      variants={linkVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-md bg-white p-1 shadow-sm">
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      className="font-medium text-sm"
                      variants={linkVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      Remaining Searches
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Progress
                        value={(remainingLeadFinds / 100) * 100}
                        className={clsx(
                          'h-2 w-full',
                          {
                            'bg-green-500': remainingLeadFinds > 50,
                            'bg-yellow-500': remainingLeadFinds > 20 && remainingLeadFinds <= 50,
                            'bg-red-500': remainingLeadFinds <= 20,
                          }
                        )}
                      />
                      <motion.div
                        className="mt-2 text-center font-bold text-2xl"
                        key={remainingLeadFinds}
                        initial={{ scale: 1.5, color: '#22c55e' }}
                        animate={{ scale: 1, color: '#000000' }}
                        transition={{ duration: 0.5 }}
                      >
                        {remainingLeadFinds}
                      </motion.div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remaining lead searches</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-md bg-white p-1 shadow-sm">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      className="font-medium text-sm"
                      variants={linkVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      Remaining Replies
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Progress
                        value={(remainingReplyGenerations / 100) * 100}
                        className={clsx(
                          'h-2 w-full',
                          {
                            'bg-green-500': remainingReplyGenerations > 50,
                            'bg-yellow-500': remainingReplyGenerations > 20 && remainingReplyGenerations <= 50,
                            'bg-red-500': remainingReplyGenerations <= 20,
                          }
                        )}
                      />
                      <motion.div
                        className="mt-2 text-center font-bold text-2xl"
                        key={remainingReplyGenerations}
                        initial={{ scale: 1.5, color: '#22c55e' }}
                        animate={{ scale: 1, color: '#000000' }}
                        transition={{ duration: 0.5 }}
                      >
                        {remainingReplyGenerations}
                      </motion.div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remaining reply generations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/pricing">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                      <Plus className="mr-2 h-4 w-4" /> Add More Credits
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}