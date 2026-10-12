'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, SITE } from '@/lib/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <>
      <div className="top"><div className="w">
        <span>SEBI Registered Stock Broker · <b>{SITE.sebi}</b> · BSE Member <b>{SITE.bse}</b></span>
        <span>Call us: <b>{SITE.phone} / 86</b></span>
      </div></div>
      <nav><div className="w">
        <Link className="logo" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/logo-mark.png" height={46} />
          <div>Shuk<i>Finch</i></div>
        </Link>
        <div className={'menu' + (open ? ' open' : '')} id="menu">
          <div className="dd"><Link href="/services">Services</Link><div className="ddm">{NAV.services.map(([t, h]) => <Link key={h} href={h}>{t}</Link>)}</div></div>
          <div className="dd"><Link href="/about">Company</Link><div className="ddm">{NAV.company.map(([t, h]) => <Link key={h} href={h}>{t}</Link>)}</div></div>
          {NAV.links.map(([t, h]) => <Link key={h} href={h}>{t}</Link>)}
        </div>
        <a className="login" href="#">Login</a>
        <Link className="btn b1" href="/account-opening">Open Your Account</Link>
        <button className="burger" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>&#9776;</button>
      </div></nav>
    </>
  );
}
