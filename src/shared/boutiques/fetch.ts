import type { Boutique } from './data';

const CRM_URL = process.env.CRM_URL ?? process.env.SSR_API_DOMAIN ?? 'http://localhost:3001';

export async function fetchBoutiquesServer(): Promise<Boutique[]> {
  try {
    // Не кэшируем — правки в админке должны появляться на сайте сразу.
    const res = await fetch(`${CRM_URL}/api/public/boutiques`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as { boutiques: Boutique[] };
    return data.boutiques ?? [];
  } catch (e) {
    console.error('[boutiques] fetch failed', e);
    return [];
  }
}
