// Серверная обёртка над api.tsum.ru. Импортировать ТОЛЬКО внутри createServerFn.
import type { Gender } from "./types";

export const MVST_BRAND_ID = 13037770;

export const GENDER_CATEGORY: Record<Gender, string> = {
  women: "18368",
  men: "18327",
};

const TSUM_BASE = "https://api.tsum.ru/v2";

export async function tsumFetch<T>(
  path: string,
  body?: Record<string, unknown> | null,
  opts?: { method?: "GET" | "POST"; baseUrl?: string },
): Promise<T> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 15_000);
  const method = opts?.method ?? (body ? "POST" : "GET");
  const base = opts?.baseUrl ?? TSUM_BASE;
  try {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; MVST-frontend/1.0)",
        Referer: "https://mvst.ru/",
        Origin: "https://mvst.ru",
      },
      body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`tsum ${path} ${res.status}: ${text.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
