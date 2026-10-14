import { NextResponse } from 'next/server';
import { getEmailEnv, getTransporter, getAdminRecipient } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secretKey = url.searchParams.get('key');
  // Security check - allow with ?key=test123 or in development
  if (process.env.NODE_ENV === 'production' && secretKey !== 'test123') {
    return NextResponse.json({
      hint: 'To run SMTP diagnostic on live Vercel, visit /api/diagnostic-email?key=test123',
    }, { status: 403 });
  }

  const rawUser = getEmailEnv('GMAIL_USER');
  const rawPass = getEmailEnv('GMAIL_APP_PASSWORD');
  const recipient = getAdminRecipient();

  const userMasked = rawUser ? `${rawUser.slice(0, 2)}***@${rawUser.split('@')[1] || ''}` : 'NOT_SET';
  const cleanPass = rawPass ? rawPass.replace(/^['"](.*)['"]$/, '$1').replace(/\s+/g, '') : '';

  const diagnosticInfo = {
    gmailUserSet: Boolean(rawUser),
    gmailUserMasked: userMasked,
    gmailAppPasswordSet: Boolean(rawPass),
    cleanPasswordLength: cleanPass.length,
    isStandard16Chars: cleanPass.length === 16,
    recipient,
    nodeEnv: process.env.NODE_ENV,
  };

  const transporter = getTransporter();
  if (!transporter) {
    return NextResponse.json({
      ok: false,
      error: 'Transporter could not be created because GMAIL_USER or GMAIL_APP_PASSWORD is missing in environment.',
      diagnosticInfo,
    }, { status: 500 });
  }

  // 1. Verify SMTP connection & credentials
  try {
    await transporter.verify();
  } catch (verifyErr: any) {
    return NextResponse.json({
      ok: false,
      step: 'transporter.verify() failed',
      error: verifyErr?.message || String(verifyErr),
      code: verifyErr?.code,
      response: verifyErr?.response,
      diagnosticInfo,
    }, { status: 502 });
  }

  // 2. Send live diagnostic test email
  try {
    const info = await transporter.sendMail({
      from: `"Shukfinch Diagnostic Desk" <${rawUser}>`,
      to: recipient,
      subject: `[Diagnostic Test] Shukfinch Live SMTP Test (${new Date().toISOString()})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #1976FF; border-radius: 8px;">
          <h2 style="color: #0A1D37;">✅ Shukfinch SMTP Test Successful!</h2>
          <p>This email confirms that your Gmail App Password and SMTP connection on Vercel are working perfectly.</p>
          <p><b>Timestamp:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          <p><b>Recipient:</b> ${recipient}</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: `Diagnostic email successfully sent to ${recipient}`,
      messageId: info.messageId,
      response: info.response,
      diagnosticInfo,
    });
  } catch (sendErr: any) {
    return NextResponse.json({
      ok: false,
      step: 'transporter.sendMail() failed',
      error: sendErr?.message || String(sendErr),
      code: sendErr?.code,
      response: sendErr?.response,
      diagnosticInfo,
    }, { status: 502 });
  }
}
