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

## GoHighLevel
All forms post to our own API routes, so tokens never reach the browser.
- `POST /api/lead` handles the hero, callback and contact forms. `POST /api/kyc` handles the KYC application.
- Option A: in GHL create a Workflow with an **Inbound Webhook** trigger, set `GHL_WEBHOOK_URL`, then map the fields
  (`firstName, lastName, phone, email, interest, kycStatus, city, message, bestTime, tags`) to Create/Update Contact.
- Option B: set `GHL_API_TOKEN` (Private Integration) and `GHL_LOCATION_ID`. The code calls the contacts upsert endpoint
  (verify against the current LeadConnector API docs and add custom field IDs in `lib/ghl.ts`).
- Tags added: Website Lead plus Home Quick Apply / Callback Request / Contact Form / KYC Application.
- Spam: hidden honeypot field and server-side validation. Add a rate limit or Turnstile before launch.

## KYC data: read before launch
- Only lead details (name, phone, email, interest, city) go to GHL. PAN, date of birth, bank details, nominee, OTPs and
  uploaded documents are **not** sent to GHL.
- Set `KYC_FORWARD_URL` to your KYC provider or secure backend to receive the full form (including files).
  If it is empty, those fields and documents are discarded, so do not go live without it.
- The OTP fields are UI only. Real mobile/email OTP and Aadhaar e-sign need a provider.
- Review DPDP Act consent, privacy policy and data-retention requirements with Shukfinch's compliance officer.
