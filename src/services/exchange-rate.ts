import type { CurrencyCode } from "@/utils/format";

/**
 * Exchange rate utilities.
 *
 * Rates are fetched from open.er-api.com which uses USD as the base currency.
 * Conversion pivot: amount -> USD -> target currency.
 * FALLBACK_RATES are used when API is unavailable or returns partial data.
 */

// Fallback rates against USD base in case device is offline or API fails
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  IDR: 17722,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.0,
};

const API_URL = "https://open.er-api.com/v6/latest/USD";
const FETCH_TIMEOUT_MS = 10000;
const REQUIRED_CURRENCIES: CurrencyCode[] = ["USD", "IDR", "EUR", "GBP", "JPY"];

/**
 * Ensures all required currency codes exist in the rates object.
 * Missing rates are filled from FALLBACK_RATES.
 */
function ensureCompleteRates(rates: Partial<Record<CurrencyCode, number>>): Record<CurrencyCode, number> {
  const complete: Record<CurrencyCode, number> = { ...FALLBACK_RATES };
  for (const code of REQUIRED_CURRENCIES) {
    if (typeof rates[code] === "number" && isFinite(rates[code]!)) {
      complete[code] = rates[code]!;
    }
  }
  return complete;
}

export async function fetchLiveExchangeRates(): Promise<
  Record<CurrencyCode, number>
> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("API fetch error");
    const data = await res.json();
    if (data && data.rates) {
      return ensureCompleteRates(data.rates);
    }
    return FALLBACK_RATES;
  } catch {
    clearTimeout(timeout);
    return FALLBACK_RATES;
  }
}

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number>,
): number {
  if (from === to) return amount;

  // Ensure rates has all required currencies; fall back if missing
  const safeRates = ensureCompleteRates(rates);
  const fromRate = safeRates[from];
  const toRate = safeRates[to];

  // Convert from origin currency to USD, then USD to target currency
  const inUSD = amount / fromRate;
  const inTarget = inUSD * toRate;

  // Round zero-decimal currencies (IDR, JPY) to integer, otherwise 2 decimals
  if (to === "IDR" || to === "JPY") {
    return Math.round(inTarget);
  }
  return Math.round(inTarget * 100) / 100;
}
