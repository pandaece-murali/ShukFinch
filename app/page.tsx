import type { Metadata } from 'next';
import Link from 'next/link';
import { Cards, Cta, Faq, Pillars, Steps } from '@/components/Blocks';
import { LeadForm } from '@/components/Forms';
import { SERVICE_CARDS } from '@/lib/pages';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shukfinch | SEBI Registered Stock Broker on Dalal Street, Mumbai',
  description:
    'Open Demat & Trading account with Shukfinch. SEBI registered stock broker (INZ000252338) & BSE member (0433) on Dalal Street, Mumbai. 50+ years of market experience, Equity, IPOs, ETFs & personal broker support.',
  alternates: {
    canonical: SITE.url,
  },
};

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is my money safe with Shukfinch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Client funds are kept strictly separate from the broker's own funds in segregated accounts, and our operations follow SEBI and exchange requirements. Our SEBI registration number is ${SITE.sebi} and BSE member code is ${SITE.bse}.`,
      },
    },
    {
      '@type': 'Question',
      name: 'I am new to investing. Can you help me start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You do not need to be an expert. Our team can guide you through opening your account, understanding KYC, and taking your first steps in the stock market.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will someone push me to trade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. We provide access, market information, and dealer support. Every investment decision is entirely yours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I visit the Shukfinch office in Mumbai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. You can visit our registered office at ${SITE.address}.`,
      },
    },
  ],
};

