'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { NAV, SITE } from '@/lib/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
    setActiveSubmenu(null);
  }, [path]);

  // Handle escape key and click outside
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setActiveSubmenu(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveSubmenu(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu((prev) => (prev === name ? null : name));
  };

  return (
    <>
      <div className="top">
        <div className="w">
          <span className="top-sebi">SEBI Registered Stock Broker · <b>{SITE.sebi}</b> · BSE Member <b>{SITE.bse}</b></span>
          <span className="top-call"><a href={SITE.tel}>Call us: <b>{SITE.phone} / 86</b></a></span>
        </div>
      </div>
      <nav ref={navRef}>
        <div className="w">
          <Link className="logo" href="/" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Shukfinch Logo" src="/logo-mark.png" height={46} width={46} />
            <div>Shuk<i>Finch</i></div>
          </Link>

          <div className={'menu' + (open ? ' open' : '')} id="menu">
            {/* Services Dropdown */}
            <div className={'dd' + (activeSubmenu === 'services' ? ' open' : '')}>
              <div className="dd-header">
                <Link href="/services" onClick={() => setOpen(false)}>
                  Services
                </Link>
                <button
                  type="button"
                  className="dd-toggle"
                  aria-label="Toggle Services submenu"
                  aria-expanded={activeSubmenu === 'services'}
                  onClick={() => toggleSubmenu('services')}
                >
                  <span className="dd-arrow" />
                </button>
              </div>
              <div className="ddm">
                {NAV.services.map(([t, h]) => (
                  <Link key={h} href={h} onClick={() => setOpen(false)}>
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Dropdown */}
            <div className={'dd' + (activeSubmenu === 'company' ? ' open' : '')}>
              <div className="dd-header">
                <Link href="/about" onClick={() => setOpen(false)}>
                  Company
                </Link>
                <button
                  type="button"
                  className="dd-toggle"
                  aria-label="Toggle Company submenu"
                  aria-expanded={activeSubmenu === 'company'}
                  onClick={() => toggleSubmenu('company')}
                >
                  <span className="dd-arrow" />
                </button>
              </div>
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
