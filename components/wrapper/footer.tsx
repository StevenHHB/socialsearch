"use client"
import Link from 'next/link'

const footerLinks = {
  about: [
    { name: 'How it works', href: '/#how-it-works' },
    { name: 'Features', href: '/#features' },
    { name: 'Why SocialTargeter', href: '/#why-socialtargeter' },
  ],
  resources: [
    { name: 'Pricing', href: '/pricing' },
    { name: 'Free Tools', href: '/free-tools' },
    { name: 'Blogs', href: '/blogs' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/' },
    { name: 'Terms of Service', href: '/' },
    { name: 'Cookie Policy', href: '/' },
  ],
  connect: [
    { name: 'Twitter', href: 'https://twitter.com/socialtargeter' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/socialtargeter' },
    { name: 'Facebook', href: 'https://facebook.com/socialtargeter' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-base text-gray-400">
            © {new Date().getFullYear()} Social Targeter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
