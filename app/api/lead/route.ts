import { NextResponse } from 'next/server';
import { cleanLead, ghlConfigured, pushToGhl } from '@/lib/ghl';

const TAGS: Record<string, string> = { hero: 'Home Quick Apply', callback: 'Callback Request', contact: 'Contact Form' };

export async function POST(req: Request) {
  const d = await req.json().catch(() => null);
  if (!d || typeof d !== 'object') return NextResponse.json({ ok: false }, { status: 400 });
  if (d.website) return NextResponse.json({ ok: true }); // honeypot: bots fill this hidden field
  const form = String(d.form);
  if (!TAGS[form] || !d.consent) return NextResponse.json({ ok: false }, { status: 400 });
  const lead = cleanLead(d, form, [TAGS[form]]);
  if (!lead) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 });
  if (!ghlConfigured()) {
    if (process.env.NODE_ENV === 'production') return NextResponse.json({ ok: false }, { status: 500 });
    console.warn('[lead] GHL not configured, lead not sent:', lead.form, lead.name);
    return NextResponse.json({ ok: true, dev: true });
  }
  try { await pushToGhl(lead); return NextResponse.json({ ok: true }); }
  catch (e) { console.error('[lead] GHL error', (e as Error).message); return NextResponse.json({ ok: false }, { status: 502 }); }
}
