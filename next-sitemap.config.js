module.exports = {
  siteUrl: 'https://socialtargeter.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/dashboard', '/dashboard/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://socialtargeter.com/server-sitemap.xml', // we'll create this for dynamic routes
    ],
  },
};

