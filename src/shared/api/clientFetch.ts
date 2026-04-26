/**
 * Client-side fetch uses same-origin proxy (`/api/tsum/*`) rewritten in
 * next.config.mjs to `https://api.tsum.ru/*` — avoids CORS on the browser.
 */
const CLIENT_API_BASE = '/api/tsum';

export async function clientApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T | null> {
  const url = path.startsWith('http') ? path : `${CLIENT_API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        'x-app-platform': 'must',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
