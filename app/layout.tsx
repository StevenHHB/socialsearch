import Provider from '@/app/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthWrapper from '@/components/wrapper/auth-wrapper'
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'
import { TooltipProvider } from "@/components/ui/tooltip"
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL("https://socialtargeter.com"),
  title: {
    default: 'SocialTargeter - Find Customers on Social Media in Seconds',
    template: `%s | SocialTargeter - Social Media Lead Generation `
  },
  description: 'SocialTargeter offers AI-powered lead generation and personalized engagement for social media. Streamline your lead generation process with advanced technology.',
  openGraph: {
    title: 'SocialTargeter - Find Customers on Social Medai in Seconds',
    description: 'Social Media Lead Generation.Discover and engage potential leads on social media with SocialTargeter and its AI-powered suggestions. Quickly find, analyze, and respond to leads for your business with unparalleled efficiency.',
    siteName: 'SocialTargeter',
    url: 'https://SocialTargeter.com/',
    images: ['https://socialtargeter.com/images/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialTargeter - Find Customers on Social Medai in Seconds',
    description: 'Social Media Lead Generation.Harness AI technology to find and engage with potential leads on social media platforms. Boost your lead generation success with SocialTargeter.',
    creator: '@socialtargeter',  // Update to your actual Twitter handle
    images: ['https://socialtargeter.com/images/og.png'],
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
            href="https://www.socialtargeter.com/images/og.png"
            as="image"
          />
          <link
            rel="preload"
            href="https://www.socialtargeter.com/images/og.png"
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
          <GoogleAnalytics GA_MEASUREMENT_ID="G-K7S0X5WG07" />
        </body>
      </html>
    </AuthWrapper>
  )
}
