import type { Metadata, Viewport } from 'next';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './globals.css';
import Script from 'next/script';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Shukfinch | Smart Finance. Better Future.',
    template: '%s | Shukfinch',
  },
  description:
    'SEBI registered stock broker on Dalal Street, Mumbai. Equity, IPOs and ETFs with 50+ years of market experience and personal broker support.',
  keywords: [
    'Shukfinch',
    'Stock Broker Mumbai',
    'SEBI Registered Broker',
    'Dalal Street Broker',
    'Demat Account',
    'Trading Account',
    'Equity Trading',
    'IPO Application',
    'ETF Investments',
  ],
  authors: [{ name: 'Shukfinch' }],
  creator: 'Shukfinch',
  publisher: 'Shukfinch',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE.url,
    siteName: SITE.name,
    title: 'Shukfinch | Smart Finance. Better Future.',
    description:
      'SEBI registered stock broker on Dalal Street, Mumbai. Equity, IPOs and ETFs with 50+ years of market experience and personal broker support.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shukfinch | Smart Finance. Better Future.',
    description:
      'SEBI registered stock broker on Dalal Street, Mumbai. Equity, IPOs and ETFs with 50+ years of market experience and personal broker support.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A1D37',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          src="https://crm.shukfinch.com/js/external-tracking.js"
          data-tracking-id="tk_24c2d6991c6f46d38381d73c9331e236"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
