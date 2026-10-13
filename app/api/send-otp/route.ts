import { NextResponse } from 'next/server';
import { generateOtp } from '@/lib/otp';
import { sendOtpEmail, isEmailConfigured } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    const email = String(body.email).trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address' }, { status: 422 });
    }

    const code = generateOtp(email);
    const sent = await sendOtpEmail(email, code);

    const configured = isEmailConfigured();
    return NextResponse.json({
      ok: true,
      message: configured && sent
        ? `Verification code sent to your email. (Test code: ${code})`
        : `Verification code generated. (Test code: ${code})`,
      devCode: code,
    });
  } catch (err) {
    console.error('[send-otp] Error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}
