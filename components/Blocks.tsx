import Link from 'next/link';
import { Icon } from './Icon';
import { LeadForm } from './Forms';
import { KycForm } from './KycForm';
import { SITE } from '@/lib/site';
import type { Block, Card } from '@/lib/pages';

export function Rich({ t }: { t: string }) {
  return (
    <>
      {t.split(/(\[\[.*?\]\])/g).map((s, i) =>
        s.startsWith('[[') ? <span key={i} className="hl">{s.slice(2, -2)}</span> : s
      )}
    </>
  );
}

export function Cards({ cards, cols }: { cards: Card[]; cols?: 2 | 4 }) {
  return (
    <div className={'grid' + (cols === 2 ? ' g2' : cols === 4 ? ' g4' : '')}>
      {cards.map((c, i) => (
        <div key={c.t} className={'card' + (c.feat ? ' feat' : '')}>
          <div className={'ic c' + (1 + (i % 2))} style={c.feat ? { background: 'rgba(255,255,255,.2)', color: '#fff' } : undefined}><Icon n={c.i} /></div>
          <h3>{c.t}</h3>
          <p><Rich t={c.p} /></p>
          {c.l && <Link href={c.l[1]}>{c.l[0]}</Link>}
        </div>
      ))}
    </div>
  );
}

export function Steps({ steps }: { steps: [string, string][] }) {
  return (
    <div className="srow">
      {steps.map(([t, d], i) => (
        <div key={t} className="step"><div className="n">{i + 1}</div><h3>{t}</h3><p>{d}</p></div>
      ))}
    </div>
  );
}

export function Pillars({ items, icons }: { items: [string, string][]; icons: Parameters<typeof Icon>[0]['n'][] }) {
  return (
    <div className="tg g4">
      {items.map(([t, d], i) => (
        <div key={t} className="tc"><div className="tic"><Icon n={icons[i]} /></div><h3>{t}</h3><p>{d}</p></div>
      ))}
    </div>
  );
}

export function Faq({ items, open }: { items: [string, string][]; open?: boolean }) {
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <details key={q} open={open && i === 0}><summary>{q}</summary><p><Rich t={a} /></p></details>
      ))}
    </div>
  );
}

export function Cta() {
  return (
    <section className="blk"><div className="w"><div className="cta">
      <div><h2>Ready when you are.</h2><p>Complete the account opening and KYC process and get connected with Shukfinch.</p></div>
      <div className="btns"><Link className="btn b1" href="/account-opening">Open Your Account</Link><Link className="btn b2" href="/personal-support">Talk to Us</Link></div>
    </div></div></section>
  );
}

export function BlockView({ b }: { b: Block }) {
  return (
    <section className="blk"><div className="w">
      {b.h && <h2>{b.h}</h2>}
      {b.d && <p className="lead"><Rich t={b.d} /></p>}
      {b.cards && <Cards cards={b.cards} cols={b.cols} />}
      {b.list && (
        <ul className="chk">
          {b.list.map((x) => {
            const [a, s] = Array.isArray(x) ? x : [x, ''];
            return <li key={a}>{a}{s && <small>{s}</small>}</li>;
          })}
        </ul>
      )}
      {b.steps && <Steps steps={b.steps} />}
      {b.pillars && <div className="dk"><Pillars items={b.pillars} icons={['wallet', 'shield', 'doc', 'user']} /></div>}
      {b.docs && (
        <div className="grid">
          {b.docs.map((d) => (
            <div key={d} className="card dl"><div className="ic c1" style={{ flex: 'none', margin: 0 }}><Icon n="doc" /></div><h3 style={{ fontSize: 17 }}>{d}</h3><span className="tag">to confirm</span></div>
          ))}
        </div>
      )}
      {b.note && <div className="nt"><Rich t={b.note} /></div>}
      {b.faq && <Faq items={b.faq} />}
      {b.form === 'callback' && <LeadForm variant="callback" />}
      {b.form === 'kyc' && <KycForm />}
      {b.contact && (
        <div className="cl">
          <div className="ci">
            <div><b>Phone</b><a href={SITE.tel}>{SITE.phone} / 86</a></div>
            <div><b>Email</b><a href={'mailto:' + SITE.email} style={{ color: 'var(--sky)', fontWeight: 700 }}>{SITE.email}</a></div>
            <div><b>WhatsApp</b><span className="hl">to confirm</span></div>
            <div><b>Hours</b><span className="hl">to confirm</span></div>
            <div><b>Visit us</b>{SITE.address}</div>
          </div>
          <LeadForm variant="contact" />
        </div>
      )}
    </div></section>
  );
}
