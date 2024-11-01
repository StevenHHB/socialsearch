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
          '/sitemap.xml'
        ],
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/*?*', // Block URLs with query parameters
          '/private/*',
          '/*.json$' // Block direct JSON access
        ]
      },
      {
        userAgent: 'GPTBot',
        allow: ['/blogs/*'],
        disallow: ['/*']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
