import type { CurrencyCode } from "@/utils/format";

// Fallback rates against USD base in case device is offline
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  IDR: 17722,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.0,
};

const API_URL = "https://open.er-api.com/v6/latest/USD";

export async function fetchLiveExchangeRates(): Promise<
  Record<CurrencyCode, number>
> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API fetch error");
    const data = await res.json();
    if (data && data.rates) {
      return {
        USD: data.rates.USD ?? FALLBACK_RATES.USD,
        IDR: data.rates.IDR ?? FALLBACK_RATES.IDR,
        EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
        GBP: data.rates.GBP ?? FALLBACK_RATES.GBP,
        JPY: data.rates.JPY ?? FALLBACK_RATES.JPY,
      };
    }
    return FALLBACK_RATES;
  } catch {
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
  const fromRate = rates[from] || FALLBACK_RATES[from] || 1;
  const toRate = rates[to] || FALLBACK_RATES[to] || 1;

  // Convert from origin currency to USD, then USD to target currency
  const inUSD = amount / fromRate;
  const inTarget = inUSD * toRate;

  // Round zero-decimal currencies (IDR, JPY) to integer, otherwise 2 decimals
  if (to === "IDR" || to === "JPY") {
    return Math.round(inTarget);
  }
  return Math.round(inTarget * 100) / 100;
}
