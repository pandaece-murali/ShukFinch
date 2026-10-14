import fs from 'fs';
import path from 'path';
import nodemailer, { type SendMailOptions } from 'nodemailer';
import type { Lead } from './ghl';
import { SITE } from './site';

// Helper to read env variables with disk fallback
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

// Helper to read env variables with disk fallback
export function getEmailEnv(key: string): string {
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

export function isEmailConfigured(): boolean {
  return Boolean(getEmailEnv('GMAIL_USER') && getEmailEnv('GMAIL_APP_PASSWORD'));
}

export function getTransporter() {
  const user = getEmailEnv('GMAIL_USER');
  const pass = getEmailEnv('GMAIL_APP_PASSWORD')?.replace(/\s+/g, '');
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

const getSender = () => {
  const user = getEmailEnv('GMAIL_USER') || SITE.email;
  return `"Shukfinch Support" <${user}>`;
};

export const getAdminRecipient = () => {
  return getEmailEnv('NOTIFICATION_EMAIL') || getEmailEnv('GMAIL_USER') || SITE.email;
};

export const getKycCcRecipients = (): string | undefined => {
  const cc = getEmailEnv('KYC_NOTIFICATION_CC') || getEmailEnv('NOTIFICATION_CC');
  return cc && cc.includes('@') && !cc.startsWith('#') ? cc.trim() : undefined;
};

export const getKycBccRecipients = (): string | undefined => {
  const bcc = getEmailEnv('KYC_NOTIFICATION_BCC') || getEmailEnv('NOTIFICATION_BCC');
  return bcc && bcc.includes('@') && !bcc.startsWith('#') ? bcc.trim() : undefined;
};

export const getLeadCcRecipients = (): string | undefined => {
  const cc = getEmailEnv('LEAD_NOTIFICATION_CC') || getEmailEnv('NOTIFICATION_CC');
  return cc && cc.includes('@') && !cc.startsWith('#') ? cc.trim() : undefined;
};

export const getLeadBccRecipients = (): string | undefined => {
  const bcc = getEmailEnv('LEAD_NOTIFICATION_BCC') || getEmailEnv('NOTIFICATION_BCC');
  return bcc && bcc.includes('@') && !bcc.startsWith('#') ? bcc.trim() : undefined;
};

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(`[email] Gmail not configured (check GMAIL_USER & GMAIL_APP_PASSWORD)`);
    return true; // dev fallback
  }

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #dce3ee; border-radius: 14px; background: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h2 style="color: #0A1D37; margin: 0; font-size: 24px;">Shuk<span style="color: #1976FF;">Finch</span></h2>
        <p style="color: #51627A; font-size: 13px; margin: 4px 0 0;">SEBI Reg. ${SITE.sebi} · BSE Member ${SITE.bse}</p>
      </div>
      <div style="padding: 24px 0;">
        <h3 style="color: #0A1D37; margin: 0 0 12px; font-size: 20px;">Email Verification Code</h3>
        <p style="color: #333; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
          Use the 6-digit verification code below to complete your Shukfinch account application.
        </p>
        <div style="background: #F5F7FA; border: 2px dashed #1976FF; border-radius: 10px; padding: 18px; text-align: center; margin: 20px 0;">
          <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0D47A1; display: inline-block;">${otpCode}</span>
        </div>
        <p style="color: #666; font-size: 13px; line-height: 1.4; margin: 16px 0 0;">
          This code is valid for 10 minutes. If you did not initiate this request, you can safely ignore this email.
        </p>
      </div>
      <div style="border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #778899; text-align: center;">
        <p style="margin: 0 0 6px;">Questions? Reach us at <b>${SITE.phone}</b> or <a href="mailto:${SITE.email}" style="color: #1976FF;">${SITE.email}</a></p>
        <p style="margin: 0;">${SITE.address}</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: getSender(),
      to: toEmail,
      subject: `Your Shukfinch Verification Code: ${otpCode}`,
      html,
    });
    return true;
  } catch (err) {
    console.error('[email] Error sending OTP:', err);
    return false;
  }
}

