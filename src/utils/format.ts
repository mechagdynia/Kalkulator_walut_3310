import { currencyByCode } from '../data/currencies';
import type { Language } from '../i18n';

export function formatMoney(value: number, code: string, language: Language = 'pl', crypto = false): string {
  const info = currencyByCode(code);
  const absolute = Math.abs(value);
  const maximumFractionDigits = crypto
    ? absolute >= 1000 ? 2 : absolute >= 1 ? 6 : 8
    : info.decimals ?? (absolute >= 100_000 ? 0 : absolute < 0.01 && absolute > 0 ? 6 : 2);
  try {
    return new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'en-US', {
      minimumFractionDigits: crypto ? 0 : Math.min(2, maximumFractionDigits),
      maximumFractionDigits,
      notation: Math.abs(value) >= 1_000_000_000 ? 'compact' : 'standard'
    }).format(value);
  } catch {
    return value.toFixed(maximumFractionDigits);
  }
}

export function formatRateDate(timestamp: number, language: Language = 'pl'): string {
  return new Intl.DateTimeFormat(language === 'pl' ? 'pl-PL' : 'en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestamp);
}
