import { currencyByCode } from '../data/currencies';

export function formatMoney(value: number, code: string): string {
  const info = currencyByCode(code);
  const maximumFractionDigits = info.decimals ?? (Math.abs(value) >= 100_000 ? 0 : 2);
  try {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: Math.min(2, maximumFractionDigits),
      maximumFractionDigits,
      notation: Math.abs(value) >= 1_000_000_000 ? 'compact' : 'standard'
    }).format(value);
  } catch {
    return value.toFixed(maximumFractionDigits);
  }
}

export function formatRateDate(timestamp: number): string {
  return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestamp);
}
