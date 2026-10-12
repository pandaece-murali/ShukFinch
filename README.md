# Shukfinch website (Next.js 14, App Router, TypeScript)

15 pages: `/`, `/about`, `/services`, `/equity`, `/ipos`, `/etfs`, `/demat-trading-account`, `/portfolio`,
`/research`, `/personal-support`, `/trust-security`, `/account-opening`, `/why-shukfinch`, `/investor-corner`, `/contact`.

## Run
```bash
npm install
cp .env.example .env.local   # then fill in the GHL values
npm run dev                  # http://localhost:3000
npm run build && npm start
```
Deploy on Vercel (import the repo, add the env vars in Project Settings).

## Where to edit
- Page text: `lib/pages.ts` (text in `[[double brackets]]` shows as a yellow "to confirm" highlight; delete the brackets when confirmed)
- Phone, email, address, SEBI no.: `lib/site.ts`
- Home page: `app/page.tsx`; styles: `app/globals.css`
- Forms: `components/Forms.tsx` (hero, callback, contact), `components/KycForm.tsx` (4-step KYC)

## Gmail SMTP Configuration (Lead Alerts & Email OTP)
All form submissions and verification OTPs can be delivered using Gmail SMTP:
1. In Google Account settings (Security -> 2-Step Verification), generate a 16-character **App Password** for "Mail".
2. Set the following environment variables in `.env`:
   - `GMAIL_USER=yourbusiness@gmail.com`
   - `GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx`
   - `NOTIFICATION_EMAIL=info@shukfinch.com`
3. Features activated automatically:
   - Real 6-digit email verification OTP sent directly to the client's inbox (`/api/send-otp`).
   - Instant lead email alerts for Hero Quick Apply, Request a Callback, and Contact forms (`/api/lead`).
   - Full KYC applications including uploaded applicant documents (PAN, address proof, photograph, signature, bank proof) emailed directly to `NOTIFICATION_EMAIL` (`/api/kyc`).
   - Instant confirmation email sent to applicants upon submission.

## GoHighLevel
All forms post to our own API routes, so tokens never reach the browser.
- `POST /api/lead` handles the hero, callback and contact forms. `POST /api/kyc` handles the KYC application.
- Option A: in GHL create a Workflow with an **Inbound Webhook** trigger, set `GHL_WEBHOOK_URL`, then map the fields
  (`firstName, lastName, phone, email, interest, kycStatus, city, message, bestTime, tags`) to Create/Update Contact.
- Option B: set `GHL_API_TOKEN` (Private Integration) and `GHL_LOCATION_ID`. The code calls the contacts upsert endpoint
  (verify against the current LeadConnector API docs and add custom field IDs in `lib/ghl.ts`).
- Tags added: Website Lead plus Home Quick Apply / Callback Request / Contact Form / KYC Application.
- Spam: hidden honeypot field and server-side validation. Add a rate limit or Turnstile before launch.

## KYC Application & Compliance
- Mobile OTP was removed in favor of direct email verification and personal phone follow-up by the onboarding team.
- Sensitive KYC data and uploaded documents are delivered securely to `NOTIFICATION_EMAIL` via Gmail SMTP and/or forwarded to `KYC_FORWARD_URL` if configured.
- Consent checkboxes cover Risk Disclosure, Rights and Obligations, Investor Charter, and DPDP Act consent.
