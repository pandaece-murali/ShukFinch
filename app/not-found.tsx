import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, RISK } from '@/lib/site';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Shukfinch Stock Broking',
  description: 'The page you are looking for does not exist or has been moved. Explore Shukfinch stock broking services on Dalal Street, Mumbai.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <section className="nf-sec">
        <div className="w">
          <div className="nf-card">
            {/* Brand Blue Hero SVG */}
            <div className="nf-hero-icon" aria-hidden="true">
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <div className="nf-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>404 · Page Not Found</span>
            </div>

            <h1 className="nf-title">Looks like this trade went off chart.</h1>
            <p className="nf-desc">
              The page you are looking for doesn&apos;t exist, was moved, or the URL might be mistyped.
              Let&apos;s get you back on track with your investments.
            </p>

            {/* Popular Destinations with Brand Blue SVGs */}
            <div className="nf-links-grid">
              <Link href="/account-opening" className="nf-link-item">
                <div className="nf-link-icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <strong>Open Demat Account</strong>
                  <span>Complete digital KYC in 10 minutes</span>
                </div>
              </Link>

              <Link href="/equity" className="nf-link-item">
                <div className="nf-link-icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <polyline points="4 9 9 4 14 8 20 2" />
                  </svg>
                </div>
                <div>
                  <strong>Equity &amp; Trading</strong>
                  <span>Delivery and intraday cash market trading</span>
                </div>
              </Link>

              <Link href="/research" className="nf-link-item">
                <div className="nf-link-icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <div>
                  <strong>Market Research</strong>
                  <span>Fundamental &amp; technical market insights</span>
                </div>
              </Link>

              <Link href="/personal-support" className="nf-link-item">
                <div className="nf-link-icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <strong>Personal Support</strong>
                  <span>Speak directly with our Dalal Street desk</span>
                </div>
              </Link>
            </div>

            {/* Trading Desk Contact Notice */}
            <div className="nf-desk">
              <p>
                Need immediate help? Call our trading desk directly at{' '}
                <a href={SITE.tel}><b>{SITE.phone} / 86</b></a> or email{' '}
                <a href={`mailto:${SITE.email}`}><b>{SITE.email}</b></a>.
              </p>
            </div>

            {/* Action CTA Buttons */}
            <div className="nf-actions">
              <Link href="/" className="btn b1">
                Return to Homepage
              </Link>
              <Link href="/services" className="btn b2" style={{ color: 'var(--ink)' }}>
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="w" style={{ paddingBottom: 40 }}>
        <p className="rk" style={{ textAlign: 'center' }}>
          {RISK} Shukfinch · SEBI Reg. {SITE.sebi} · BSE Member {SITE.bse} · Office on Dalal Street, Mumbai.
        </p>
      </div>
    </>
  );
}