const STRIP: [string, string][] = [
  ['50+ years', 'Of experience in the stock market'],
  ['Since 1998', 'Established as a Pvt Ltd company'],
  ['Funds kept separate', "From the broker's own funds"],
  ['Dalal Street', 'P. J. Tower, Fort, Mumbai'],
];
const RS: [string, string][] = [
  ['Research', 'Look deeper into companies and markets.'],
  ['Fundamental Analysis', 'Understand businesses beyond the share price.'],
  ['Technical Analysis', 'Study price movements and market behaviour.'],
  ['Market Trends', 'Stay aware of what is changing.'],
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />

      <header className="hero">
        <div className="hero-grid-pattern" aria-hidden="true" />
        <div className="w">
          <div className="hero-content">
            <div className="hero-pill">
              <span className="hero-pulse" />
              <span>SEBI Registered Stock Broker · BSE Member {SITE.bse}</span>
            </div>
            <h1>
              Your Market. Your Investments.{' '}
              <span className="hero-gradient-text">One Platform.</span>
            </h1>
            <p className="lead">
              Buy your first stock, apply for an IPO, build a diversified portfolio or track what you own—backed by 50+ years of Dalal Street market trust, modern technology, and personal broker support.
            </p>
            <div className="ctas">
              <a className="btn b1 hero-cta-btn" href="#open">
                Open Demat Account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <Link className="btn b2 hero-secondary-btn" href="/personal-support">
                Talk to Our Desk
              </Link>
            </div>
            <div className="chips">
              <span className="chip">
                <span className="chip-dot" /> SEBI Reg. <b>{SITE.sebi}</b>
              </span>
              <span className="chip">
                <span className="chip-dot" /> <b>50+ Years</b> Market Legacy
              </span>
              <span className="chip">
                <span className="chip-dot" /> BSE Member <b>{SITE.bse}</b>
              </span>
              <span className="chip">
                <span className="chip-dot" /> Office on <b>Dalal Street, Mumbai</b>
              </span>
            </div>
          </div>
          <div className="hero-form-wrapper">
            <LeadForm variant="hero" />
          </div>
        </div>
      </header>

      <section className="strip"><div className="w">{STRIP.map(([a, b]) => <div key={a} className="i"><strong>{a}</strong><small>{b}</small></div>)}</div></section>

      <section className="sec" id="call"><div className="w two">
        <div>
          <h2>Not another trading app. A broker you can call.</h2>
          <p className="lead">Apps are quick. But when a payment is stuck, an IPO application needs attention, or you want something explained, a help page is not always enough. You get digital convenience and a real team, backed by an office on Dalal Street.</p>
          <Link className="btn bblue" href="/personal-support">Talk to Our Team</Link>
        </div>
        <div className="phone">
          <div className="big">{SITE.phone}</div>
          <p>Also {SITE.phone2}. Or leave your number and we will call you back.</p>
          <ul>{['Opening your account and KYC', 'Understanding a transaction or process', 'Market and order support', 'General account questions'].map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </div></section>

      <section className="sec services-section" style={{ paddingTop: 24 }}>
        <div className="w">
          <div className="services-head-block">
            <div className="services-pill">
              <span className="services-pill-dot" />
              <span>Investment &amp; Trading Suite</span>
            </div>
            <div className="head">
              <h2>
                Everything you need,{' '}
                <span className="services-gradient-text">without the complexity</span>
              </h2>
              <p className="lead" style={{ maxWidth: 460 }}>
                One connected platform to trade equities, subscribe to IPOs, invest in ETFs, and track your complete portfolio in real time.
              </p>
            </div>
          </div>
          <Cards cards={SERVICE_CARDS} />
        </div>
      </section>

      <section className="sec steps"><div className="w">
        <div className="head"><h2>Open your account in four simple steps</h2></div>
        <Steps steps={[['Apply', 'Tell us a little about yourself.'], ['Complete KYC', 'Provide the required information and documents.'], ['Verify', 'Finish the required verification steps.'], ['Start investing', 'Once your account is active, you are ready to go.']]} />
        <p className="help">Stuck at any step? Call <b>{SITE.phone}</b>.</p>
        <div style={{ textAlign: 'center', marginTop: 24 }}><Link className="btn bblue" href="/account-opening">Open Your Account</Link></div>
      </div></section>

      <section className="sec"><div className="w two">
        <div>
          <h2>Invest with information. Trade with confidence.</h2>
          <p className="lead">Markets can move quickly. Your decisions should not have to. Understand what is happening before you make your own call.</p>
          <p style={{ margin: '22px 0 28px', fontWeight: 600 }}>Technology when you want it. People when you need them.</p>
          <Link className="btn bblue" href="/research">Explore Research</Link>
        </div>
        <div className="rs" style={{ gridTemplateColumns: '1fr' }}>
          {RS.map(([t, d], i) => <div key={t} className="card"><div className={'bar' + (i % 2 ? ' b' : '')} /><div><h3>{t}</h3><p>{d}</p></div></div>)}
        </div>
      </div></section>

      <section className="sec trust"><div className="w">
        <h2>Your money deserves care.</h2>
        <p className="lead" style={{ marginTop: 14, maxWidth: 700 }}>Shukfinch operates within the applicable regulatory and compliance framework, with processes covering client funds, securities, reporting, order processing and risk management.</p>
        <div style={{ marginTop: 44 }}><Pillars icons={['wallet', 'shield', 'list', 'headset']} items={[['Your funds', "Kept separate from the broker's own funds, in line with applicable requirements."], ['Your securities', 'Subject to regulatory safeguards on how they are held and used.'], ['Your transactions', 'Recorded with an auditable electronic trail.'], ['Your concerns', 'Formal grievance-redressal channels are available, including SEBI SCORES where applicable.']]} /></div>
        <div className="note">Markets involve risk. We do not promise assured returns. Every investment decision is yours.</div>
        <div style={{ marginTop: 30 }}><Link className="btn b1" href="/trust-security">Learn About Our Approach to Security</Link></div>
      </div></section>

      <section className="sec"><div className="w">
        <div className="head" style={{ justifyContent: 'center', textAlign: 'center' }}><h2>Questions people ask us</h2></div>
        <Faq open items={[['Is my money safe?', `Client funds are kept separate from the broker's own funds, and our operations follow SEBI and exchange requirements. Our SEBI registration number is ${SITE.sebi}.`], ["I'm new to investing. Can you help me start?", 'Yes. You do not need to be an expert. Our team can guide you through opening your account and taking your first steps.'], ['Will someone push me to trade?', 'No. We provide access, information and support. Every investment decision is yours.'], ['Can I visit your office?', "Of course. You'll find us at " + SITE.address.replace(' – 400001', '') + '.']]} />
      </div></section>

      <Cta />
    </>
  );
}
