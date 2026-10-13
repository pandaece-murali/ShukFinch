'use client';
import { useState } from 'react';
import { INT, SITE } from '@/lib/site';

export type FP = { label: string; name: string; type?: string; opts?: string[]; req?: boolean; full?: boolean; ph?: string; max?: number; upper?: boolean };

export function F({ label, name, type = 'text', opts, req, full, ph, max, upper }: FP) {
  return (
    <label className={'f' + (full ? ' full' : '')}>
      <span>{label}{req ? ' *' : ''}</span>
      {opts ? (
        <select name={name}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
      ) : type === 'area' ? (
        <textarea name={name} rows={4} placeholder={ph} />
      ) : (
        <input name={name} type={type} placeholder={ph} required={req} maxLength={max}
          accept={type === 'file' ? '.pdf,.jpg,.jpeg,.png' : undefined}
          style={upper ? { textTransform: 'uppercase' } : undefined} />
      )}
    </label>
  );
}

export function Honeypot() {
  return <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />;
}

export function Thanks({ msg }: { msg: string }) {
  return (
    <div className="ok">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: '#E8F8EE', color: '#097932', border: '1px solid #A3E5BA', borderRadius: 20, fontSize: 13.5, fontWeight: 700, marginBottom: 14 }}>
        ✓ Submitted Successfully
      </div>
      <h3>Thank you. We have your details.</h3>
      <p>{msg}</p>
    </div>
  );
}

type V = 'hero' | 'callback' | 'contact';
export function LeadForm({ variant }: { variant: V }) {
  const [st, setSt] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSt('busy');
    setErrMsg('');
    const d = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...d, form: variant }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        throw new Error(data.message || data.error || 'Submission failed');
      }
      setSt('done');
    } catch (err: any) {
      setErrMsg(err?.message || `We could not submit right now. Please try again or call ${SITE.phone}.`);
      setSt('error');
    }
  }
  const hero = variant === 'hero';
  const msg = variant === 'callback' ? 'We will call you back at your chosen time. Need us sooner? Call ' + SITE.phone + '.' : 'Our team will call you to help with KYC. You can also continue online in the account opening form.';
  return (
    <div className={hero ? 'form' : 'fcard'} id={hero ? 'open' : undefined}>
      {st === 'done' ? <Thanks msg={msg} /> : (
        <form onSubmit={onSubmit}>
          <h3 style={hero ? undefined : { fontSize: 22 }}>{hero ? 'Start your application' : variant === 'callback' ? 'Request a callback' : 'Send us a message'}</h3>
          <p className="s" style={hero ? undefined : { color: 'var(--mute)', margin: '6px 0 18px' }}>{hero ? 'Takes about a minute. We call you to help with KYC.' : variant === 'callback' ? 'Leave your number and we will call you back.' : 'We reply on the next working day.'}</p>
          <div className={hero ? undefined : 'fg2'}>
            <F label={variant === 'contact' ? 'Name' : 'Full name'} name="name" req ph={hero ? 'As on your PAN' : 'Your name'} />
            <F label={variant === 'contact' ? 'Phone' : 'Mobile number'} name="phone" type="tel" req ph="10-digit mobile number" />
            <F label="Email address" name="email" type="email" req ph="you@example.com" />
            {variant === 'callback' && <F label="Best time to call" name="bestTime" opts={['Morning (9-12)', 'Afternoon (12-4)', 'Evening (4-7)']} />}
            <F label={variant === 'callback' ? 'I need help with' : "I'm most interested in"} name="interest" opts={variant === 'callback' ? ['Opening my account and KYC', 'A transaction or process', 'Market and order support', 'General account questions'] : INT} full={variant === 'callback'} />
            {variant === 'contact' && <F label="Message" name="message" type="area" ph="How can we help?" full />}
          </div>
          <Honeypot />
          <label className="cons"><input type="checkbox" name="consent" required /> I agree to be contacted by Shukfinch{hero ? ' about my account opening.' : '.'}</label>
          {st === 'error' && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FF8E8E', borderRadius: 8, padding: '10px 14px', margin: '12px 0', color: '#D32F2F', fontSize: 13.5, fontWeight: 600 }}>
              ⚠️ Error: {errMsg || `We could not submit right now. Please try again or call ${SITE.phone}.`}
            </div>
          )}
          <button className="btn b1" type="submit" disabled={st === 'busy'} style={hero ? { width: '100%' } : undefined}>
            {st === 'busy' ? 'Submitting...' : hero ? 'Start My Application' : variant === 'callback' ? 'Request a Callback' : 'Get in Touch'}
          </button>
          {hero && <div className="call">Stuck? Call <b>{SITE.phone}</b> and we will walk you through it.</div>}
        </form>
      )}
    </div>
  );
}
