import Link from 'next/link';
import { Cards, Cta, Faq, Pillars, Steps } from '@/components/Blocks';
import { LeadForm } from '@/components/Forms';
import { SERVICE_CARDS } from '@/lib/pages';
import { SITE } from '@/lib/site';

const STRIP: [string, string][] = [['50+ years', 'Of experience in the stock market'], ['Since 1998', 'Established as a Pvt Ltd company'], ['Funds kept separate', "From the broker's own funds"], ['Dalal Street', 'P. J. Tower, Fort, Mumbai']];
const RS: [string, string][] = [['Research', 'Look deeper into companies and markets.'], ['Fundamental Analysis', 'Understand businesses beyond the share price.'], ['Technical Analysis', 'Study price movements and market behaviour.'], ['Market Trends', 'Stay aware of what is changing.']];

export default function Home() {
  return (
    <>
      <header className="hero"><div className="w">
        <div>
          <h1>Your Market. Your Investments. One Platform.</h1>
          <p className="lead">Buy your first stock, apply for an IPO, build a diversified portfolio or track what you own, with market experience, modern technology and people you can reach when you need them.</p>
          <div className="ctas"><a className="btn b1" href="#open">Open Your Account</a><a className="btn b2" href="#call">Talk to Our Team</a></div>
          <div className="chips">
            <span className="chip">SEBI Reg. <b>{SITE.sebi}</b></span><span className="chip"><b>50+ years</b> of market experience</span>
            <span className="chip"><b>Pvt Ltd since 1998</b></span><span className="chip">Office on <b>Dalal Street</b></span>
          </div>
        </div>
        <LeadForm variant="hero" />
      </div></header>

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

      <section className="sec" style={{ paddingTop: 0 }}><div className="w">
        <div className="head"><h2>Everything you need, without the complexity</h2><p className="lead" style={{ maxWidth: 420 }}>You should not need five different places to manage your investments.</p></div>
        <Cards cards={SERVICE_CARDS} />
      </div></section>

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
