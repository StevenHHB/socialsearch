import Provider from '@/app/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthWrapper from '@/components/wrapper/auth-wrapper'
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  metadataBase: new URL("https://usedotcom.com"),
  title: {
    default: 'useDotCom - Find Your Perfect .com Domain',
    template: `%s | useDotCom - AI-Powered Domain Search`
  },
  description: 'useDotCom offers AI-powered domain name generation to help you discover the perfect .com for your business. Streamline your domain search with advanced technology.',
  openGraph: {
    title: 'useDotCom - AI-Powered Domain Search Tool',
    description: 'Discover your perfect .com domain with useDotCom’s AI-powered suggestions. Quickly search, generate, and secure the ideal domain for your business with unparalleled efficiency.',
    siteName: 'useDotCom',
    url: 'https://usedotcom.com/',
    images: ['https://i.postimg.cc/Jz2drKXr/Screenshot-2024-10-01-at-16-30-49.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'useDotCom - Find Your Perfect .com Domain',
    description: 'Harness AI technology to generate and search for available .com domains on useDotCom. Lightning-fast search for domain names to fuel your brand’s success.',
    creator: '@stevenhhb',  // Update to your actual Twitter handle
    images: ['https://i.postimg.cc/Jz2drKXr/Screenshot-2024-10-01-at-16-30-49.png'],
  },
  keywords: ['AI domain search', 'domain generator', '.com domain finder', 'available domain names', 'business domains', 'domain name ideas'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="preload"
            href="https://utfs.io/f/31dba2ff-6c3b-4927-99cd-b928eaa54d5f-5w20ij.png"
            as="image"
          />
          <link
            rel="preload"
            href="https://utfs.io/f/69a12ab1-4d57-4913-90f9-38c6aca6c373-1txg2.png"
            as="image"
          />
        </head>
        
        <body className={GeistSans.className}>
          <Provider>
            <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
            </TooltipProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </AuthWrapper>
  )
}