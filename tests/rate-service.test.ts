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
    localStorage.setItem('waluta3310:rates:PLN', JSON.stringify({
      base: 'PLN', rates: { PLN: 1, EUR: 0.23, USD: 0.25 }, fetchedAt: Date.now(), source: 'cache', stale: false
    }));
    const result = await getRates('PLN');
    expect(result.source).toBe('cache');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('pobiera i waliduje główne źródło', async () => {
    vi.mocked(fetch).mockResolvedValue(response({ rates: { EUR: 0.23, USD: 0.25, BAD: -1, ABC: 'x' } }));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('Frankfurter / ECB');
    expect(result.rates).toEqual({ PLN: 1, EUR: 0.23, USD: 0.25 });
    expect(JSON.parse(localStorage.getItem('waluta3310:rates:PLN') ?? '{}').source).toBe('Frankfurter / ECB');
  });

  it('przełącza się z Frankfurter na NBP', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({}, false, 503))
      .mockResolvedValueOnce(response([{ rates: [{ code: 'EUR', mid: 4 }, { code: 'USD', mid: 5 }] }]));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('NBP');
    expect(result.rates.EUR).toBe(0.25);
    expect(result.rates.USD).toBe(0.2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('używa trzeciego źródła po dwóch błędach', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response([], true))
      .mockResolvedValueOnce(response({ rates: { PLN: 1, EUR: 0.23, USD: 0.25 } }));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('ExchangeRate-API');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('normalizuje małe kody czwartego źródła', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response([], true))
      .mockResolvedValueOnce(response({}, false, 500))
      .mockResolvedValueOnce(response({ pln: { eur: 0.23, usd: 0.25 } }));
    const result = await getRates('PLN', true);
    expect(result.source).toBe('Currency API');
    expect(result.rates.EUR).toBe(0.23);
  });

  it('wraca do przeterminowanego cache po awarii wszystkich źródeł', async () => {
    localStorage.setItem('waluta3310:rates:PLN', JSON.stringify({
      base: 'PLN', rates: { PLN: 1, EUR: 0.2, USD: 0.24 }, fetchedAt: 1, source: 'old', stale: false
    }));
    vi.mocked(fetch).mockRejectedValue(new TypeError('offline'));
    const result = await getRates('PLN', true);
    expect(result.stale).toBe(true);
    expect(result.source).toBe('old');
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('zgłasza brak kursów bez cache', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('offline'));
    await expect(getRates('PLN', true)).rejects.toThrow('brak danych offline');
  });

  it('odrzuca nieprawidłowy kod bazy przed połączeniem', async () => {
    await expect(getRates('../', true)).rejects.toThrow('Nieprawidłowy kod waluty');
    expect(fetch).not.toHaveBeenCalled();
  });
});
