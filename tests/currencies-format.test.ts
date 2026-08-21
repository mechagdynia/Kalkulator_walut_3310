import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { CURRENCIES, DEFAULT_CURRENCIES, flagAsset, currencyByCode } from '../src/data/currencies';
import { formatMoney, formatRateDate } from '../src/utils/format';

describe('katalog walut i formatowanie', () => {
  it('ma unikalne poprawne kody', () => {
    const codes = CURRENCIES.map((currency) => currency.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.every((code) => /^[A-Z]{3}$/.test(code))).toBe(true);
    expect(codes).toHaveLength(149);
  });

  it('zawiera wszystkie waluty domyślne', () => {
    expect(DEFAULT_CURRENCIES.every((code) => CURRENCIES.some((currency) => currency.code === code))).toBe(true);
  });

  it('zapewnia bezpieczny fallback dla nieznanego kodu', () => {
    expect(currencyByCode('XYZ')).toEqual({ code: 'XYZ', name: 'XYZ', countryCode: 'UN', symbol: 'XYZ' });
    expect(flagAsset('UN')).toBe('/flags/un.svg');
    expect(flagAsset('../')).toBe('/flags/un.svg');
  });

  it('ma lokalną flagę Flagpedii dla każdej waluty', () => {
    const root = resolve('.');
    expect(CURRENCIES.every((currency) => existsSync(join(root, 'public', flagAsset(currency.countryCode).replace(/^\//, ''))))).toBe(true);
  });

  it('formatuje kwoty zgodnie z polską lokalizacją', () => {
    expect(formatMoney(1250.5, 'PLN')).toMatch(/1.?250,50/);
    expect(formatMoney(1234, 'JPY')).toMatch(/1.?234/);
  });

  it('skraca kwoty miliardowe', () => {
    expect(formatMoney(1_500_000_000, 'USD').length).toBeLessThan(15);
  });

  it('formatuje poprawną datę kursu', () => {
    expect(formatRateDate(new Date(2026, 7, 21, 12, 30).getTime())).toMatch(/21\.08.*12:30/);
  });
});
