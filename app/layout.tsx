import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});
import Script from 'next/script';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollEffects } from '@/components/ScrollEffects';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Shukfinch | SEBI Registered Stock Broker on Dalal Street, Mumbai',
    template: '%s | Shukfinch Stock Broking',
  },
  description:
    'Shukfinch is a SEBI registered stock broker (INZ000252338) and BSE member (0433) on Dalal Street, Mumbai. Open Demat & Trading account online. Equity, IPOs, ETFs with 50+ years of market experience and personal broker support.',
  keywords: [
    'Shukfinch',
    'Stock Broker Mumbai',
    'SEBI Registered Broker Mumbai',
    'Dalal Street Stock Broker',
    'BSE Member Broker Mumbai',
    'Demat Account Opening Mumbai',
    'Trading Account Mumbai',
    'Equity Trading India',
    'IPO Application BSE',
    'ETF Investments India',
    'Fort Mumbai Stock Broker',
    'PJ Tower Dalal Street',
    'Personal Stock Broker Support',
    'Digital KYC Demat Account',
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE.url,
    siteName: SITE.name,
    title: 'Shukfinch | SEBI Registered Stock Broker on Dalal Street, Mumbai',
    description:
      'SEBI registered stock broker (INZ000252338) and BSE member (0433) on Dalal Street, Mumbai. Demat accounts, Equity trading, IPOs and ETFs with 50+ years of market trust.',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Shukfinch Stock Broking Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shukfinch | SEBI Registered Stock Broker on Dalal Street, Mumbai',
    description:
      'SEBI registered stock broker (INZ000252338) and BSE member (0433) on Dalal Street, Mumbai. 50+ years of market trust, equity trading, IPOs and personal broker support.',
    images: ['/icon.png'],
  },
  other: {
    'geo.region': 'IN-MH',
    'geo.placename': 'Mumbai, Dalal Street',
    'geo.position': '18.9298;72.8335',
    ICBM: '18.9298, 72.8335',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A1D37',
  colorScheme: 'light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['FinancialService', 'LocalBusiness'],
      '@id': 'https://shukfinch.com/#organization',
      name: 'Shukfinch',
      alternateName: ['Shukfinch Stock Broking', 'M.D. Shukla Share & Securities Pvt Ltd'],
      legalName: 'M.D. Shukla Share & Securities Pvt Ltd',
      url: 'https://shukfinch.com',
      logo: 'https://shukfinch.com/icon.png',
      image: 'https://shukfinch.com/icon.png',
      description:
        'SEBI registered stock broker (INZ000252338) and BSE member (0433) based on Dalal Street, Mumbai with over 50 years of capital market trust. Offering Demat & Trading accounts, Equity trading, IPOs, and ETFs with dedicated personal broker support.',
      telephone: '+91-22-66334980',
      email: 'info@shukfinch.com',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Office No. 1212, 12th Floor, P. J. Tower, Dalal Street, Fort',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 18.9298,
        longitude: 72.8335,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      memberOf: [
        {
          '@type': 'Organization',
          name: 'Securities and Exchange Board of India (SEBI)',
          identifier: 'INZ000252338',
        },
        {
          '@type': 'Organization',
          name: 'Bombay Stock Exchange (BSE)',
          identifier: '0433',
        },
      ],
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Stock Broking & Investment Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Demat & Trading Account Opening' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Equity Cash & Delivery Trading' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IPO Online Applications' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Exchange Traded Funds (ETFs)' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Personal Stock Broker Support Desk' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Stock Market Research & Insights' } },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://shukfinch.com/#website',
      url: 'https://shukfinch.com',
      name: 'Shukfinch',
      description: 'Smart Finance. Better Future. SEBI Registered Stock Broker on Dalal Street, Mumbai.',
      publisher: {
        '@id': 'https://shukfinch.com/#organization',
      },
      inLanguage: 'en-IN',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
      <body className={plusJakartaSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollEffects />
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
