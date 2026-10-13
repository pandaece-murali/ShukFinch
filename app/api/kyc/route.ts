import { NextResponse } from 'next/server';
import { cleanLead, ghlConfigured, pushToGhl } from '@/lib/ghl';
import { sendKycAlertEmail, sendClientConfirmationEmail, type AttachmentItem } from '@/lib/email';

export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false, error: 'invalid_form' }, { status: 400 });

  const get = (k: string) => String(fd.get(k) ?? '').trim();
  const email = get('email').toLowerCase();

  console.log('[kyc] Form submitted with Name:', get('name'), 'Phone:', get('phone'), 'Email:', email);

  // Collect text fields and file attachments from the form submission
  const fields: Record<string, string> = {};
  const attachments: AttachmentItem[] = [];

  for (const [key, value] of fd.entries()) {
    if (typeof value === 'string') {
      fields[key] = value;
    } else if (value && typeof value === 'object' && 'arrayBuffer' in value) {
      const file = value as File;
      if (file.size > 0) {
        try {
          const ab = await file.arrayBuffer();
          attachments.push({
            filename: file.name || key,
            content: Buffer.from(ab),
            contentType: file.type || 'application/octet-stream',
          });
        } catch (e) {
          console.warn('[kyc] Could not buffer file:', file.name, e);
        }
      }
    }
  }

  // Build application summary note for GoHighLevel CRM
  const kycNote = [
    `📋 Account Opening & KYC Application Summary:`,
    get('pan') ? `• PAN: ${get('pan').toUpperCase()}` : null,
    get('dob') ? `• Date of Birth: ${get('dob')} (${get('gender') || 'N/A'})` : null,
    get('address') ? `• Address: ${get('address')}, ${get('city') || ''} ${get('pin') ? 'PIN: ' + get('pin') : ''}` : null,
    get('occupation') ? `• Occupation: ${get('occupation')} | Income: ${get('income') || 'N/A'}` : null,
    get('interest') ? `• Interest: ${get('interest')}` : null,
    get('bankName') ? `• Bank: ${get('bankName')} (${get('accountType') || ''}) | A/C: ${get('accountNumber') || ''} | IFSC: ${get('ifsc') || ''}` : null,
    get('nomineeName') ? `• Nominee: ${get('nomineeName')} (${get('nomineeRel') || ''}${get('nomineeShare') ? ' - ' + get('nomineeShare') + '%' : ''})` : null,
    attachments.length > 0 ? `• Uploaded Documents (${attachments.length}): ${attachments.map((a) => a.filename).join(', ')} (forwarded via email)` : null,
  ].filter(Boolean).join('\n');

  const lead = cleanLead(
    {
      name: get('name'),
      phone: get('phone'),
      email,
      pan: get('pan'),
      dob: get('dob'),
      gender: get('gender'),
      address: get('address'),
      city: get('city'),
      pin: get('pin'),
      occupation: get('occupation'),
      income: get('income'),
      interest: get('interest'),
      bankName: get('bankName'),
      accountType: get('accountType'),
      accountNumber: get('accountNumber'),
      ifsc: get('ifsc'),
      nomineeName: get('nomineeName'),
      nomineeRel: get('nomineeRel'),
      kycStatus: 'KYC application submitted',
      noteBody: kycNote,
    },
    'kyc-application',
    ['KYC Application']
  );

  if (!lead) {
    console.error('==================================================');
    console.error('❌ [KYC SUBMISSION ERROR] Validation failed:');
    console.error(`   Name: "${get('name')}" | Phone: "${get('phone')}" | Email: "${email}"`);
    console.error('==================================================');
    return NextResponse.json(
      { ok: false, error: 'invalid_lead', message: 'Please ensure full name (min 2 characters), 10-digit mobile number, and a valid email are provided.' },
      { status: 422 }
    );
  }

  try {
    // 1. Push contact and application note to GoHighLevel CRM
    const isConfigured = ghlConfigured();
    let contactId = 'N/A';
    if (isConfigured) {
      try {
        const ghlRes = await pushToGhl(lead);
        if (!ghlRes.ok) {
          console.error('❌ [KYC GHL ERROR]:', ghlRes.error);
        } else {
          contactId = ghlRes.contactId || 'Success';
          console.log('[kyc] GHL contact created/updated successfully, ID:', contactId);
        }
      } catch (ghlErr) {
        console.error('❌ [KYC GHL ERROR]:', (ghlErr as Error).message);
      }
    } else {
      console.warn('[kyc] GHL not configured. Check GHL_API_TOKEN and GHL_LOCATION_ID in .env / .env.local');
    }

    // 2. Forward to external KYC provider if configured
    if (process.env.KYC_FORWARD_URL) {
      try {
        await fetch(process.env.KYC_FORWARD_URL, {
          method: 'POST',
          body: fd,
          headers: process.env.KYC_FORWARD_TOKEN
            ? { Authorization: `Bearer ${process.env.KYC_FORWARD_TOKEN}` }
            : undefined,
        });
      } catch (err) {
        console.error('❌ [KYC FORWARD ERROR]:', err);
      }
    }

    // 3. Email KYC submission & documents via Gmail SMTP
    let emailSent = false;
    try {
      emailSent = await sendKycAlertEmail(fields, attachments);
      if (email) {
        await sendClientConfirmationEmail(email, get('name') || 'Applicant');
      }
    } catch (mailErr) {
      console.error('❌ [KYC EMAIL ERROR]:', mailErr);
    }

    console.log('==================================================');
    console.log('✅ [KYC SUBMITTED SUCCESSFULLY]');
    console.log(`   Applicant: ${lead.name} | Phone: ${lead.phone} | Email: ${lead.email}`);
    console.log(`   CRM Contact ID: ${contactId}`);
    console.log(`   Attached Documents (${attachments.length}): ${attachments.map((a) => a.filename).join(', ') || 'None'}`);
    console.log(`   Alert Email: ${emailSent ? 'Sent to info@shukfinch.com' : 'Pending / Not sent'}`);
    console.log('==================================================');

    return NextResponse.json({ ok: true, message: 'Submitted successfully' });
  } catch (e) {
    console.error('==================================================');
    console.error('❌ [KYC SUBMISSION EXCEPTION]:', (e as Error).message);
    console.error('==================================================');
    return NextResponse.json({ ok: false, error: 'submission_failed', message: 'We could not submit right now. Please try again.' }, { status: 502 });
  }
}

