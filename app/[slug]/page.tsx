import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlockView, Cta } from '@/components/Blocks';
import { PAGES, getPage } from '@/lib/pages';
import { RISK } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => PAGES.map((p) => ({ slug: p.slug }));
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  return p ? { title: p.nav.replace('&amp;', '&'), description: p.desc, alternates: { canonical: '/' + p.slug } } : {};
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const ctas = p.ctas ?? [['Open Your Account', '/account-opening', 'b1'], ['Talk to Our Team', '/personal-support', 'b2']];
  return (
    <>
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
