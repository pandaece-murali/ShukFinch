import { NextResponse } from 'next/server';
import { cleanLead, ghlConfigured, pushToGhl } from '@/lib/ghl';
import { sendKycAlertEmail, sendClientConfirmationEmail, type AttachmentItem } from '@/lib/email';
import { verifyOtp } from '@/lib/otp';

export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false, error: 'invalid_form' }, { status: 400 });
  if (fd.get('website')) return NextResponse.json({ ok: true }); // Honeypot trap

  const get = (k: string) => String(fd.get(k) ?? '').trim();
  const email = get('email').toLowerCase();
  const emailOtp = get('emailOtp');

  // Verify Email OTP if provided and in cache
  if (email && emailOtp) {
    const valid = verifyOtp(email, emailOtp);
    // If invalid and email service is configured, return error
    if (!valid && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json({ ok: false, error: 'invalid_otp', message: 'Invalid or expired Email OTP' }, { status: 400 });
    }
  }

  const lead = cleanLead(
    {
      name: get('name'),
      phone: get('phone'),
      email,
      interest: get('interest'),
      city: get('city'),
      occupation: get('occupation'),
      kycStatus: 'KYC application submitted',
    },
    'kyc-application',
    ['KYC Application']
  );

  if (!lead) return NextResponse.json({ ok: false, error: 'invalid_lead' }, { status: 422 });

  // Collect text fields for KYC alert email
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

  try {
    // 1. Forward to external KYC provider if configured
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
        console.error('[kyc] Forward URL error:', err);
      }
    }

    // 2. Email KYC submission & documents via Gmail SMTP
    try {
      await sendKycAlertEmail(fields, attachments);
      if (email) {
        await sendClientConfirmationEmail(email, get('name') || 'Applicant');
      }
    } catch (mailErr) {
      console.error('[kyc] Email alert error:', mailErr);
    }

    // 3. Push to GoHighLevel if configured
    if (ghlConfigured()) {
      try {
        await pushToGhl(lead);
      } catch (ghlErr) {
        console.error('[kyc] GHL push error:', ghlErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[kyc] submission error', (e as Error).message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
