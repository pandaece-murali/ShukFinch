'use client';
import { useRef, useState, useEffect } from 'react';
import { F, Honeypot, Thanks, type FP } from './Forms';
import { INT, SITE } from '@/lib/site';

const STEPS: { t: string; s: string; f: FP[]; extra?: 'nominee' | 'consent' }[] = [
  {
    t: 'Personal details',
    s: 'Tell us about yourself, exactly as on your PAN.',
    f: [
      { label: 'Full name (as per PAN)', name: 'name', req: true },
      { label: "Father's / spouse's name", name: 'fatherName', req: true },
      { label: 'Date of birth', name: 'dob', type: 'date', req: true },
      { label: 'Gender', name: 'gender', opts: ['Male', 'Female', 'Other'] },
      { label: 'Mobile number', name: 'phone', type: 'tel', req: true, ph: '10-digit mobile' },
      { label: 'Email', name: 'email', type: 'email', req: true, ph: 'you@example.com' },
      { label: 'Occupation', name: 'occupation', opts: ['Salaried', 'Self-employed', 'Business', 'Student', 'Homemaker', 'Retired'] },
      { label: 'Annual income', name: 'income', opts: ['Below 1 lakh', '1-5 lakh', '5-10 lakh', '10-25 lakh', 'Above 25 lakh'] },
      { label: 'I am most interested in', name: 'interest', opts: INT, full: true },
    ],
  },
  {
    t: 'KYC details and documents',
    s: 'Upload clear copies. PDF, JPG or PNG.',
    f: [
      { label: 'PAN number', name: 'pan', req: true, max: 10, upper: true, ph: 'ABCDE1234F' },
      { label: 'Address proof type', name: 'addressProof', opts: ['Aadhaar', 'Passport', 'Voter ID', 'Driving licence'] },
      { label: 'Current address', name: 'address', req: true, full: true, ph: 'House, street, area' },
      { label: 'City', name: 'city', req: true },
      { label: 'PIN code', name: 'pin', req: true, max: 6 },
      { label: 'PAN card copy', name: 'filePan', type: 'file', req: true },
      { label: 'Address proof copy', name: 'fileAddress', type: 'file', req: true },
      { label: 'Recent photograph', name: 'filePhoto', type: 'file', req: true },
      { label: 'Signature on white paper', name: 'fileSign', type: 'file', req: true },
    ],
  },
  {
    t: 'Bank and nomination',
    s: 'Your bank account is used for pay-in and pay-out.',
    extra: 'nominee',
    f: [
      { label: 'Bank name', name: 'bankName', req: true },
      { label: 'Account type', name: 'accountType', opts: ['Savings', 'Current'] },
      { label: 'Account number', name: 'accountNumber', req: true },
      { label: 'IFSC code', name: 'ifsc', req: true, max: 11, upper: true, ph: 'e.g. HDFC0000001' },
      { label: 'Cancelled cheque or bank statement', name: 'fileBank', type: 'file', req: true, full: true },
    ],
  },
  {
    t: 'Verify and submit',
    s: 'Final step. Complete email verification before activating your account.',
    extra: 'consent',
    f: [
      {
        label: 'Verification method',
        name: 'verifyMethod',
        opts: ['Aadhaar e-sign', 'Digilocker', 'Video verification with our team'],
        full: true,
      },
    ],
  },
];

const NOM: FP[] = [
  { label: 'Nominee name', name: 'nomineeName' },
  { label: 'Relationship', name: 'nomineeRel' },
  { label: 'Nominee date of birth', name: 'nomineeDob', type: 'date' },
  { label: 'Share (%)', name: 'nomineeShare', ph: '100' },
];

