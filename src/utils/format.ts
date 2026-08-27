export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'GBP' | 'JPY';
export type SeparatorStyle = 'dot' | 'comma';

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

  const formattedNumber = n.toLocaleString(targetLocale);
  return `${config.symbol} ${formattedNumber}`;
}

export function formatDate() {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const day = now.getDate();
  return `${weekday}, ${month} ${day}`;
}

