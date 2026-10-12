import { NextResponse } from 'next/server';
import { cleanLead, ghlConfigured, pushToGhl } from '@/lib/ghl';

// The KYC application has two parts:
//  1. Lead details (name, phone, email, interest, city) -> GoHighLevel.
//  2. Sensitive KYC data (PAN, DOB, bank, nominee, OTPs, documents) -> ONLY your KYC backend/provider
//     via KYC_FORWARD_URL. It is never sent to GHL. If KYC_FORWARD_URL is empty, it is discarded.
export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false }, { status: 400 });
  if (fd.get('website')) return NextResponse.json({ ok: true });
  const get = (k: string) => String(fd.get(k) ?? '');
  const lead = cleanLead({ name: get('name'), phone: get('phone'), email: get('email'), interest: get('interest'), city: get('city'), occupation: get('occupation'), kycStatus: 'KYC application submitted' }, 'kyc-application', ['KYC Application']);
  if (!lead) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 });
  try {
    if (process.env.KYC_FORWARD_URL) {
      const r = await fetch(process.env.KYC_FORWARD_URL, {
        method: 'POST', body: fd,
        headers: process.env.KYC_FORWARD_TOKEN ? { Authorization: `Bearer ${process.env.KYC_FORWARD_TOKEN}` } : undefined,
      });
      if (!r.ok) throw new Error('KYC forward ' + r.status);
    }
    if (ghlConfigured()) await pushToGhl(lead);
    else if (process.env.NODE_ENV === 'production') throw new Error('GHL not configured');
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[kyc] error', (e as Error).message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
