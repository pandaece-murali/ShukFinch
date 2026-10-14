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
  if (!d || typeof d !== 'object') {
    console.error('❌ [LEAD ERROR] Invalid request payload received.');
    return NextResponse.json({ ok: false, error: 'invalid_data', message: 'Invalid data format' }, { status: 400 });
  }
  if (d.website) return NextResponse.json({ ok: true }); // honeypot
  const form = String(d.form);
  if (!TAGS[form] || !d.consent) {
    console.error(`❌ [LEAD ERROR] Missing required consent or unknown form variant: "${form}"`);
    return NextResponse.json({ ok: false, error: 'missing_consent', message: 'Please accept the consent checkbox to continue.' }, { status: 400 });
  }

  const noteBody = d.message ? `💬 Contact Inquiry Message:\n${String(d.message).trim()}` : undefined;
  const lead = cleanLead({ ...d, noteBody }, form, [TAGS[form]]);
  if (!lead) {
    console.error(`❌ [LEAD ERROR] Validation failed for lead:`, { name: d.name, phone: d.phone, email: d.email });
    return NextResponse.json({
      ok: false,
      error: 'invalid_fields',
      message: 'Please provide a valid full name (min 2 characters), 10-digit mobile number, and valid email.',
    }, { status: 422 });
  }

  // Send email alert and push to GHL concurrently for near-instant form submission
  let contactId = 'N/A';
  await Promise.allSettled([
    sendLeadAlertEmail(lead).catch((emailErr) => {
      console.error('❌ [LEAD EMAIL ERROR]:', emailErr);
    }),
    ghlConfigured()
      ? pushToGhl(lead)
          .then((ghlRes) => {
            if (!ghlRes.ok) {
              console.error('❌ [LEAD GHL ERROR]:', ghlRes.error);
            } else {
              contactId = ghlRes.contactId || 'Created';
            }
          })
          .catch((e) => {
            console.error('❌ [LEAD GHL ERROR]:', (e as Error).message);
          })
      : Promise.resolve(),
  ]);

  console.log(`[lead] Submitted (${form}): ${lead.name} (${lead.phone}) - CRM Contact ID: ${contactId}`);

  return NextResponse.json({ ok: true, message: 'Submitted successfully' });
}
