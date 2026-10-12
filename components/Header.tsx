'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, SITE } from '@/lib/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);

  // Handle escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <div className="top">
        <div className="w">
          <span className="top-sebi">SEBI Registered Stock Broker · <b>{SITE.sebi}</b> · BSE Member <b>{SITE.bse}</b></span>
          <span className="top-call"><a href={SITE.tel}>Call us: <b>{SITE.phone} / 86</b></a></span>
        </div>
      </div>
      <nav>
        <div className="w">
          <Link className="logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Shukfinch Logo" src="/logo-mark.png" height={46} width={46} />
            <div>Shuk<i>Finch</i></div>
          </Link>

          <div className={'menu' + (open ? ' open' : '')} id="menu">
            <div className="dd">
              <Link href="/services">Services</Link>
              <div className="ddm">
                {NAV.services.map(([t, h]) => (
                  <Link key={h} href={h} onClick={() => setOpen(false)}>
                    {t}
                  </Link>
                ))}
              </div>
            </div>
            <div className="dd">
              <Link href="/about">Company</Link>
              <div className="ddm">
                {NAV.company.map(([t, h]) => (
                  <Link key={h} href={h} onClick={() => setOpen(false)}>
                    {t}
                  </Link>
                ))}
              </div>
            </div>
            {NAV.links.map(([t, h]) => (
              <Link key={h} href={h} onClick={() => setOpen(false)}>
                {t}
              </Link>
            ))}

            <div className="mob-menu-actions">
              <Link className="btn b1" href="/account-opening" onClick={() => setOpen(false)} style={{ width: '100%' }}>
                Open Your Account
              </Link>
              <a className="btn b2" href={SITE.tel} style={{ width: '100%', color: 'var(--ink)' }}>
                Call {SITE.phone}
              </a>
            </div>
          </div>

          <a className="login" href="/contact" title="Trading Portal & Support">
            Client Login
          </a>
          <Link className="btn b1 desktop-cta" href="/account-opening">
            Open Your Account
          </Link>
          <Link className="btn b1 mob-cta" href="/account-opening">
            Open Account
          </Link>
          <button
            className="burger"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </>
  );
}
