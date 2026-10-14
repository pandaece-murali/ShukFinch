import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ThankYouContent } from './ThankYouContent';
import { SITE, RISK } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Thank You | Application Submitted',
  description: 'Thank you for contacting Shukfinch. Your details have been received successfully.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <>
      <section className="ty-sec">
        <div className="w">
          <Suspense fallback={<div className="ty-loading">Loading confirmation...</div>}>
            <ThankYouContent />
          </Suspense>
        </div>
      </section>

      <div className="w" style={{ paddingBottom: 40 }}>
        <p className="rk" style={{ textAlign: 'center' }}>
          {RISK} Shukfinch does not promise or guarantee returns. SEBI Reg. {SITE.sebi} · BSE Member {SITE.bse}.
        </p>
      </div>
    </>
  );
}
