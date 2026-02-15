import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

/**
 * Robots.txt configuration for search engine crawlers
 * 
 * NEXT_PUBLIC_APP_URL is required in production, optional in development.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

const BASE_URL = env.NEXT_PUBLIC_APP_URL ?? 'https://example.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',  // Protected user routes
          '/api/',      // API endpoints
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
