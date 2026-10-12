import type { IconName } from '@/components/Icon';
import { RISK } from './site';

export type Card = { i: IconName; t: string; p: string; l?: [string, string]; feat?: boolean };
export type Block = {
  h?: string; d?: string;
  cards?: Card[]; cols?: 2 | 4;
  list?: (string | [string, string])[];
  steps?: [string, string][];
  pillars?: [string, string][];
  note?: string; faq?: [string, string][]; docs?: string[];
  form?: 'callback' | 'kyc'; contact?: boolean;
};
export type Page = {
  slug: string; nav: string; title: string; sub: string; desc: string;
  ctas?: [string, string, 'b1' | 'b2'][]; blocks: Block[];
};
// Text in [[double brackets]] renders as a yellow "still needed from Shukfinch" highlight.
// Clean text for production
const TBC = 'available on request';

export const SERVICE_CARDS: Card[] = [
  { i: 'chart', t: 'Equity', p: 'Delivery and intraday trading in the equity cash market.', l: ['Explore Equity', '/equity'] },
  { i: 'rocket', t: 'IPOs', p: 'Explore IPO opportunities and the digital application process.', l: ['Explore IPOs', '/ipos'] },
  { i: 'pie', t: 'ETFs', p: 'Diversify across market segments and themes.', l: ['Explore ETFs', '/etfs'] },
  { i: 'wallet', t: 'Demat & Trading Account', p: 'One connected account to hold and transact in your securities.', l: ['Learn More', '/demat-trading-account'] },
  { i: 'trend', t: 'Portfolio', p: 'Holdings, positions, transactions and P&L in real time.', l: ['Track Your Portfolio', '/portfolio'] },
  { i: 'search', t: 'Research', p: 'Fundamental and technical market insights.', l: ['Explore Research', '/research'] },
  { i: 'building', t: 'Institutional Broking', p: 'Dedicated trade execution and institutional research for institutions, family offices and HNIs.', l: ['Talk to Our Team', '/contact'], feat: true },
];

