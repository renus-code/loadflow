/**
 * ======================================================================================
 * CONFIG: Dynamic XML Sitemap (sitemap.xml)
 * ======================================================================================
 * Generates an automated, dynamic sitemap for search engine ingestion.
 * 
 * Features:
 * 1. Priority Matrix: Assigns crawl priorities (e.g., Homepage: 1.0, Registration: 0.8).
 * 2. Frequency Hints: Informs crawlers of expected content change rates.
 * 3. Dynamic Hydration: Automatically generates the latest temporal timestamps.
 * ======================================================================================
 */
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://loadflow.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
