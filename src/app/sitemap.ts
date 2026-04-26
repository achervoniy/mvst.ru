import type { MetadataRoute } from 'next';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

const BASE = 'https://mvst.ru';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contacts`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/catalog/women`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/catalog/men`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/collection/${LOOK_SLUGS.all}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/collection/${LOOK_SLUGS.women}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/collection/${LOOK_SLUGS.men}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
