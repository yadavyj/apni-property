const REFERRAL_COOKIE = "apni_ref";
const REFERRAL_LOCAL_KEY = "apni_ref_key";
export const GUEST_REFERRAL_COOKIE = "apni_guest_referral_token";
const REFERRAL_COOKIE_DAYS = 30;

function normalizeReferral(code) {
  return typeof code === "string" ? code.trim().toUpperCase() : "";
}

export function storeReferralCookie(code) {
  const cleaned = normalizeReferral(code);
  if (typeof document === "undefined" || !cleaned) return false;

  const existing = readReferralCookie();
  if (existing && existing !== cleaned) {
    // keep the original valid referral code to avoid accidental overwrites
    return false;
  }

  const maxAge = REFERRAL_COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(cleaned)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  try {
    localStorage.setItem(REFERRAL_LOCAL_KEY, cleaned);
  } catch {
    // ignore storage quota issues
  }

  return true;
}

export function readReferralCookie() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${REFERRAL_COOKIE}=([^;]*)`));
  if (match) {
    const fromCookie = normalizeReferral(decodeURIComponent(match[1]));
    if (fromCookie) return fromCookie;
  }

  try {
    const stored = normalizeReferral(localStorage.getItem(REFERRAL_LOCAL_KEY) || "");
    if (stored) return stored;
  } catch {
    // ignore storage access issues
  }

  return null;
}

export function clearReferralCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${REFERRAL_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  try {
    localStorage.removeItem(REFERRAL_LOCAL_KEY);
  } catch {
    // ignore storage access issues
  }
}

export function storeGuestReferralToken(token) {
  const cleaned = typeof token === "string" ? token.trim() : "";
  if (typeof document === "undefined" || !cleaned) return false;

  const maxAge = REFERRAL_COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = `${GUEST_REFERRAL_COOKIE}=${encodeURIComponent(cleaned)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  return true;
}

export function readGuestReferralToken() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${GUEST_REFERRAL_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
