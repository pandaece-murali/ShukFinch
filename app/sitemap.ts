import type { MetadataRoute } from 'next';
import { PAGES } from '@/lib/pages';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...PAGES.map((p) => ({
      url: `${SITE.url}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: (p.slug === 'account-opening' || p.slug === 'equity' || p.slug === 'ipos'
        ? 'daily'
        : 'weekly') as 'daily' | 'weekly',
      priority: p.slug === 'account-opening' ? 0.9 : 0.8,
    })),
  ];

  return routes;
}
