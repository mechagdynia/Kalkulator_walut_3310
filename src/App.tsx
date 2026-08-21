import { useCallback, useEffect, useMemo, useState } from 'react';
import { AssetTabs } from './components/AssetTabs';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CurrencyList } from './components/CurrencyList';
import { CurrencyPicker } from './components/CurrencyPicker';
import { Keypad } from './components/Keypad';
import { StatusBar } from './components/StatusBar';
import { DEFAULT_CURRENCIES, currencyFromLocale } from './data/currencies';
import { DEFAULT_CRYPTOCURRENCIES, isCryptoCode } from './data/cryptocurrencies';
import { useRates } from './hooks/useRates';
import { COPY, languageFromLocale, type Language } from './i18n';
import { readStorage, writeStorage } from './services/storage';
import type { AssetMode } from './types/currency';
import { evaluateExpression, pressCalculatorKey } from './utils/calculator';

const REPORT_ADDRESS = 'mechagdynia@gmail.com';
type Theme = 'retro' | 'modern';

export default function App() {
  const [fiatCurrencies, setFiatCurrencies] = useState<string[]>(() => {
    const saved = readStorage<string[]>('currencies', []);
    if (saved.length >= 2) return saved;
    const local = currencyFromLocale();
    return [local, ...DEFAULT_CURRENCIES.filter((code) => code !== local)].slice(0, 6);
  });
  const [cryptoCurrencies, setCryptoCurrencies] = useState<string[]>(() => {
    const saved = readStorage<string[]>('cryptoCurrencies', []);
    return saved.length >= 2 ? saved : DEFAULT_CRYPTOCURRENCIES;
  });
  const [mixedAssets, setMixedAssets] = useState<string[]>(() => {
    const saved = readStorage<string[]>('mixedAssets', []);
    const fiat = saved.find((code) => !isCryptoCode(code)) ?? 'USD';
    const crypto = saved.filter(isCryptoCode);
    return [fiat, ...(crypto.length ? crypto : DEFAULT_CRYPTOCURRENCIES)].slice(0, 8);
  });
  const [fiatBase, setFiatBase] = useState(() => readStorage('base', fiatCurrencies[0]));
  const [cryptoBase, setCryptoBase] = useState(() => readStorage('cryptoBase', cryptoCurrencies[0]));
  const [mixedBase, setMixedBase] = useState(() => readStorage('mixedBase', mixedAssets[0]));
  const [mode, setMode] = useState<AssetMode>(() => readStorage<AssetMode>('assetMode', 'fiat'));
  const [language, setLanguage] = useState<Language>(() => readStorage<Language>('language', languageFromLocale()));
  const [expression, setExpression] = useState(() => readStorage('expression', '100'));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => readStorage<Theme>('theme', 'retro'));
  const currencies = mode === 'fiat' ? fiatCurrencies : mode === 'crypto' ? cryptoCurrencies : mixedAssets;
  const base = mode === 'fiat' ? fiatBase : mode === 'crypto' ? cryptoBase : mixedBase;
  const mixedFiat = mixedAssets.find((code) => !isCryptoCode(code)) ?? 'USD';
  const { snapshot, status, error, refresh } = useRates(base, mode, mixedFiat);
  const amount = useMemo(() => Math.abs(evaluateExpression(expression) ?? 0), [expression]);

  useEffect(() => writeStorage('currencies', fiatCurrencies), [fiatCurrencies]);
  useEffect(() => writeStorage('cryptoCurrencies', cryptoCurrencies), [cryptoCurrencies]);
  useEffect(() => writeStorage('mixedAssets', mixedAssets), [mixedAssets]);
  useEffect(() => writeStorage('base', fiatBase), [fiatBase]);
  useEffect(() => writeStorage('cryptoBase', cryptoBase), [cryptoBase]);
  useEffect(() => writeStorage('mixedBase', mixedBase), [mixedBase]);
  useEffect(() => writeStorage('assetMode', mode), [mode]);
  useEffect(() => writeStorage('language', language), [language]);
  useEffect(() => writeStorage('expression', expression), [expression]);
  useEffect(() => writeStorage('theme', theme), [theme]);

  useEffect(() => {
    if (!fiatCurrencies.includes(fiatBase)) setFiatBase(fiatCurrencies[0]);
  }, [fiatBase, fiatCurrencies]);

  useEffect(() => {
    if (!cryptoCurrencies.includes(cryptoBase)) setCryptoBase(cryptoCurrencies[0]);
  }, [cryptoBase, cryptoCurrencies]);

  useEffect(() => {
    if (!mixedAssets.includes(mixedBase)) setMixedBase(mixedAssets[0]);
  }, [mixedAssets, mixedBase]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = COPY[language].appName;
    document.querySelector('link[rel="manifest"]')?.setAttribute('href', language === 'pl' ? './manifest.pl.webmanifest' : './manifest.webmanifest');
  }, [language]);

  const handleKey = useCallback((key: string) => {
    setExpression((current) => pressCalculatorKey(current, key));
  }, []);

  const selectBase = (code: string) => {
    if (code === base) return;
    const converted = snapshot?.rates[code] ? amount * snapshot.rates[code] : amount;
    setExpression(String(Number(converted.toPrecision(12))));
    if (mode === 'fiat') setFiatBase(code);
    else if (mode === 'crypto') setCryptoBase(code);
    else setMixedBase(code);
  };

  const swapBase = () => {
    const currentIndex = currencies.indexOf(base);
    selectBase(currencies[(currentIndex + 1) % currencies.length]);
  };

  const reportProblem = () => {
    const body = language === 'pl' ? [
      'Cześć,',
      '',
      'aplikacja Waluta 3310 nie może pobrać kursów.',
      `Komunikat: ${error || 'brak danych z dostawców kursów'}`,
      `Czas lokalny: ${new Date().toLocaleString('pl-PL')}`,
      `Platforma: ${navigator.platform || 'nieznana'}`,
      `Wersja aplikacji: 1.0.0`,
      '',
      'Proszę opisać tutaj, co się wydarzyło:'
    ].join('\n') : [
      'Hello,',
      '',
      'Currency Calculator 3310 cannot download current rates.',
      `Message: ${error || 'no data from rate providers'}`,
      `Local time: ${new Date().toLocaleString('en-US')}`,
      `Platform: ${navigator.platform || 'unknown'}`,
      'App version: 1.0.0',
      '',
      'Please describe what happened:'
    ].join('\n');
    const subject = language === 'pl' ? 'Waluta 3310 — zgłoszenie problemu' : 'Currency Calculator 3310 — problem report';
    window.location.href = `mailto:${REPORT_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const updateCurrencies = (codes: string[]) => {
    if (mode === 'fiat') setFiatCurrencies(codes);
    else if (mode === 'crypto') setCryptoCurrencies(codes);
    else {
      setMixedAssets(codes);
      if (!codes.includes(mixedBase)) setMixedBase(codes[0]);
    }
  };

  return (
    <main className={`app-shell theme-${theme}`}>
      <section className="phone" aria-label={COPY[language].appName}>
        <StatusBar
          status={status}
          source={snapshot?.source}
          fetchedAt={snapshot?.fetchedAt}
          onRefresh={() => void refresh(true)}
          onReport={reportProblem}
          theme={theme}
          language={language}
          onToggleTheme={() => setTheme((current) => current === 'retro' ? 'modern' : 'retro')}
          onToggleLanguage={() => setLanguage((current) => current === 'pl' ? 'en' : 'pl')}
        />
        <AssetTabs mode={mode} language={language} onChange={(nextMode) => { setMode(nextMode); setPickerOpen(false); }} />
        <div className="display-stack">
          <CurrencyList currencies={currencies} active={base} amount={amount} snapshot={snapshot} mode={mode} language={language} onSelect={selectBase} onEdit={() => setPickerOpen(true)} />
          <CalculatorDisplay base={base} expression={expression} amount={amount} language={language} onSwap={swapBase} />
        </div>
        <Keypad language={language} onKey={handleKey} />
      </section>
      {pickerOpen && <CurrencyPicker selected={currencies} mode={mode} language={language} onChange={updateCurrencies} onClose={() => setPickerOpen(false)} />}
    </main>
  );
}
