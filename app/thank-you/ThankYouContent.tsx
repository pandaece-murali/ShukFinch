'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SITE } from '@/lib/site';

export function ThankYouContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'lead';

  const isKyc = type === 'kyc' || type === 'kyc-application';
  const isCallback = type === 'callback';
  const isContact = type === 'contact';

  const title = isKyc
    ? 'KYC Application Received Successfully!'
    : isCallback
    ? 'Callback Request Scheduled!'
    : isContact
    ? 'Message Received Successfully!'
    : 'Details Submitted Successfully!';

  const description = isKyc
    ? 'Thank you for choosing Shukfinch. Our verification desk on Dalal Street has received your details and documents. Our compliance team is currently reviewing your application.'
    : isCallback
    ? 'Thank you for requesting a callback. A dedicated equity specialist from our desk will call you back at your requested time slot.'
    : isContact
    ? 'Thank you for getting in touch with Shukfinch. Our team will review your inquiry and respond on the next working day.'
    : 'Thank you for your interest in Shukfinch. A personal broker from our Mumbai trading desk will connect with you on your mobile number to help complete your setup.';

  return (
    <div className="ty-wrap">
      <div className="ty-card">
        {/* Animated Success Badge */}
        <div className="ty-icon-wrap">
          <div className="ty-icon-ring" />
          <div className="ty-icon">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00C833"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <div className="ty-badge-pill">
          ✓ Application Recorded · Desk Review in Progress
        </div>

        <h1 className="ty-title">{title}</h1>
        <p className="ty-desc">{description}</p>

        {/* Process Steps */}
        <div className="ty-steps">
          <div className="ty-step">
            <div className="ty-step-num">1</div>
            <div>
              <h4>Application Verification</h4>
              <p>Our SEBI compliance desk reviews your submitted application and KYC details.</p>
            </div>
          </div>
          <div className="ty-step">
            <div className="ty-step-num">2</div>
            <div>
              <h4>Personal Desk Contact</h4>
              <p>An onboarding executive will call your registered number for verification.</p>
            </div>
          </div>
          <div className="ty-step">
            <div className="ty-step-num">3</div>
            <div>
              <h4>Account Activation</h4>
              <p>Your BSE trading & demat account will be activated with login credentials sent to your email.</p>
            </div>
          </div>
        </div>

        {/* Direct Help Desk Box */}
        <div className="ty-help-box">
          <div className="ty-help-info">
            <span className="ty-help-label">Need immediate assistance or have questions?</span>
            <strong>Direct Desk: <a href={SITE.tel}>{SITE.phone} / 86</a></strong>
            <p>Our onboarding specialists are available Mon – Fri, 9:00 AM – 6:00 PM IST</p>
          </div>
          <a href={SITE.tel} className="btn b1">
            Call Desk Now
          </a>
        </div>

        {/* Action Buttons */}
        <div className="ty-actions">
          <Link href="/" className="btn bblue">
            Return to Homepage
          </Link>
          <Link href="/equity" className="btn b2" style={{ color: 'var(--ink)' }}>
            Explore Equity & Services
          </Link>
          <Link href="/about" className="btn b2" style={{ color: 'var(--ink)' }}>
            About Shukfinch
          </Link>
        </div>
      </div>
    </div>
  );
}
