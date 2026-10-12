import Link from 'next/link';
import { RISK, SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer><div className="w">
      <div className="fg">
        <div>
          <div className="logo">{/* eslint-disable-next-line @next/next/no-img-element */}<img alt="" src="/logo-mark.png" height={46} /><div>Shuk<i>Finch</i></div></div>
          <p>Smart Finance. Better Future.</p>
          <p style={{ marginTop: 12 }}>{SITE.address}</p>
        </div>
        <div><h4>Services</h4><Link href="/equity">Equity</Link><Link href="/ipos">IPOs</Link><Link href="/etfs">ETFs</Link><Link href="/demat-trading-account">Demat &amp; Trading Account</Link><Link href="/research">Research</Link></div>
        <div><h4>Company</h4><Link href="/about">About Us</Link><Link href="/why-shukfinch">Why Shukfinch</Link><Link href="/trust-security">Trust &amp; Security</Link><Link href="/investor-corner">Investor Corner</Link><Link href="/contact">Contact</Link></div>
        <div><h4>Contact</h4><a href={SITE.tel}>{SITE.phone} / 86</a><a href={'mailto:' + SITE.email}>{SITE.email}</a><Link href="/personal-support">Request a Callback</Link></div>
      </div>
      <div className="disc">
        SEBI Registration No. {SITE.sebi} · BSE member code {SITE.bse} · Depository Participant details <span className="hl">to confirm</span>. {RISK} Shukfinch does not promise or guarantee returns.
      </div>
    </div></footer>
  );
}
