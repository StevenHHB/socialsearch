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
  metadataBase: new URL("https://socialtargeter.com"),
  title: {
    default: 'SocialTargeter - Find Customers on Social Medai in Seconds',
    template: `%s | SocialTargeter - Social Media Lead Generation `
  },
  description: 'SocialTargeter offers AI-powered lead generation and personalized engagement for social media. Streamline your lead generation process with advanced technology.',
  openGraph: {
    title: 'SocialTargeter - Find Customers on Social Medai in Seconds',
    description: 'Social Media Lead Generation.Discover and engage potential leads on social media with SocialTargeter and its AI-powered suggestions. Quickly find, analyze, and respond to leads for your business with unparalleled efficiency.',
    siteName: 'SocialTargeter',
    url: 'https://SocialTargeter.com/',
    images: ['https://i.postimg.cc/kXP1FR5n/Screenshot-2024-10-05-at-05-00-57.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialTargeter - Find Customers on Social Medai in Seconds',
    description: 'Social Media Lead Generation.Harness AI technology to find and engage with potential leads on social media platforms. Boost your lead generation success with SocialTargeter.',
    creator: '@socialtargeter',  // Update to your actual Twitter handle
    images: ['https://i.postimg.cc/kXP1FR5n/Screenshot-2024-10-05-at-05-00-57.png'],
  },
  keywords: ['AI lead generation', 'social media leads', 'personalized engagement', 'lead finder', 'business leads', 'social media marketing'],
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