const L = (xs: Card[]) => xs;
export const PAGES: Page[] = [
  { slug: 'about', nav: 'About Us', title: 'We are here for more than the trade.', desc: 'Shukfinch: 50+ years of market experience, private limited since 1998, on Dalal Street, Mumbai.',
    sub: 'Investing is a journey, not just a transaction. We combine technology with personal support so the whole journey feels connected.',
    blocks: [
      { h: 'Our legacy', d: 'Shukfinch comes from M.D. Shukla Share & Securities Pvt Ltd, carrying forward over five decades of capital market trust and expertise from Dalal Street, Mumbai.',
        list: ['50+ years of market experience', ['Pvt Ltd since 1998', 'Transformed from a proprietorship to a private limited company in 1998'], 'SEBI registered stock broker', 'Office on Dalal Street, Mumbai'] },
      { h: 'Experience that matters', d: 'That experience taught us what investors value most.', cols: 4,
        cards: L([{ i: 'key', t: 'Access', p: 'Markets, IPOs and ETFs through one account.' }, { i: 'eye', t: 'Transparency', p: 'Clear processes and honest information.' }, { i: 'headset', t: 'Support', p: 'A team you can call when you need help.' }, { i: 'shield', t: 'Trust', p: 'Earned through safeguards and accountability.' }]) },
      { h: 'Find us', list: [['Address', 'Office No. 1212, 12th Floor, P. J. Tower, Dalal Street, Fort, Mumbai – 400001'], ['Phone', '022-66334980 / 86']] },
    ] },
  { slug: 'services', nav: 'Our Services', title: 'What can we help you with?', desc: 'Equity, IPOs, ETFs, demat and trading account, portfolio and research at Shukfinch.',
    sub: 'Equity, IPOs, ETFs, one connected account, your portfolio and research, all in one place.',
    blocks: [{ cards: SERVICE_CARDS }, { note: 'For custom investment requirements, specialized products or trading desk queries, please contact our team at 022-66334980.' }] },
  { slug: 'equity', nav: 'Equity', title: 'Your next trade starts with a decision.', desc: 'Equity cash market, delivery and intraday trading with Shukfinch.',
    sub: 'The market gives you opportunities. Your job is to decide which fit your approach. We give you the access and tools to act, backed by decades of experience.',
    blocks: [
      { h: 'With Shukfinch, you can access', list: ['Equity cash market', 'Delivery trading', 'Intraday trading', 'Buy and sell orders', 'Market orders and limit orders', 'Digital trade access'] },
      { h: 'Who it is for', cards: [{ i: 'user', t: 'First-time investors', p: 'Want guidance before the first trade.' }, { i: 'clock', t: 'Long-term investors', p: 'Build holdings through delivery.' }, { i: 'bolt', t: 'Active traders', p: 'Want dependable execution and support.' }] },
      { h: 'Have questions before you start?', note: 'Talk to our team at 022-66334980, or open your account online. ' + RISK },
    ] },
  { slug: 'ipos', nav: 'IPOs', title: 'See what is coming to the market.', desc: 'Explore new public issues and apply through a digital process with Shukfinch.',
    sub: 'IPOs can be exciting, but they also deserve careful thought. Get access to primary market opportunities and a convenient digital application process.',
    ctas: [['Explore IPOs', '/account-opening', 'b1']],
    blocks: [{ h: 'Explore', list: ['IPO applications', 'New public issues', 'Primary market opportunities', 'Digital application process'] },
      { h: 'Do your research. Then decide.', note: 'Shukfinch provides access and information. The investment decision is yours. ' + RISK }] },
  { slug: 'etfs', nav: 'ETFs', title: 'One investment. A more diversified approach.', desc: 'Equity and index ETFs, traded through your Shukfinch account.',
    sub: 'ETFs give you access to different market segments and investment themes. You trade them through your account like any listed security.',
    blocks: [{ h: 'What you can explore', cards: [{ i: 'chart', t: 'Equity ETFs', p: 'Exposure to equity markets.' }, { i: 'trend', t: 'Index-based investments', p: 'Track a market index.' }, { i: 'pie', t: 'Diversification', p: 'Spread across segments and themes.' }] }, { note: RISK }] },
  { slug: 'demat-trading-account', nav: 'Demat & Trading Account', title: 'One account to hold and trade your securities.', desc: 'A connected demat and trading account with nomination facility and digital settlement.',
    sub: 'Your demat account holds your securities. Your trading account lets you buy and sell them. At Shukfinch, the two work together.',
    blocks: [{ h: 'What you get', list: ['Connected demat and trading account', 'Digital settlement for securities delivery and instructions', 'Nomination facility: add a nominee or formally opt out', 'Holdings, statements and P&L in one view'] },
      { h: 'Documents required', note: 'Essential documents required to open an account: PAN Card, Government Address Proof (Aadhaar / Passport / Voter ID), Bank Account Proof, Photograph and Signature. Complete your digital KYC online in just 10 minutes.' }] },
  { slug: 'portfolio', nav: 'Portfolio', title: 'Know what is happening with your investments.', desc: 'Holdings, positions, P&L, transactions and statements in one view.',
    sub: 'You should not have to wonder where your investments stand.', ctas: [['Open Your Account', '/account-opening', 'b1']],
    blocks: [{ cards: [{ i: 'wallet', t: 'What you own', p: 'Your portfolio holdings.' }, { i: 'trend', t: 'Where you stand', p: 'Your positions and P&L.' }, { i: 'list', t: 'What you have done', p: 'Your transaction history.' }, { i: 'bell', t: 'What has changed', p: 'Corporate actions and account updates.' }, { i: 'doc', t: 'What you need', p: 'Your account statements.' }] }] },
  { slug: 'research', nav: 'Research', title: 'The market does not come with simple answers.', desc: 'Fundamental and technical analysis, company research, sector insights and market trends.',
    sub: 'That is why research matters. We provide information and analysis so you can make your own decisions.', ctas: [['Open Your Account', '/account-opening', 'b1']],
    blocks: [{ cards: [{ i: 'eye', t: 'Fundamental Analysis', p: 'Look beyond the numbers on the screen.' }, { i: 'trend', t: 'Technical Analysis', p: 'Understand market movements and trends.' }, { i: 'building', t: 'Company Research', p: 'A closer look at individual companies.' }, { i: 'layers', t: 'Sector Insights', p: 'What is happening across industries.' }, { i: 'chart', t: 'Market Trends', p: 'Keep up with a changing market.' }, { i: 'tool', t: 'Analytical Tools', p: 'Digital tools for investors who research and decide on their own.' }] },
      { note: 'Research. Think. Decide. Research is for information only and does not guarantee outcomes or returns.' }] },
  { slug: 'personal-support', nav: 'Personal Support', title: 'Sometimes, you just want to talk to a person.', desc: 'Call 022-66334980 or request a callback for account, KYC, order and market support.',
    sub: 'Technology makes investing faster. When you have a question, a person can make things clearer.', ctas: [['Call 022-66334980', 'tel:02266334980', 'b1']],
    blocks: [{ h: 'We can help with', list: ['Opening your account and KYC', 'Understanding a transaction or process', 'Market and order support', 'General account questions'] },
      { h: 'Request a callback', d: 'Call 022-66334980 / 86, or leave your number.', form: 'callback' }] },
  { slug: 'trust-security', nav: 'Trust & Security', title: 'Because trust is not just about what we say.', desc: 'How Shukfinch protects client funds and securities, and operates within SEBI and exchange rules.',
    sub: 'Shukfinch is a SEBI-registered stock broker. Our operations are governed by SEBI regulations and exchange-level compliance requirements.',
    blocks: [
      { h: 'Protecting your funds and securities', pillars: [['Client funds', "Held separately from the broker's own funds, with controls against unauthorised use."], ['Client securities', 'Subject to regulatory safeguards on how they are held and used.'], ['Reporting', 'Prescribed reporting and reconciliation requirements.'], ['Nomination', 'Nominate beneficiaries or formally opt out.']] },
      { h: 'Secure, compliant operations', cols: 4, cards: [{ i: 'user', t: 'Digital KYC', p: 'Every client completes KYC and verification before gaining access.' }, { i: 'list', t: 'Order processing', p: 'Orders leave an auditable electronic trail.' }, { i: 'chart', t: 'Margins and risk', p: 'Margins are collected and monitored as regulations require.' }, { i: 'eye', t: 'Audits and grievances', p: 'Inspections, audits and formal redressal, including SEBI SCORES.' }] },
      { note: 'Markets involve risk. We do not promise assured returns. We believe investors deserve honest information so they can make their own decisions.' },
    ] },
  { slug: 'account-opening', nav: 'Account Opening', title: 'Let us get you started.', desc: 'Open your Shukfinch demat and trading account online with digital KYC.',
    sub: 'Opening an account does not have to feel complicated. Complete your application and KYC online in four steps.', ctas: [['Talk to Our Team', '/personal-support', 'b2']],
    blocks: [{ form: 'kyc' }, { h: 'Frequently Asked Questions', faq: [['How long does it take?', 'Filling the online application takes about 10 minutes. Once submitted, our compliance team reviews and activates your account within 24 to 48 working hours.'], ['What documents do I need?', 'PAN Card, government-approved Address Proof (Aadhaar, Passport, Voter ID or DL), recent passport-size photograph, signature on white paper, and cancelled cheque or bank statement.'], ['Can someone help me?', 'Yes. Call our onboarding desk at 022-66334980 / 86 and our team will guide you through each step.']] }] },
  { slug: 'why-shukfinch', nav: 'Why Shukfinch', title: 'What we believe.', desc: 'Accessible investing, useful information, simple technology, personal service and earned trust.',
    sub: 'Because your money deserves more than a trading platform. It deserves safeguards.',
    blocks: [{ cards: [{ i: 'key', t: 'Investing should be accessible', p: 'You should not need to be an expert to get started.' }, { i: 'search', t: 'Information should be useful', p: 'Research and market information to make your own decisions.' }, { i: 'tool', t: 'Technology should simplify', p: 'Digital processes that make your journey easier.' }, { i: 'headset', t: 'Service should feel personal', p: 'When you need help, you can reach someone.' }, { i: 'shield', t: 'Trust should be earned', p: 'Transparent processes, safeguards and accountability.' }] },
      { h: 'Why you can trust Shukfinch', note: 'Your funds are kept separate. Your securities are safeguarded. Your transactions are traceable. Your grievances have a formal channel. Our operations are subject to regulatory oversight.' }] },
  { slug: 'investor-corner', nav: 'Investor Corner', title: 'Useful information, all in one place.', desc: 'Investor charter, rights and obligations, risk disclosure, KYC, nomination, forms and grievance redressal.',
    sub: 'Find the documents and information you may need as an investor.',
    blocks: [{ docs: ['Investor Charter', 'Rights and Obligations', 'Risk Disclosure', 'KYC Information', 'Nomination', 'Forms and Downloads', 'Grievance Redressal', 'Regulatory Disclosures'] },
      { note: 'For regulatory inquiries or grievance escalation, contact compliance@shukfinch.com or 022-66334980. Investors can also access SEBI SCORES portal at scores.sebi.gov.in or BSE grievance redressal mechanism.' }] },
  { slug: 'contact', nav: 'Contact', title: 'Have a question?', desc: 'Call, email or visit Shukfinch on Dalal Street, Mumbai.',
    sub: 'Whether you are thinking about opening an account or already investing with us, we would love to hear from you.', blocks: [{ contact: true }] },
];
export const getPage = (slug: string) => PAGES.find((p) => p.slug === slug);
