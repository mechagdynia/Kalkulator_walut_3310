import { CRYPTOCURRENCIES } from '../data/cryptocurrencies';
import type { AssetMode, RateSnapshot } from '../types/currency';
import { readStorage, writeStorage } from './storage';

const FIAT_CACHE_TTL = 60 * 60 * 1000;
const CRYPTO_CACHE_TTL = 5 * 60 * 1000;
const SUPPORTED_CODE = /^[A-Z0-9]{2,10}$/;
const FIAT_CODE = /^[A-Z]{3}$/;

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

async function fromCoinbase(base: string): Promise<RateSnapshot> {
  const response = await withTimeout(`https://api.coinbase.com/v2/exchange-rates?currency=${base}`);
  if (!response.ok) throw new Error('Coinbase error');
  const data = await response.json() as { data?: { rates?: Record<string, string> } };
  const supported = new Set(CRYPTOCURRENCIES.map((crypto) => crypto.code));
  const rates = Object.fromEntries(
    Object.entries(data.data?.rates ?? {})
      .filter(([code]) => supported.has(code))
      .map(([code, value]) => [code, Number(value)])
  );
  return { base, rates: validateRates(rates, base), fetchedAt: Date.now(), source: 'Coinbase', stale: false };
}

export async function getRates(base: string, force = false, mode: AssetMode = 'fiat'): Promise<RateSnapshot> {
  if (!SUPPORTED_CODE.test(base) || (mode === 'fiat' && !FIAT_CODE.test(base))) throw new Error('Nieprawidłowy kod waluty');
  const cacheKey = `rates:${mode}:${base}`;
  const cached = readStorage<RateSnapshot | null>(cacheKey, null);
  const cacheTtl = mode === 'crypto' ? CRYPTO_CACHE_TTL : FIAT_CACHE_TTL;
  if (!force && cached && Date.now() - cached.fetchedAt < cacheTtl) return { ...cached, stale: false };

  const providers: Array<() => Promise<RateSnapshot>> = mode === 'crypto'
    ? [() => fromCoinbase(base)]
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
