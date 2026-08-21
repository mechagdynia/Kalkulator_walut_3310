import { useMemo, useState } from 'react';
import { CURRENCIES, countryFlag } from '../data/currencies';

interface CurrencyPickerProps {
  selected: string[];
  onChange: (codes: string[]) => void;
  onClose: () => void;
}

export function CurrencyPicker({ selected, onChange, onClose }: CurrencyPickerProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pl');
    return CURRENCIES.filter((currency) => !normalized || currency.code.toLowerCase().includes(normalized) || currency.name.toLocaleLowerCase('pl').includes(normalized));
  }, [query]);

  const toggle = (code: string) => {
    if (selected.includes(code)) {
      if (selected.length <= 2) return;
      onChange(selected.filter((item) => item !== code));
    } else if (selected.length < 8) {
      onChange([...selected, code]);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="currency-picker" role="dialog" aria-modal="true" aria-labelledby="picker-title">
        <header className="picker-header">
          <div><span className="picker-kicker">2–8 WALUT</span><h2 id="picker-title">Twoja lista</h2></div>
          <button type="button" className="close-button" onClick={onClose} aria-label="Zamknij">×</button>
        </header>
        <label className="search-field">
          <span className="sr-only">Szukaj waluty</span>
          <span aria-hidden="true">⌕</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kod lub nazwa waluty" maxLength={30} />
        </label>
        <div className="picker-list">
          {results.map((currency) => {
            const checked = selected.includes(currency.code);
            return (
              <button type="button" className={`picker-row ${checked ? 'selected' : ''}`} key={currency.code} onClick={() => toggle(currency.code)}>
                <span className="flag">{countryFlag(currency.countryCode)}</span>
                <span><strong>{currency.code}</strong><small>{currency.name}</small></span>
                <span className="selection-mark" aria-hidden="true">{checked ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>
        <footer><span>{selected.length}/8 wybranych</span><button type="button" onClick={onClose}>GOTOWE</button></footer>
      </section>
    </div>
  );
}
