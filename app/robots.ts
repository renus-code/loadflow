/**
 * ======================================================================================
 * CONFIG: Web Crawler Directives (robots.txt)
 * ======================================================================================
 * Manages search engine crawler access to the application.
 * 
 * Features:
 * 1. SEO Optimization: Allows global crawling for public marketing pages.
 * 2. Security Shielding: Explicitly blocks crawlers from /api/ and /dashboard/ routes.
 * 3. Sitemap Link: Points crawlers to the dynamic XML sitemap for efficient indexing.
 * ======================================================================================
 */
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: 'https://loadflow.vercel.app/sitemap.xml',
  }
}
