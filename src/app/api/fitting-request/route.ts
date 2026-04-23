import { NextResponse, type NextRequest } from 'next/server';

const CRM_URL = process.env.CRM_URL ?? 'http://localhost:3001';
const CRM_INGEST_KEY = process.env.CRM_INGEST_KEY ?? '';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  try {
    const res = await fetch(`${CRM_URL}/api/public/fitting-requests`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-crm-api-key': CRM_INGEST_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[fitting-request] CRM error:', res.status, data);
      return NextResponse.json({ error: 'CRM error', detail: data }, { status: 502 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error('[fitting-request] network error:', e);
    return NextResponse.json({ error: 'Network error' }, { status: 503 });
  }
}
