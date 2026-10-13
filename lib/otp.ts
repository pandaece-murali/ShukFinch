// In-memory OTP storage with automatic TTL expiry (10 minutes)
type OtpRecord = {
  code: string;
  expiresAt: number;
};

const otpMap = new Map<string, OtpRecord>();

// Clean expired tokens periodically
function cleanExpired() {
  const now = Date.now();
  for (const [email, record] of otpMap.entries()) {
    if (record.expiresAt < now) {
      otpMap.delete(email);
    }
  }
}

export function generateOtp(email: string): string {
  cleanExpired();
  const normalized = email.trim().toLowerCase();
  // 6-digit random number
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpMap.set(normalized, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  return code;
}

export function verifyOtp(email: string, inputCode: string): boolean {
  cleanExpired();
  const normalized = email.trim().toLowerCase();
  const trimmed = (inputCode || '').trim();

  if (!trimmed) return false;

  const record = otpMap.get(normalized);
  if (!record) return false;
  if (record.expiresAt < Date.now()) {
    otpMap.delete(normalized);
    return false;
  }
  const isMatch = record.code === trimmed;
  if (isMatch) {
    otpMap.delete(normalized); // OTP is single-use
  }
  return isMatch;
}
