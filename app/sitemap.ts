import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

/**
 * Dynamic sitemap generation for SEO
 * 
 * NEXT_PUBLIC_APP_URL is required in production, optional in development.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

const BASE_URL = env.NEXT_PUBLIC_APP_URL ?? 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Add more static routes as needed
    // {
    //   url: `${BASE_URL}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];

  // Dynamic routes from database
  // Example: Fetch published posts, products, etc.
  // const posts = await db.select().from(posts).where(eq(posts.published, true));
  // const dynamicRoutes = posts.map((post) => ({
  //   url: `${BASE_URL}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));

  return [
    ...staticRoutes,
    // ...dynamicRoutes,
  ];
}
