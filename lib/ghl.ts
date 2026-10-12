// Sends a lead to GoHighLevel. Runs on the server only, so tokens never reach the browser.
export type Lead = {
  form: string; name: string; phone: string; email?: string; interest?: string; kycStatus?: string;
  city?: string; message?: string; bestTime?: string; occupation?: string; tags: string[];
};

export const ghlConfigured = () =>
  Boolean(process.env.GHL_WEBHOOK_URL || (process.env.GHL_API_TOKEN && process.env.GHL_LOCATION_ID));

export async function pushToGhl(l: Lead) {
  const [firstName, ...rest] = l.name.trim().split(/\s+/);
  const phone = /^\d{10}$/.test(l.phone) ? `+91${l.phone}` : l.phone;
  const tags = ['Website Lead', ...l.tags];

  if (process.env.GHL_WEBHOOK_URL) {
    const r = await fetch(process.env.GHL_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'shukfinch.com', ...l, firstName, lastName: rest.join(' '), phone, tags }),
    });
    if (!r.ok) throw new Error('GHL webhook ' + r.status);
    return;
  }
  // LeadConnector API v2: create or update the contact by phone/email.
  const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GHL_API_TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID, firstName, lastName: rest.join(' '), phone, email: l.email || undefined,
      city: l.city, source: 'shukfinch.com', tags,
      customFields: [], // map interest / kycStatus / message to your custom field IDs here if needed
    }),
  });
  if (!r.ok) throw new Error('GHL API ' + r.status);
}

const s = (v: unknown, n = 300) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
export function cleanLead(d: Record<string, unknown>, form: string, tags: string[]): Lead | null {
  const name = s(d.name, 120), phone = s(d.phone, 20).replace(/[\s-]/g, '').replace(/^\+?91/, '');
  const email = s(d.email, 160);
  if (name.length < 2 || !/^\d{10}$/.test(phone)) return null;
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null;
  return { form, name, phone, email, interest: s(d.interest), kycStatus: s(d.kycStatus), city: s(d.city), message: s(d.message, 1000), bestTime: s(d.bestTime), occupation: s(d.occupation), tags };
}
