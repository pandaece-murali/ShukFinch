'use client';
import { useRef, useState } from 'react';
import { F, Thanks, type FP } from './Forms';
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
    t: 'Declaration and submit',
    s: 'Final step. Confirm your details and accept terms to complete your application.',
    extra: 'consent',
    f: [],
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

  const last = i === STEPS.length - 1;

  function valid() {
    const els = ref.current!.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      `[data-step="${i}"] input, [data-step="${i}"] select`
    );
    return Array.from(els).every((el) => el.reportValidity());
  }

  async function next() {
    if (!valid()) return;
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

      {st === 'error' && (
        <div style={{ background: '#FFF0F0', border: '1px solid #FF8E8E', borderRadius: 10, padding: '12px 16px', margin: '16px 0', color: '#D32F2F', fontSize: 14, fontWeight: 600 }}>
          ⚠️ Error: {errMsg || `We could not submit right now. Please try again or call ${SITE.phone}.`}
        </div>
      )}

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
