import { NextResponse } from 'next/server';

const CRM_URL = process.env.CRM_URL ?? 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${CRM_URL}/api/public/boutiques`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({ boutiques: [] }));
    return NextResponse.json(data, {
      status: res.ok ? 200 : 502,
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' },
    });
  } catch (e) {
    console.error('[boutiques proxy] error', e);
    return NextResponse.json({ boutiques: [], error: 'network' }, { status: 503 });
  }
}
