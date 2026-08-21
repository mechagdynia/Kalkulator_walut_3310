import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRates } from '../src/services/rate-service';

const response = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: vi.fn().mockResolvedValue(body)
}) as unknown as Response;

describe('getRates', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('zwraca świeży cache bez połączenia', async () => {
    localStorage.setItem('waluta3310:rates:fiat:PLN', JSON.stringify({
      base: 'PLN', rates: { PLN: 1, EUR: 0.23, USD: 0.25 }, fetchedAt: Date.now(), source: 'cache', stale: false
    }));
    const result = await getRates('PLN');
    expect(result.source).toBe('cache');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('łączy tabele A i B głównego źródła NBP', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response([{ rates: [{ code: 'EUR', mid: 4 }, { code: 'USD', mid: 5 }] }]))
      .mockResolvedValueOnce(response([{ rates: [{ code: 'AFN', mid: 0.05 }, { code: 'PAB', mid: 4 }] }]));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('NBP A+B');
    expect(result.rates).toMatchObject({ PLN: 1, EUR: 0.25, USD: 0.2, AFN: 20, PAB: 0.25 });
    expect(JSON.parse(localStorage.getItem('waluta3310:rates:fiat:PLN') ?? '{}').source).toBe('NBP A+B');
  });

  it('obsługuje walutę bazową z tabeli B NBP', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response([{ rates: [{ code: 'EUR', mid: 4 }, { code: 'USD', mid: 5 }] }]))
      .mockResolvedValueOnce(response([{ rates: [{ code: 'AFN', mid: 0.05 }, { code: 'PAB', mid: 4 }] }]));
    const result = await getRates('AFN', true);
    expect(result.source).toBe('NBP A+B');
    expect(result.rates.AFN).toBe(1);
    expect(result.rates.PLN).toBe(0.05);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('przełącza się na Frankfurter po błędzie obu tabel NBP', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({ rates: { PLN: 1, EUR: 0.23, USD: 0.25 } }));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('Frankfurter / ECB');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('używa ExchangeRate API po błędzie NBP i Frankfurter', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({ rates: { PLN: 1, EUR: 0.23, USD: 0.25 } }));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('ExchangeRate-API');
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('normalizuje małe kody czwartego źródła', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({ pln: { eur: 0.23, usd: 0.25 } }));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('Currency API');
    expect(result.rates.EUR).toBe(0.23);
  });

  it('wraca do przeterminowanego cache po awarii wszystkich źródeł', async () => {
    localStorage.setItem('waluta3310:rates:fiat:PLN', JSON.stringify({
      base: 'PLN', rates: { PLN: 1, EUR: 0.2, USD: 0.24 }, fetchedAt: 1, source: 'old', stale: false
    }));
    vi.mocked(fetch).mockRejectedValue(new TypeError('offline'));
    const result = await getRates('PLN', true);
    expect(result.stale).toBe(true);
    expect(result.source).toBe('old');
    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it('zgłasza brak kursów bez cache', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('offline'));
    await expect(getRates('PLN', true)).rejects.toThrow('brak danych offline');
  });

  it('pobiera kursy kryptowalut z Coinbase i zapisuje osobny cache', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ data: { rates: { BTC: '1', ETH: '18.5', USDT: '65432.1', EUR: '60000' } } }));
    const result = await getRates('BTC', true, 'crypto');
    expect(result.source).toBe('Coinbase');
    expect(result.rates).toMatchObject({ BTC: 1, ETH: 18.5, USDT: 65432.1 });
    expect(result.rates.EUR).toBeUndefined();
    expect(JSON.parse(localStorage.getItem('waluta3310:rates:crypto:BTC') ?? '{}').source).toBe('Coinbase');
  });

  it('odrzuca nieprawidłowy kod bazy przed połączeniem', async () => {
    await expect(getRates('../', true)).rejects.toThrow('Nieprawidłowy kod waluty');
    expect(fetch).not.toHaveBeenCalled();
  });
});
