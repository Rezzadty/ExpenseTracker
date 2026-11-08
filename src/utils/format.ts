export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'GBP' | 'JPY';
export type SeparatorStyle = 'dot' | 'comma';

// Base currency for storage — all amounts saved in DB as IDR
export const BASE_CURRENCY: CurrencyCode = 'IDR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  locale: string;
  separator: SeparatorStyle;
}

export const CURRENCY_OPTIONS: Record<CurrencyCode, CurrencyConfig> = {
  IDR: { code: 'IDR', symbol: 'Rp', locale: 'id-ID', separator: 'dot' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', separator: 'comma' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', separator: 'dot' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', separator: 'comma' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP', separator: 'comma' },
};

export function formatMoney(
  n: number,
  currency: CurrencyCode = 'IDR',
  separator?: SeparatorStyle,
) {
  const config = CURRENCY_OPTIONS[currency] || CURRENCY_OPTIONS.IDR;
  const targetSeparator = separator ?? config.separator;
  const targetLocale = targetSeparator === 'dot' ? 'id-ID' : 'en-US';

  const safeNum = isNaN(n) || !isFinite(n) ? 0 : n;
  const isZeroDecimal = currency === 'IDR' || currency === 'JPY';
  const formattedNumber = safeNum.toLocaleString(targetLocale, {
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  });
  return `${config.symbol} ${formattedNumber}`;
}

export function formatDate(dateInput?: Date | string) {
  const date = dateInput
    ? typeof dateInput === 'string'
      ? new Date(dateInput)
      : dateInput
    : new Date();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const day = date.getDate();
  return `${weekday}, ${month} ${day}`;
}

