import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CurrencyList } from './components/CurrencyList';
import { CurrencyPicker } from './components/CurrencyPicker';
import { Keypad } from './components/Keypad';
import { StatusBar } from './components/StatusBar';
import { DEFAULT_CURRENCIES, currencyFromLocale } from './data/currencies';
import { useRates } from './hooks/useRates';
import { readStorage, writeStorage } from './services/storage';
import { evaluateExpression, pressCalculatorKey } from './utils/calculator';

const REPORT_ADDRESS = 'mechagdynia@gmail.com';
type Theme = 'retro' | 'modern';

export default function App() {
  const [currencies, setCurrencies] = useState<string[]>(() => {
    const saved = readStorage<string[]>('currencies', []);
    if (saved.length >= 2) return saved;
    const local = currencyFromLocale();
    return [local, ...DEFAULT_CURRENCIES.filter((code) => code !== local)].slice(0, 6);
  });
  const [base, setBase] = useState(() => readStorage('base', currencies[0]));
  const [expression, setExpression] = useState(() => readStorage('expression', '100'));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => readStorage<Theme>('theme', 'retro'));
  const { snapshot, status, error, refresh } = useRates(base);
  const amount = useMemo(() => Math.abs(evaluateExpression(expression) ?? 0), [expression]);

  useEffect(() => writeStorage('currencies', currencies), [currencies]);
  useEffect(() => writeStorage('base', base), [base]);
  useEffect(() => writeStorage('expression', expression), [expression]);
  useEffect(() => writeStorage('theme', theme), [theme]);

  useEffect(() => {
    if (!currencies.includes(base)) setBase(currencies[0]);
  }, [base, currencies]);

  const handleKey = useCallback((key: string) => {
    setExpression((current) => pressCalculatorKey(current, key));
  }, []);

  const selectBase = (code: string) => {
    if (code === base) return;
    const converted = snapshot?.rates[code] ? amount * snapshot.rates[code] : amount;
    setExpression(String(Number(converted.toPrecision(12))));
    setBase(code);
  };

  const swapBase = () => {
    const currentIndex = currencies.indexOf(base);
    selectBase(currencies[(currentIndex + 1) % currencies.length]);
  };

  const reportProblem = () => {
    const body = [
      'Cześć,',
      '',
      'aplikacja Waluta 3310 nie może pobrać kursów.',
      `Komunikat: ${error || 'brak danych z dostawców kursów'}`,
      `Czas lokalny: ${new Date().toLocaleString('pl-PL')}`,
      `Platforma: ${navigator.platform || 'nieznana'}`,
      `Wersja aplikacji: 1.0.0`,
      '',
      'Proszę opisać tutaj, co się wydarzyło:'
    ].join('\n');
    window.location.href = `mailto:${REPORT_ADDRESS}?subject=${encodeURIComponent('Waluta 3310 — zgłoszenie problemu')}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className={`app-shell theme-${theme}`}>
      <section className="phone" aria-label="Waluta 3310">
        <StatusBar
          status={status}
          source={snapshot?.source}
          fetchedAt={snapshot?.fetchedAt}
          onRefresh={() => void refresh(true)}
          onReport={reportProblem}
          theme={theme}
          onToggleTheme={() => setTheme((current) => current === 'retro' ? 'modern' : 'retro')}
        />
        <CurrencyList currencies={currencies} active={base} amount={amount} snapshot={snapshot} onSelect={selectBase} onEdit={() => setPickerOpen(true)} />
        <CalculatorDisplay base={base} expression={expression} amount={amount} onSwap={swapBase} />
        <Keypad onKey={handleKey} />
      </section>
      {pickerOpen && <CurrencyPicker selected={currencies} onChange={setCurrencies} onClose={() => setPickerOpen(false)} />}
    </main>
  );
}
