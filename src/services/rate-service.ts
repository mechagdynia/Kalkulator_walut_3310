import { CURRENCIES } from '../data/currencies';
import { CRYPTOCURRENCIES, isCryptoCode } from '../data/cryptocurrencies';
import type { AssetMode, RateSnapshot } from '../types/currency';
import { readStorage, writeStorage } from './storage';

const FIAT_CACHE_TTL = 60 * 60 * 1000;
const CRYPTO_CACHE_TTL = 5 * 60 * 1000;
const SUPPORTED_CODE = /^[A-Z0-9]{2,10}$/;
const FIAT_CODE = /^[A-Z]{3}$/;
const FIAT_CODES = new Set(CURRENCIES.map((currency) => currency.code));
const CRYPTO_CODES = new Set(CRYPTOCURRENCIES.map((crypto) => crypto.code));

const withTimeout = async (url: string, init: RequestInit = {}, timeout = 2800): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const validateRates = (rates: unknown, base: string): Record<string, number> => {
  if (!rates || typeof rates !== 'object') throw new Error('Nieprawidłowe dane kursów');
  const validated: Record<string, number> = { [base]: 1 };
  for (const [code, value] of Object.entries(rates)) {
    if (SUPPORTED_CODE.test(code) && typeof value === 'number' && Number.isFinite(value) && value > 0) validated[code] = value;
  }
  if (Object.keys(validated).length < 3) throw new Error('Niepełne dane kursów');
  return validated;
};

async function fromFrankfurter(base: string): Promise<RateSnapshot> {
  const response = await withTimeout(`https://api.frankfurter.app/latest?from=${base}`);
  if (!response.ok) throw new Error('Frankfurter error');
  const data = await response.json() as { rates: unknown };
  return { base, rates: validateRates(data.rates, base), fetchedAt: Date.now(), source: 'Frankfurter / ECB', stale: false };
}

async function fromExchangeRateApi(base: string): Promise<RateSnapshot> {
  const response = await withTimeout(`https://open.er-api.com/v6/latest/${base}`);
  if (!response.ok) throw new Error('ExchangeRate API error');
  const data = await response.json() as { rates: unknown };
  return { base, rates: validateRates(data.rates, base), fetchedAt: Date.now(), source: 'ExchangeRate-API', stale: false };
}

