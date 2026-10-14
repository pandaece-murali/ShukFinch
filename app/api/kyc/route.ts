import { NextResponse } from 'next/server';
import { cleanLead, ghlConfigured, pushToGhl } from '@/lib/ghl';
import { sendKycAlertEmail, sendClientConfirmationEmail, type AttachmentItem } from '@/lib/email';

export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false, error: 'invalid_form' }, { status: 400 });

  const get = (k: string) => String(fd.get(k) ?? '').trim();
  const email = get('email').toLowerCase();

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

  // Build comprehensive application summary note for GoHighLevel CRM (matching the email alert)
  const kycNote = [
    `📋 KYC APPLICATION DETAILS`,
    `----------------------------------------`,
    `Full Name: ${get('name')}`,
    `Mobile Phone: ${get('phone')}`,
    `Email: ${email || 'N/A'}`,
    get('fatherName') ? `Father's / Spouse's Name: ${get('fatherName')}` : null,
    get('dob') ? `Date of Birth: ${get('dob')}` : null,
    get('gender') ? `Gender: ${get('gender')}` : null,
    get('pan') ? `PAN Number: ${get('pan').toUpperCase()}` : null,
    get('addressProof') ? `Address Proof Type: ${get('addressProof')}` : null,
    get('address') ? `Current Address: ${get('address')}` : null,
    get('city') ? `City: ${get('city')}` : null,
    get('pin') ? `PIN Code: ${get('pin')}` : null,
    get('occupation') ? `Occupation: ${get('occupation')}` : null,
    get('income') ? `Annual Income: ${get('income')}` : null,
    get('interest') ? `Interested Service: ${get('interest')}` : null,
    get('bankName') ? `Bank Name: ${get('bankName')}` : null,
    get('accountType') ? `Account Type: ${get('accountType')}` : null,
    get('accountNumber') ? `Account Number: ${get('accountNumber')}` : null,
    get('ifsc') ? `IFSC Code: ${get('ifsc').toUpperCase()}` : null,
    get('nomineeName') ? `Nominee Name: ${get('nomineeName')}` : null,
    get('nomineeRel') ? `Nominee Relationship: ${get('nomineeRel')}` : null,
    get('nomineeShare') ? `Nominee Share: ${get('nomineeShare')}%` : null,
    attachments.length > 0 ? `Uploaded Documents (${attachments.length}): ${attachments.map((a) => a.filename).join(', ')} (forwarded via email)` : 'Documents: None uploaded',
    `Submitted At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
  ].filter(Boolean).join('\n');

  const lead = cleanLead(
    {
      name: get('name'),
      fatherName: get('fatherName'),
      phone: get('phone'),
      email,
      pan: get('pan'),
      dob: get('dob'),
      gender: get('gender'),
      addressProof: get('addressProof'),
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
    console.warn(`[kyc] Validation failed: Name: "${get('name')}" | Phone: "${get('phone')}" | Email: "${email}"`);
    return NextResponse.json(
      { ok: false, error: 'invalid_lead', message: 'Please ensure full name (min 2 characters), 10-digit mobile number, and a valid email are provided.' },
      { status: 422 }
    );
  }

  try {
    const isConfigured = ghlConfigured();
    let contactId = 'N/A';
    let emailSent = false;

    // Run CRM push, external forwarding, and email delivery concurrently for maximum speed
    await Promise.allSettled([
      // 1. GoHighLevel CRM Contact & Note upsert
      isConfigured
        ? pushToGhl(lead)
            .then((ghlRes) => {
              if (!ghlRes.ok) {
                console.error('❌ [KYC GHL ERROR]:', ghlRes.error);
              } else {
                contactId = ghlRes.contactId || 'Success';
              }
            })
            .catch((ghlErr) => {
              console.error('❌ [KYC GHL ERROR]:', (ghlErr as Error).message);
            })
        : Promise.resolve(),

      // 2. Forward to external KYC provider if configured
      process.env.KYC_FORWARD_URL
        ? fetch(process.env.KYC_FORWARD_URL, {
            method: 'POST',
            body: fd,
            headers: process.env.KYC_FORWARD_TOKEN
              ? { Authorization: `Bearer ${process.env.KYC_FORWARD_TOKEN}` }
              : undefined,
            signal: AbortSignal.timeout(10000),
          }).catch((err) => {
            console.error('❌ [KYC FORWARD ERROR]:', err);
          })
        : Promise.resolve(),

      // 3. Email KYC submission & documents to Admin via Gmail SMTP
      sendKycAlertEmail(fields, attachments)
        .then((sent) => {
          emailSent = sent;
        })
        .catch((mailErr) => {
          console.error('❌ [KYC ADMIN EMAIL ERROR]:', mailErr);
        }),

      // 4. Send client confirmation email
      email
        ? sendClientConfirmationEmail(email, get('name') || 'Applicant').catch((clientErr) => {
            console.error('❌ [KYC CLIENT EMAIL ERROR]:', clientErr);
          })
        : Promise.resolve(),
    ]);

    console.log(`[kyc] Application submitted: ${lead.name} (${lead.phone}) - CRM Contact ID: ${contactId} | Email: ${emailSent ? 'sent' : 'pending'}`);

    return NextResponse.json({ ok: true, message: 'Submitted successfully' });
  } catch (e) {
    console.error('[kyc] Submission exception:', (e as Error).message);
    return NextResponse.json({ ok: false, error: 'submission_failed', message: 'We could not submit right now. Please try again.' }, { status: 502 });
  }
}

