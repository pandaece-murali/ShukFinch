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

  const lead = cleanLead(d, form, [TAGS[form]]);
  if (!lead) {
    console.error(`❌ [LEAD ERROR] Validation failed for lead:`, { name: d.name, phone: d.phone, email: d.email });
    return NextResponse.json({
      ok: false,
      error: 'invalid_fields',
      message: 'Please provide a valid full name (min 2 characters), 10-digit mobile number, and valid email.',
    }, { status: 422 });
  }

  // 1. Send immediate email alert via Gmail SMTP if configured
  try {
    await sendLeadAlertEmail(lead);
  } catch (emailErr) {
    console.error('❌ [LEAD EMAIL ERROR]:', emailErr);
  }

  // 2. Push to GoHighLevel if configured
  let contactId = 'N/A';
  if (ghlConfigured()) {
    try {
      const ghlRes = await pushToGhl(lead);
      if (!ghlRes.ok) {
        console.error('❌ [LEAD GHL ERROR]:', ghlRes.error);
      } else {
        contactId = ghlRes.contactId || 'Created';
      }
    } catch (e) {
      console.error('❌ [LEAD GHL ERROR]:', (e as Error).message);
    }
  } else {
    console.warn('[lead] GHL not configured. Check GHL_API_TOKEN and GHL_LOCATION_ID in .env');
  }

  console.log('--------------------------------------------------');
  console.log(`✅ [LEAD SUBMITTED SUCCESSFULLY]`);
  console.log(`   Form: ${form} | Name: ${lead.name} | Phone: ${lead.phone} | Email: ${lead.email || 'N/A'}`);
  console.log(`   CRM Contact ID: ${contactId}`);
  console.log('--------------------------------------------------');

  return NextResponse.json({ ok: true, message: 'Submitted successfully' });
}