async function fromCurrencyApi(base: string): Promise<RateSnapshot> {
  const lower = base.toLowerCase();
  const response = await withTimeout(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${lower}.json`);
  if (!response.ok) throw new Error('Currency API error');
  const data = await response.json() as Record<string, unknown>;
  const raw = data[lower] as Record<string, number> | undefined;
  const upperRates = Object.fromEntries(Object.entries(raw ?? {}).map(([code, value]) => [code.toUpperCase(), value]));
  return { base, rates: validateRates(upperRates, base), fetchedAt: Date.now(), source: 'Currency API', stale: false };
}

async function fromNbp(base: string): Promise<RateSnapshot> {
  const responses = await Promise.allSettled([
    withTimeout('https://api.nbp.pl/api/exchangerates/tables/A/?format=json'),
    withTimeout('https://api.nbp.pl/api/exchangerates/tables/B/?format=json')
  ]);
  const plnPerUnit: Record<string, number> = { PLN: 1 };
  for (const result of responses) {
    if (result.status !== 'fulfilled' || !result.value.ok) continue;
    const data = await result.value.json() as Array<{ rates: Array<{ code: string; mid: number }> }>;
    for (const rate of data[0]?.rates ?? []) plnPerUnit[rate.code] = rate.mid;
  }
  if (!plnPerUnit[base]) throw new Error('NBP does not support base');
  const baseInPln = plnPerUnit[base];
  const rates = Object.fromEntries(Object.entries(plnPerUnit).map(([code, plnValue]) => [code, baseInPln / plnValue]));
  return { base, rates: validateRates(rates, base), fetchedAt: Date.now(), source: 'NBP A+B', stale: false };
}

async function coinbaseRates(base: string): Promise<Record<string, number>> {
  const response = await withTimeout(`https://api.coinbase.com/v2/exchange-rates?currency=${base}`);
  if (!response.ok) throw new Error('Coinbase error');
  const data = await response.json() as { data?: { rates?: Record<string, string> } };
  const rates = Object.fromEntries(
    Object.entries(data.data?.rates ?? {})
      .map(([code, value]): [string, number] => [code, Number(value)])
      .filter(([code, value]) => SUPPORTED_CODE.test(code) && Number.isFinite(value) && value > 0)
  );
  if (Object.keys(rates).length < 3) throw new Error('Coinbase data error');
  return rates;
}

async function fromCoinbase(base: string): Promise<RateSnapshot> {
  const raw = await coinbaseRates(base);
  const rates = Object.fromEntries(Object.entries(raw).filter(([code]) => CRYPTO_CODES.has(code)));
  return { base, rates: validateRates(rates, base), fetchedAt: Date.now(), source: 'Coinbase', stale: false };
}

async function fromMixed(base: string, fiat: string, force: boolean): Promise<RateSnapshot> {
  if (!FIAT_CODES.has(fiat) || (!isCryptoCode(base) && base !== fiat)) throw new Error('Nieprawidłowy zestaw mieszany');
  if (isCryptoCode(base)) {
    const [raw, fiatSnapshot] = await Promise.all([coinbaseRates(base), getRates('USD', force, 'fiat')]);
    const fiatPerUsd = fiatSnapshot.rates[fiat];
    const usdPerBase = raw.USD;
    if (!fiatPerUsd || !usdPerBase) throw new Error('Brak kursu pośredniego');
    const cryptoRates = Object.fromEntries(Object.entries(raw).filter(([code]) => CRYPTO_CODES.has(code)));
    return {
      base,
      rates: validateRates({ ...cryptoRates, [fiat]: usdPerBase * fiatPerUsd }, base),
      fetchedAt: Date.now(),
      source: `Coinbase + ${fiatSnapshot.source}`,
      stale: false
    };
  }
  const [raw, fiatSnapshot] = await Promise.all([coinbaseRates('USD'), getRates(fiat, force, 'fiat')]);
  const usdPerFiat = fiatSnapshot.rates.USD;
  if (!usdPerFiat) throw new Error('Brak kursu pośredniego');
  const cryptoRates = Object.fromEntries(
    Object.entries(raw)
      .filter(([code]) => CRYPTO_CODES.has(code))
      .map(([code, value]) => [code, value * usdPerFiat])
  );
  return {
    base,
    rates: validateRates({ ...cryptoRates, [fiat]: 1 }, base),
    fetchedAt: Date.now(),
    source: `Coinbase + ${fiatSnapshot.source}`,
    stale: false
  };
}

export async function getRates(base: string, force = false, mode: AssetMode = 'fiat', mixedFiat = 'USD'): Promise<RateSnapshot> {
  if (!SUPPORTED_CODE.test(base) || (mode === 'fiat' && !FIAT_CODE.test(base))) throw new Error('Nieprawidłowy kod waluty');
  const cacheKey = mode === 'mixed' ? `rates:${mode}:${base}:${mixedFiat}` : `rates:${mode}:${base}`;
  const cached = readStorage<RateSnapshot | null>(cacheKey, null);
  const cacheTtl = mode === 'fiat' ? FIAT_CACHE_TTL : CRYPTO_CACHE_TTL;
  if (!force && cached && Date.now() - cached.fetchedAt < cacheTtl) return { ...cached, stale: false };

  const providers: Array<() => Promise<RateSnapshot>> = mode === 'crypto'
    ? [() => fromCoinbase(base)]
    : mode === 'mixed'
      ? [() => fromMixed(base, mixedFiat, force)]
      : [() => fromNbp(base), () => fromFrankfurter(base), () => fromExchangeRateApi(base), () => fromCurrencyApi(base)];

  for (const provider of providers) {
    try {
      const snapshot = await provider();
      writeStorage(cacheKey, snapshot);
      return snapshot;
    } catch {
    }
  }

  if (cached) return { ...cached, stale: true };
  throw new Error('Nie udało się pobrać kursów i brak danych offline');
}
