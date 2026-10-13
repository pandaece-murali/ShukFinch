// Sends a lead to GoHighLevel. Runs on the server only, so tokens never reach the browser.
export type Lead = {
  form: string;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  kycStatus?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  dateOfBirth?: string;
  gender?: string;
  pan?: string;
  income?: string;
  occupation?: string;
  bestTime?: string;
  message?: string;
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
  ifsc?: string;
  nomineeName?: string;
  nomineeRel?: string;
  verifyMethod?: string;
  noteBody?: string;
  tags: string[];
};

import fs from 'fs';
import path from 'path';

function parseEnvFile(filePath: string, key: string): string {
  try {
    if (!fs.existsSync(filePath)) return '';
    const text = fs.readFileSync(filePath, 'utf8');
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim();
      if (k === key) {
        let v = line.slice(eq + 1).trim();
        v = v.replace(/^['"](.*)['"]$/, '$1').trim();
        return v;
      }
    }
  } catch {}
  return '';
}

// Robust helper to read GHL env variables even if Next.js hasn't reloaded .env
export function getGhlEnv(key: 'GHL_WEBHOOK_URL' | 'GHL_API_TOKEN' | 'GHL_LOCATION_ID'): string {
  const envVal = process.env[key]?.replace(/\r/g, '').trim();
  if (envVal && !envVal.startsWith('#')) return envVal;

  const cwd = process.cwd();
  for (const f of ['.env.local', '.env']) {
    const val = parseEnvFile(path.join(cwd, f), key);
    if (val && !val.startsWith('#')) {
      process.env[key] = val;
      return val;
    }
  }
  return '';
}

export const ghlConfigured = () => {
  const rawWebhook = getGhlEnv('GHL_WEBHOOK_URL');
  const webhook = /^https?:\/\//i.test(rawWebhook) ? rawWebhook : '';
  const token = getGhlEnv('GHL_API_TOKEN');
  const loc = getGhlEnv('GHL_LOCATION_ID');
  return Boolean(webhook || (token && loc));
};

export async function pushToGhl(l: Lead): Promise<{ ok: boolean; contactId?: string; error?: string }> {
  const rawWebhook = getGhlEnv('GHL_WEBHOOK_URL');
  const webhookUrl = /^https?:\/\//i.test(rawWebhook) ? rawWebhook : '';
  const apiToken = getGhlEnv('GHL_API_TOKEN');
  const locationId = getGhlEnv('GHL_LOCATION_ID');

  if (!webhookUrl && (!apiToken || !locationId)) {
    console.warn('[ghl] GoHighLevel credentials not found. Check GHL_API_TOKEN and GHL_LOCATION_ID.');
    return { ok: false, error: 'missing_credentials' };
  }

  const [firstName, ...rest] = l.name.trim().split(/\s+/);
  const phone = /^\d{10}$/.test(l.phone) ? `+91${l.phone}` : l.phone;
  const tags = ['Website Lead', ...l.tags];
  if (l.interest) tags.push(`Interest: ${l.interest}`);
  if (l.kycStatus) tags.push(`KYC: ${l.kycStatus}`);
  if (l.occupation) tags.push(`Occupation: ${l.occupation}`);
  if (l.income) tags.push(`Income: ${l.income}`);
  if (l.pan) tags.push(`PAN: ${l.pan.toUpperCase()}`);
  if (l.bestTime) tags.push(`Best Time: ${l.bestTime}`);

  if (webhookUrl) {
    console.log('[ghl] Forwarding lead to GHL Inbound Webhook:', l.name);
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'shukfinch.com',
        ...l,
        firstName: firstName || 'Applicant',
        lastName: rest.join(' '),
        phone,
        tags,
      }),
    });
    if (!r.ok) {
      const err = await r.text().catch(() => '');
      console.error(`[ghl] Webhook error ${r.status}:`, err);
      return { ok: false, error: `Webhook error: ${r.status}` };
    }
    return { ok: true };
  }

  // LeadConnector API v2: create or update the contact
  const payload: Record<string, unknown> = {
    locationId,
    firstName: firstName || 'Applicant',
    phone,
    source: 'shukfinch.com',
    tags,
  };

  if (rest.length > 0) payload.lastName = rest.join(' ');
  if (l.email?.trim()) payload.email = l.email.trim();
  if (l.address?.trim()) payload.address1 = l.address.trim();
  if (l.city?.trim()) payload.city = l.city.trim();
  if (l.postalCode?.trim()) payload.postalCode = l.postalCode.trim();
  if (l.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(l.dateOfBirth.trim())) {
    payload.dateOfBirth = l.dateOfBirth.trim();
  }

  console.log('[ghl] Posting to LeadConnector contacts/upsert for Location:', locationId, {
    name: `${firstName} ${rest.join(' ')}`.trim(),
    phone,
    email: l.email,
  });

  const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await r.text().catch(() => '');
  let data: any = null;
  try {
    data = JSON.parse(responseText);
  } catch {}

  if (!r.ok) {
    console.error(`[ghl] Upsert failed (${r.status}):`, responseText);
    return { ok: false, error: `GHL API ${r.status}: ${responseText}` };
  }

  const contactId = data?.contact?.id;
  console.log('[ghl] Contact upserted successfully! Contact ID:', contactId);

  // If detailed application summary note is provided, attach as a Contact Note in GHL
  if (l.noteBody && contactId) {
    try {
      const noteRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          Version: '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: l.noteBody }),
      });
      if (noteRes.ok) {
        console.log('[ghl] Application summary note attached successfully to Contact:', contactId);
      } else {
        const noteErr = await noteRes.text().catch(() => '');
        console.warn(`[ghl] Note creation status ${noteRes.status}:`, noteErr);
      }
    } catch (noteErr) {
      console.warn('[ghl] Note creation error:', (noteErr as Error).message);
    }
  }

  return { ok: true, contactId };
}

const s = (v: unknown, n = 500) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
export function cleanLead(d: Record<string, unknown>, form: string, tags: string[]): Lead | null {
  const name = s(d.name, 120);
  const phone = s(d.phone, 25).replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)/, '');
  const email = s(d.email, 160);
  if (name.length < 2 || !/^\d{10}$/.test(phone)) return null;
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null;

  return {
    form,
    name,
    phone,
    email: email || undefined,
    interest: s(d.interest),
    kycStatus: s(d.kycStatus),
    city: s(d.city),
    address: s(d.address, 500),
    postalCode: s(d.pin || d.postalCode, 10),
    dateOfBirth: s(d.dob || d.dateOfBirth, 20),
    gender: s(d.gender, 20),
    pan: s(d.pan, 20),
    income: s(d.income, 50),
    occupation: s(d.occupation),
    bestTime: s(d.bestTime),
    message: s(d.message, 1500),
    bankName: s(d.bankName),
    accountType: s(d.accountType),
    accountNumber: s(d.accountNumber),
    ifsc: s(d.ifsc),
    nomineeName: s(d.nomineeName),
    nomineeRel: s(d.nomineeRel),
    verifyMethod: s(d.verifyMethod),
    noteBody: s(d.noteBody, 3000) || undefined,
    tags,
  };
}