export async function sendLeadAlertEmail(lead: Lead): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[email] Gmail transporter not configured (check GMAIL_USER & GMAIL_APP_PASSWORD)');
    return false;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dce3ee; border-radius: 12px;">
      <h2 style="color: #0A1D37; border-bottom: 2px solid #00C833; padding-bottom: 8px;">New Lead Received (${lead.form})</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr style="background: #f9fbfd;"><td style="padding: 10px; font-weight: bold; width: 35%;">Full Name:</td><td style="padding: 10px;">${lead.name}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Phone:</td><td style="padding: 10px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
        <tr style="background: #f9fbfd;"><td style="padding: 10px; font-weight: bold;">Email:</td><td style="padding: 10px;">${lead.email || 'N/A'}</td></tr>
        ${lead.interest ? `<tr><td style="padding: 10px; font-weight: bold;">Interest:</td><td style="padding: 10px;">${lead.interest}</td></tr>` : ''}
        ${lead.kycStatus ? `<tr style="background: #f9fbfd;"><td style="padding: 10px; font-weight: bold;">KYC Status:</td><td style="padding: 10px;">${lead.kycStatus}</td></tr>` : ''}
        ${lead.bestTime ? `<tr><td style="padding: 10px; font-weight: bold;">Best Time to Call:</td><td style="padding: 10px;">${lead.bestTime}</td></tr>` : ''}
        ${lead.city ? `<tr style="background: #f9fbfd;"><td style="padding: 10px; font-weight: bold;">City:</td><td style="padding: 10px;">${lead.city}</td></tr>` : ''}
        ${lead.message ? `<tr><td style="padding: 10px; font-weight: bold;">Message:</td><td style="padding: 10px;">${lead.message}</td></tr>` : ''}
        <tr style="background: #f9fbfd;"><td style="padding: 10px; font-weight: bold;">Form Source:</td><td style="padding: 10px;">${lead.form} (${lead.tags.join(', ')})</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Received At:</td><td style="padding: 10px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
      </table>
    </div>
  `;

  try {
    const mailOptions: SendMailOptions = {
      from: getSender(),
      to: getAdminRecipient(),
      subject: `[New Lead - ${lead.form}] ${lead.name} (${lead.phone})`,
      html,
    };
    const cc = getLeadCcRecipients();
    if (cc) mailOptions.cc = cc;
    const bcc = getLeadBccRecipients();
    if (bcc) mailOptions.bcc = bcc;

    await transporter.sendMail(mailOptions);
    console.log(`[email] Lead alert sent to: ${getAdminRecipient()}${cc ? ` (CC: ${cc})` : ''}${bcc ? ` (BCC: ${bcc})` : ''}`);
    return true;
  } catch (err) {
    console.error('[email] Error sending lead alert:', err);
    return false;
  }
}

export type AttachmentItem = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export async function sendKycAlertEmail(
  fields: Record<string, string>,
  attachments: AttachmentItem[] = []
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[email] Gmail transporter not configured for KYC alert (check GMAIL_USER & GMAIL_APP_PASSWORD)');
    return false;
  }

  const rows = Object.entries(fields)
    .filter(([k]) => !['website', 'form'].includes(k))
    .map(([k, v], idx) => `
      <tr style="${idx % 2 === 0 ? 'background: #f9fbfd;' : ''}">
        <td style="padding: 8px 12px; font-weight: 600; text-transform: capitalize; color: #444; width: 40%; border-bottom: 1px solid #eee;">${k.replace(/([A-Z])/g, ' $1')}:</td>
        <td style="padding: 8px 12px; color: #111; border-bottom: 1px solid #eee;">${v || 'N/A'}</td>
      </tr>
    `).join('');

  const docList = attachments.length
    ? `<div style="margin-top: 18px; padding: 12px; background: #eef7ff; border-radius: 8px;">
         <b style="color: #0D47A1;">Attached Documents (${attachments.length}):</b>
         <ul style="margin: 6px 0 0; padding-left: 20px; font-size: 13px;">
           ${attachments.map((a) => `<li>${a.filename}</li>`).join('')}
         </ul>
       </div>`
    : '<p style="color: #777; font-size: 13px;">No document attachments provided.</p>';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #dce3ee; border-radius: 12px;">
      <h2 style="color: #0A1D37; border-bottom: 3px solid #00C833; padding-bottom: 8px; margin-top: 0;">New Account Opening Application (KYC)</h2>
      <p style="color: #555; font-size: 14px;">An applicant has submitted an online account opening & KYC application on shukfinch.com.</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; margin-top: 14px;">
        ${rows}
      </table>
      ${docList}
      <p style="font-size: 12px; color: #888; margin-top: 20px;">Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    </div>
  `;

  try {
    const mailOptions: SendMailOptions = {
      from: getSender(),
      to: getAdminRecipient(),
      subject: `[KYC Application] ${fields.name || 'New Applicant'} - ${fields.phone || ''}`,
      html,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    };
    const cc = getKycCcRecipients();
    if (cc) mailOptions.cc = cc;
    const bcc = getKycBccRecipients();
    if (bcc) mailOptions.bcc = bcc;

    await transporter.sendMail(mailOptions);
    console.log(`[email] KYC alert sent to: ${getAdminRecipient()}${cc ? ` (CC: ${cc})` : ''}${bcc ? ` (BCC: ${bcc})` : ''}`);
    return true;
  } catch (err) {
    console.error('[email] Error sending KYC alert email:', err);
    return false;
  }
}

export async function sendClientConfirmationEmail(
  toEmail: string,
  clientName: string
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #dce3ee; border-radius: 14px;">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #eee;">
        <h2 style="color: #0A1D37; margin: 0;">Shuk<span style="color: #1976FF;">Finch</span></h2>
        <p style="color: #51627A; font-size: 13px; margin: 4px 0 0;">SEBI Reg. ${SITE.sebi} · BSE Member ${SITE.bse}</p>
      </div>
      <div style="padding: 22px 0;">
        <h3 style="color: #0A1D37; margin: 0 0 10px;">Thank you for your application, ${clientName}!</h3>
        <p style="color: #333; font-size: 14.5px; line-height: 1.6;">
          We have successfully received your Shukfinch account opening and KYC details. Our verification team is reviewing your documents.
        </p>
        <div style="background: #F0FBF2; border-left: 4px solid #00C833; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 18px 0;">
          <p style="margin: 0; font-weight: 600; color: #04210C; font-size: 14px;">Next steps:</p>
          <p style="margin: 6px 0 0; color: #2B5738; font-size: 13.5px;">
            A representative from our onboarding desk will contact you on your registered mobile number if any clarification is needed. Your account will typically be activated within 24 to 48 working hours.
          </p>
        </div>
        <p style="color: #555; font-size: 13.5px; line-height: 1.5;">
          If you have any questions or want to check your application status, feel free to call our desk at <b>${SITE.phone}</b>.
        </p>
      </div>
      <div style="border-top: 1px solid #eee; padding-top: 14px; font-size: 12px; color: #8899A6; text-align: center;">
        <p style="margin: 0;">${SITE.address}</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: getSender(),
      to: toEmail,
      subject: `Shukfinch Account Application Received - Welcome, ${clientName}`,
      html,
    });
    return true;
  } catch (err) {
    console.error('[email] Error sending client confirmation:', err);
    return false;
  }
}
