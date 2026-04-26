import type { V1CatalogProduct } from './types';

function resolveApiBase(): string | null {
  const raw = process.env.SSR_API_DOMAIN?.trim();
  if (!raw) {
    console.error('[fetchProductById] Не задан SSR_API_DOMAIN');
    return null;
  }
  return raw.replace(/\/$/, '');
}

/**
 * Загрузка карточки товара с API TSUM (тот же хост, что и для остальных запросов).
 */
export async function fetchProductById(id: string): Promise<V1CatalogProduct | null> {
  const base = resolveApiBase();
  if (!base) {
    return null;
  }

  const url = `${base}/v1/catalog/product/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'x-app-platform': 'must',
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.warn('[fetchProductById]', res.status, url);
      return null;
    }

    return (await res.json()) as V1CatalogProduct;
  } catch (e) {
    console.error('[fetchProductById]', e);
    return null;
  }
}
