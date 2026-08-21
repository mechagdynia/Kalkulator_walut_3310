import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getRatesMock = vi.hoisted(() => vi.fn());

vi.mock('../src/services/rate-service', () => ({ getRates: getRatesMock }));

import App from '../src/App';

const snapshot = {
  base: 'PLN',
  rates: { PLN: 1, EUR: 0.23, USD: 0.25, GBP: 0.2, NOK: 2.6, SEK: 2.5, CHF: 0.22 },
  fetchedAt: Date.now(),
  source: 'QA API',
  stale: false
};

describe('App', () => {
  beforeEach(() => {
    localStorage.setItem('waluta3310:language', JSON.stringify('pl'));
    localStorage.setItem('waluta3310:assetMode', JSON.stringify('fiat'));
    localStorage.setItem('waluta3310:currencies', JSON.stringify(['PLN', 'EUR', 'USD', 'GBP', 'NOK', 'SEK']));
    localStorage.setItem('waluta3310:cryptoCurrencies', JSON.stringify(['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP']));
    localStorage.setItem('waluta3310:base', JSON.stringify('PLN'));
    localStorage.setItem('waluta3310:cryptoBase', JSON.stringify('BTC'));
    localStorage.setItem('waluta3310:expression', JSON.stringify('100'));
    getRatesMock.mockResolvedValue(snapshot);
  });

  it('pokazuje sześć walut i przeliczone wartości', async () => {
    render(<App />);
    expect(await screen.findByText(/ONLINE · QA API/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Złoty polski/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: 'Flaga: Złoty polski' })).toHaveAttribute('src', '/flags/pl.svg');
    expect(screen.getByRole('img', { name: 'Flaga: Euro' })).toHaveAttribute('src', '/flags/eu.svg');
    expect(screen.getByText('23,00')).toBeInTheDocument();
    expect(screen.getByText('25,00')).toBeInTheDocument();
  });

  it('łączy listę walut i wyświetlacz kalkulatora w jeden ekran', () => {
    render(<App />);
    const currencies = screen.getByRole('region', { name: 'Przeliczone waluty' });
    const calculator = screen.getByRole('region', { name: 'Wyświetlacz kalkulatora' });
    expect(currencies.parentElement).toBe(calculator.parentElement);
    expect(calculator.parentElement).toHaveClass('display-stack');
  });

  it('wykonuje działanie przez klawiaturę ekranową', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'AC' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('= 5')).toBeInTheDocument();
  });

  it('obsługuje fizyczną klawiaturę', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.keyDown(window, { key: '8' });
    fireEvent.keyDown(window, { key: '*' });
    fireEvent.keyDown(window, { key: '5' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByText('= 40')).toBeInTheDocument();
  });

  it('przełącza i zapamiętuje nowoczesną skórkę', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Włącz motyw nowoczesny' }));
    expect(document.querySelector('main')).toHaveClass('theme-modern');
    expect(JSON.parse(localStorage.getItem('waluta3310:theme') ?? 'null')).toBe('modern');
  });

  it('dodaje walutę z wyszukiwarki i zamyka modal', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Edytuj listę walut' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Kod lub nazwa waluty'), 'CHF');
    await user.click(screen.getByRole('button', { name: /CHF.*Frank szwajcarski/ }));
    await user.click(screen.getByRole('button', { name: 'GOTOWE' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem('waluta3310:currencies') ?? '[]')).toContain('CHF'));
  });

  it('zmienia bazę i zachowuje równoważną kwotę', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Euro/ }));
    expect(screen.getByText('BASE').nextSibling).toHaveTextContent('EUR');
    expect(screen.getByText('= 23')).toBeInTheDocument();
  });

  it('przełącza bazę przyciskiem SWAP', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Zmień walutę bazową na następną' }));
    expect(screen.getByText('BASE').nextSibling).toHaveTextContent('EUR');
    expect(screen.getByText('= 23')).toBeInTheDocument();
  });

  it('pokazuje tryb offline dla starego cache', async () => {
    getRatesMock.mockResolvedValue({ ...snapshot, stale: true });
    render(<App />);
    expect((await screen.findAllByText(/OFFLINE · OSTATNIA AKTUALIZACJA \d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}/)).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'ZGŁOŚ' })).not.toBeInTheDocument();
  });

  it('wymusza odświeżenie po użyciu przycisku statusu', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText(/ONLINE · QA API/);
    getRatesMock.mockClear();
    await user.click(screen.getByRole('button', { name: 'Odśwież kursy' }));
    await waitFor(() => expect(getRatesMock).toHaveBeenCalledWith('PLN', true, 'fiat'));
  });

  it('przełącza interfejs na angielski', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Zmień język na angielski' }));
    expect(screen.getByRole('button', { name: 'CURRENCIES' })).toBeInTheDocument();
    expect(document.title).toBe('Currency Calculator 3310');
    expect(document.documentElement.lang).toBe('en');
  });

  it('przełącza na osobną listę kryptowalut', async () => {
    const cryptoSnapshot = {
      base: 'BTC',
      rates: { BTC: 1, ETH: 18.5, USDT: 65432, BNB: 105, SOL: 420, XRP: 120000 },
      fetchedAt: Date.now(),
      source: 'Coinbase',
      stale: false
    };
    getRatesMock.mockImplementation((base: string, _force: boolean, mode: string) => Promise.resolve(mode === 'crypto' ? { ...cryptoSnapshot, base } : snapshot));
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'KRYPTO' }));
    expect(await screen.findByText(/ONLINE · Coinbase/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Przeliczone kryptowaluty' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bitcoin/ })).toHaveAttribute('aria-pressed', 'true');
    expect(getRatesMock).toHaveBeenCalledWith('BTC', false, 'crypto');
  });

  it('pilnuje zakresu od dwóch do ośmiu walut', async () => {
    localStorage.setItem('waluta3310:currencies', JSON.stringify(['PLN', 'EUR']));
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Edytuj listę walut' }));
    const picker = within(screen.getByRole('dialog'));
    await user.click(picker.getByRole('button', { name: /PLN.*Złoty polski/ }));
    expect(screen.getByText('2/8 wybranych')).toBeInTheDocument();
    for (const code of ['USD', 'GBP', 'NOK', 'SEK', 'DKK', 'CHF']) {
      await user.click(picker.getByRole('button', { name: new RegExp(code) }));
    }
    expect(screen.getByText('8/8 wybranych')).toBeInTheDocument();
    await user.click(picker.getByRole('button', { name: /CZK/ }));
    expect(screen.getByText('8/8 wybranych')).toBeInTheDocument();
  });

  it('pokazuje zgłoszenie dopiero po trwałym błędzie', async () => {
    getRatesMock.mockRejectedValue(new Error('offline'));
    render(<App />);
    expect(await screen.findByRole('button', { name: 'ZGŁOŚ' })).toBeInTheDocument();
    expect(screen.getAllByText('BRAK KURSÓW').length).toBeGreaterThan(0);
  });
});