export function KycForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [i, setI] = useState(0);
  const [st, setSt] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  // Email OTP states
  const [userEmail, setUserEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpStatus, setOtpStatus] = useState('');
  const [countdown, setCountdown] = useState(0);

  const last = i === STEPS.length - 1;

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (countdown > 0) {
      t = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [countdown]);

  function syncEmail() {
    const emailEl = ref.current?.querySelector<HTMLInputElement>('input[name="email"]');
    if (emailEl?.value) setUserEmail(emailEl.value.trim());
  }

  function valid() {
    const els = ref.current!.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      `[data-step="${i}"] input, [data-step="${i}"] select`
    );
    return Array.from(els).every((el) => el.reportValidity());
  }

  async function sendEmailOtp() {
    syncEmail();
    const email = userEmail || ref.current?.querySelector<HTMLInputElement>('input[name="email"]')?.value?.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setOtpStatus('Please enter a valid email address in Step 1 first.');
      return;
    }
    setOtpBusy(true);
    setOtpStatus('Sending verification code...');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setOtpSent(true);
        setCountdown(45);
        setOtpStatus(
          data.devCode
            ? `Verification code sent! (Dev code: ${data.devCode})`
            : 'Verification code sent to your email. Please check your inbox / spam.'
        );
      } else {
        setOtpStatus(data.error || 'Failed to send verification code. Please try again.');
      }
    } catch {
      setOtpStatus('Network error while sending OTP. Please try again.');
    } finally {
      setOtpBusy(false);
    }
  }

  async function next() {
    if (!valid()) return;
    syncEmail();
    if (!last) {
      setI(i + 1);
      ref.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }

    setSt('busy');
    setErrMsg('');
    try {
      const fd = new FormData(ref.current!);
      fd.set('form', 'kyc-application');
      const r = await fetch('/api/kyc', { method: 'POST', body: fd });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        throw new Error(data.message || data.error || 'Submission failed');
      }
      setSt('done');
    } catch (err: any) {
      setErrMsg(err?.message || `We could not submit right now. Please try again or call ${SITE.phone}.`);
      setSt('error');
    }
  }

  if (st === 'done') {
    return (
      <div className="fcard">
        <Thanks
          msg={`Your application is submitted. Our compliance team will verify your details and call you on your mobile number. A confirmation email has also been sent to your inbox. Questions? Call ${SITE.phone}.`}
        />
      </div>
    );
  }

  return (
    <form ref={ref} className="fcard" onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="pl">
        <span>Step {i + 1} of {STEPS.length}</span>
        <span>Takes about 10 minutes</span>
      </div>
      <div className="prog">
        {STEPS.map((_, j) => (
          <i key={j} className={j <= i ? 'on' : ''} />
        ))}
      </div>

      {STEPS.map((s, j) => (
        <div key={s.t} className={'fs' + (j === i ? ' on' : '')} data-step={j}>
          <h3>{s.t}</h3>
          <p>{s.s}</p>
          <div className="fg2">
            {/* Step 4 custom Email OTP section */}
            {j === 3 && (
              <div className="full" style={{ marginBottom: 16 }}>
                <div style={{ background: 'var(--tint)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Email Verification</span>
                      <p style={{ fontSize: 13, color: 'var(--mute)', margin: '2px 0 0' }}>
                        {userEmail ? `Verify code for ${userEmail}` : 'Code will be sent to the email provided in Step 1.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn bblue"
                      onClick={sendEmailOtp}
                      disabled={otpBusy || countdown > 0}
                      style={{ padding: '8px 16px', fontSize: 13, minWidth: 120, height: 38 }}
                    >
                      {otpBusy ? 'Sending...' : countdown > 0 ? `Resend (${countdown}s)` : otpSent ? 'Resend Code' : 'Send Code to Email'}
                    </button>
                  </div>
                  {otpStatus && (
                    <p style={{ fontSize: 12.5, color: otpStatus.includes('failed') || otpStatus.includes('Please enter') ? '#E5484D' : '#058A25', marginTop: 8, fontWeight: 600 }}>
                      {otpStatus}
                    </p>
                  )}
                </div>

                <label className="f" style={{ marginBottom: 0 }}>
                  <span>Email Verification OTP *</span>
                  <input
                    name="emailOtp"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code received on email"
                    style={{ letterSpacing: '4px', fontWeight: 700, fontSize: 16 }}
                  />
                </label>
              </div>
            )}

            {s.f.map((f) => (
              <F key={f.name} {...f} />
            ))}

            {s.extra === 'nominee' && (
              <>
                <div className="full">
                  <b style={{ fontSize: 14 }}>Nomination</b>
                  <div className="rad">
                    <label>
                      <input type="radio" name="nomination" value="add" defaultChecked /> Add a nominee
                    </label>
                    <label>
                      <input type="radio" name="nomination" value="opt-out" /> Opt out of nomination
                    </label>
                  </div>
                </div>
                {NOM.map((f) => (
                  <F key={f.name} {...f} />
                ))}
              </>
            )}

            {s.extra === 'consent' && (
              <div className="full" style={{ marginTop: 12 }}>
                {[
                  'I have read the Risk Disclosure, Rights and Obligations and Investor Charter.',
                  'I confirm the details and documents are mine and accurate.',
                  'I agree to be contacted by Shukfinch about my application.',
                ].map((t, k) => (
                  <label key={k} className="cons">
                    <input type="checkbox" name={'consent' + k} required /> {t}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <Honeypot />
      {st === 'error' && <p className="fe">{errMsg || `We could not submit right now. Please try again or call ${SITE.phone}.`}</p>}

      <div className="fb">
        <button
          className="btn b2"
          type="button"
          onClick={() => {
            setI(i - 1);
            ref.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }}
          style={{ color: 'var(--ink)', visibility: i ? 'visible' : 'hidden' }}
        >
          Back
        </button>
        <button className="btn b1" type="button" onClick={next} disabled={st === 'busy'}>
          {last ? (st === 'busy' ? 'Submitting Application...' : 'Submit Application') : 'Continue'}
        </button>
      </div>
      <p className="rk" style={{ marginTop: 20, paddingTop: 14 }}>
        Need help? Call {SITE.phone}.
      </p>
    </form>
  );
}
