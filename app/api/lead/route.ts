import { NextResponse } from 'next/server';
import { cleanLead, ghlConfigured, pushToGhl } from '@/lib/ghl';
import { sendLeadAlertEmail } from '@/lib/email';

const TAGS: Record<string, string> = {
  hero: 'Home Quick Apply',
  callback: 'Callback Request',
  contact: 'Contact Form',
};

export async function POST(req: Request) {
  const d = await req.json().catch(() => null);
  if (!d || typeof d !== 'object') return NextResponse.json({ ok: false, error: 'invalid_data' }, { status: 400 });
  if (d.website) return NextResponse.json({ ok: true }); // honeypot
  const form = String(d.form);
  if (!TAGS[form] || !d.consent) return NextResponse.json({ ok: false, error: 'missing_consent' }, { status: 400 });

  const lead = cleanLead(d, form, [TAGS[form]]);
  if (!lead) return NextResponse.json({ ok: false, error: 'invalid_fields' }, { status: 422 });

  // 1. Send immediate email alert via Gmail SMTP if configured
  try {
    await sendLeadAlertEmail(lead);
  } catch (emailErr) {
    console.error('[lead] Email send error:', emailErr);
  }

  // 2. Push to GoHighLevel if configured
  if (ghlConfigured()) {
    try {
      await pushToGhl(lead);
    } catch (e) {
      console.error('[lead] GHL error:', (e as Error).message);
    }
  } else {
    console.warn('[lead] GHL not configured, lead captured locally/email:', lead.form, lead.name);
  }

  return NextResponse.json({ ok: true });
}
