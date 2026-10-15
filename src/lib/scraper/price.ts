/** Egyptian, Arabic, and Latin price parsing ported from Harvest. */

const CURRENCY =
  "(?:(?<![A-Za-z\\u0600-\\u06FF])(?:" +
  "EGP|USD|SAR|AED|EUR|GBP|CAD|AUD|QAR|KWD|BHD|OMR|TRY|INR|LE|L\\.E\\.?|" +
  "جنيهات|جنيهين|جنيهًا|جنيهآ|جنيها|جنيةات|جنيات|جنيةًا|جنيةآ|جنيه|جنية|" +
  "جنيه\\s*مصري|جنيه\\s*مصرى|جنيه\\s*مصريًا|جنية\\s*مصري|جنية\\s*مصرى|" +
  "ج\\.م\\.|ج\\.م|ج\\s*م|جم|" +
  "قروش|قرش|" +
  "ريال|درهم|دينار" +
  ")(?![A-Za-z\\u0600-\\u06FF])" +
  "|E£|£E|US\\$|\\$|€|£|¥|₹|" +
  "د\\.إ|ر\\.س|ج\\.م)";

const NUMBER = "(?:\\d{1,3}(?:[,\\s]\\d{3})+(?:[.,]\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?)";

export const PRICE_RE = new RegExp(
  "(?:" + CURRENCY + "\\s*" + NUMBER + "|" + NUMBER + "\\s*" + CURRENCY + "|" + NUMBER + "\\s*(?:EGP|SAR|AED|USD)+)",
  "i",
);

const DUP_CURRENCY = /(EGP|USD|SAR|AED|EUR|GBP|CAD|AUD|QAR|KWD|BHD|OMR|TRY|INR|LE|جنيه|جنية)\1/gi;

export function norm(s: string | null | undefined): string {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

export function prepPriceText(t: string): string {
  return String(t || "")
    .replace(/[\u0660-\u0669]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30))
    .replace(/[\u06F0-\u06F9]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 0x30))
    .replace(/\s+/g, " ")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(DUP_CURRENCY, "$1")
    .replace(/(EGP|USD|SAR|AED|EUR|GBP|LE)(?=\s*\1)/gi, "")
    .replace(/(جنيه|جنية)\s*(?:مصري|مصرى|مصريًا)/g, "$1")
    .trim();
}

export function looksPrice(t: string): boolean {
  const s = prepPriceText(norm(t));
  if (s.length < 2 || s.length > 80 || /%/.test(s) || /^[0-5][.,]\d$/.test(s)) return false;
  return PRICE_RE.test(s);
}

export function cleanPrice(t: string): string {
  const s = prepPriceText(norm(t));
  const m = s.match(PRICE_RE);
  const out = m ? norm(m[0]) : s.slice(0, 56);
  return out.replace(/(EGP|SAR|AED|USD)(?:\1)+/gi, "$1").replace(/(\d)([A-Za-z])/g, "$1 $2");
}
