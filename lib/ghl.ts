export type Lead = {
  form: string;
  name: string;
  phone: string;
  email?: string;
  fatherName?: string;
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
  addressProof?: string;
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
export function getGhlEnv(key: string): string {
  const cwd = process.cwd();
  for (const f of ['.env.local', '.env']) {
    const val = parseEnvFile(path.join(cwd, f), key);
    if (val && !val.startsWith('#')) {
      return val;
    }
  }
  const envVal = process.env[key]?.replace(/\r/g, '').trim();
  if (envVal && !envVal.startsWith('#')) return envVal;
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
  // Clean tags only (do NOT append custom field values into tags)
  const tags = [...(l.tags || [])];

  if (webhookUrl) {
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
    type: 'lead',
    country: 'IN',
    timezone: 'Asia/Kolkata',
    website: 'https://shukfinch.com',
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

  // Map custom fields directly by key without fetching IDs from API
  const customFields: Array<Record<string, unknown>> = [];
  const addCustomField = (envKey: string, fallbackKey: string, val: unknown) => {
    if (val === undefined || val === null || String(val).trim() === '') return;
    const cleanVal = String(val).trim();
    const rawKey = getGhlEnv(envKey) || fallbackKey;
    if (!rawKey) return;

    const item: Record<string, unknown> = {
      key: rawKey,
      field_value: cleanVal,
      value: cleanVal,
    };
    if (!rawKey.startsWith('contact.')) {
      item.id = rawKey;
    }
    customFields.push(item);
  };

  addCustomField('GHL_FIELD_FATHER_NAME', 'contact.father_name', l.fatherName);
  addCustomField('GHL_FIELD_GENDER', 'contact.gender', l.gender);
  addCustomField('GHL_FIELD_OCCUPATION', 'contact.occupation', l.occupation);
  addCustomField('GHL_FIELD_ANNUAL_INCOME', 'contact.annual_income', l.income);
  addCustomField('GHL_FIELD_MOST_INTERESTED_SERVICE', 'contact.most_interested_service', l.interest);
  addCustomField('GHL_FIELD_PAN_NUMBER', 'contact.pan_number', l.pan?.toUpperCase());
  addCustomField('GHL_FIELD_ADDRESS_PROOF_TYPE', 'contact.address_proof_type', l.addressProof);
  addCustomField('GHL_FIELD_BANK_NAME', 'contact.bank_name', l.bankName);
  addCustomField('GHL_FIELD_ACCOUNT_TYPE', 'contact.account_type', l.accountType);
  addCustomField('GHL_FIELD_ACCOUNT_NUMBER', 'contact.account_number', l.accountNumber);
  addCustomField('GHL_FIELD_IFSC', 'contact.ifsc', l.ifsc);
  addCustomField('GHL_FIELD_NOMINEE_NAME', 'contact.nominee_name', l.nomineeName);
  addCustomField('GHL_FIELD_NOMINEE_REL', 'contact.nominee_rel', l.nomineeRel);
  addCustomField('GHL_FIELD_MESSAGE', 'contact.message', l.message);

  if (customFields.length > 0) {
    payload.customFields = customFields;
  }

  let r: Response;
  try {
    r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
  } catch (fetchErr) {
    console.error('[ghl] Upsert fetch error:', (fetchErr as Error).message);
    return { ok: false, error: (fetchErr as Error).message };
  }

  // If upsert failed (e.g. 400 Bad Request due to invalid custom field IDs) and customFields were included:
  // Retry without customFields so the contact is still successfully created and all details are preserved in notes!
  if (!r.ok && customFields.length > 0) {
    const errText = await r.text().catch(() => '');
    console.warn(`[ghl] Upsert with custom fields failed (${r.status}): ${errText}. Retrying with core contact fields...`);
    const fallbackPayload = { ...payload };
    delete fallbackPayload.customFields;
    try {
      r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          Version: '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackPayload),
        signal: AbortSignal.timeout(10000),
      });
    } catch (retryErr) {
      console.error('[ghl] Upsert fallback error:', (retryErr as Error).message);
      return { ok: false, error: (retryErr as Error).message };
    }
  }

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
        signal: AbortSignal.timeout(10000),
      });
      if (!noteRes.ok) {
        const noteErr = await noteRes.text().catch(() => '');
        console.warn(`[ghl] Note creation status ${noteRes.status}:`, noteErr);
      } else {
        console.log(`[ghl] Note successfully attached to contact: ${contactId}`);
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
    fatherName: s(d.fatherName, 120),
    interest: s(d.interest),
    kycStatus: s(d.kycStatus),
    city: s(d.city),
    address: s(d.address, 500),
    addressProof: s(d.addressProof, 100),
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
    noteBody: s(d.noteBody, 5000) || undefined,
    tags,
  };
}
