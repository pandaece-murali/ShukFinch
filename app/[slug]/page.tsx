import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlockView, Cta } from '@/components/Blocks';
import { PAGES, getPage } from '@/lib/pages';
import { RISK, SITE } from '@/lib/site';

export const generateStaticParams = () => PAGES.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const title = p.seoTitle || `${p.nav.replace('&amp;', '&')} | Shukfinch Stock Broking`;
  const url = `${SITE.url}/${p.slug}`;

  return {
    title,
    description: p.desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: p.desc,
      url,
      siteName: SITE.name,
      locale: 'en_IN',
      type: 'article',
      images: [
        {
          url: '/icon.png',
          width: 512,
          height: 512,
          alt: `${p.nav} - Shukfinch Stock Broking Mumbai`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: p.desc,
      images: ['/icon.png'],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const ctas = p.ctas ?? [['Open Your Account', '/account-opening', 'b1'], ['Talk to Our Team', '/personal-support', 'b2']];
  const url = `${SITE.url}/${p.slug}`;

  // Breadcrumb Schema for search engine indexing
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: p.nav.replace('&amp;', '&'),
        item: url,
      },
    ],
  };

  // Find any FAQ blocks on the page and generate FAQPage Schema for AEO
  const faqBlock = p.blocks.find((b) => b.faq && b.faq.length > 0);
  const faqSchema = faqBlock?.faq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqBlock.faq.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: a,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="ph"><div className="w">
        <div className="bc"><Link href="/">Home</Link> / {p.nav}</div>
        <h1>{p.title}</h1><p>{p.sub}</p>
        <div className="ctas">{ctas.map(([t, h, c]) => <Link key={t} className={'btn ' + c} href={h}>{t}</Link>)}</div>
      </div></section>
      {p.blocks.map((b, i) => <BlockView key={i} b={b} />)}
      <Cta />
      <div className="w"><p className="rk">{RISK} Shukfinch does not promise or guarantee returns.</p></div>
    </>
  );
}
