import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blogs/*',
          '/api/sitemap/*',
          '/api/rss'
        ],
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/*?*', // Block URLs with query parameters
          '/private/*',
          '/*.json$', // Block direct JSON access
          '/*.xml$' // Block direct XML access except sitemaps
        ]
      },
      {
        userAgent: 'GPTBot',
        allow: ['/blogs/*'],
        disallow: ['/*']
      }
    ],
    sitemap: `${baseUrl}/api/sitemap/index`,
    host: baseUrl,
  }
}
