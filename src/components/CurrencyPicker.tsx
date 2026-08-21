import { useMemo, useState } from 'react';
import { CURRENCIES } from '../data/currencies';
import { CRYPTOCURRENCIES } from '../data/cryptocurrencies';
import { COPY, currencyDisplayName, type Language } from '../i18n';
import type { AssetMode } from '../types/currency';
import { CryptoBadge } from './CryptoBadge';
import { CurrencyFlag } from './CurrencyFlag';

interface CurrencyPickerProps {
  selected: string[];
  mode: AssetMode;
  language: Language;
  onChange: (codes: string[]) => void;
  onClose: () => void;
}

export function CurrencyPicker({ selected, mode, language, onChange, onClose }: CurrencyPickerProps) {
  const [query, setQuery] = useState('');
  const copy = COPY[language];
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(language);
    const catalog = mode === 'fiat' ? CURRENCIES : CRYPTOCURRENCIES;
    return catalog.map((asset) => ({
      ...asset,
      displayName: mode === 'fiat' ? currencyDisplayName(asset.code, asset.name, language) : asset.name
    })).filter((asset) => !normalized || asset.code.toLowerCase().includes(normalized) || asset.displayName.toLocaleLowerCase(language).includes(normalized));
  }, [language, mode, query]);

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
          <div><span className="picker-kicker">{mode === 'fiat' ? copy.fiatRange : copy.cryptoRange}</span><h2 id="picker-title">{copy.yourList}</h2></div>
          <button type="button" className="close-button" onClick={onClose} aria-label={copy.close}>×</button>
        </header>
        <label className="search-field">
          <span className="sr-only">{mode === 'fiat' ? copy.searchFiatLabel : copy.searchCryptoLabel}</span>
          <span aria-hidden="true">⌕</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === 'fiat' ? copy.searchFiat : copy.searchCrypto} maxLength={30} />
        </label>
        <div className="picker-list">
          {results.map((asset) => {
            const checked = selected.includes(asset.code);
            return (
              <button type="button" className={`picker-row ${checked ? 'selected' : ''}`} key={asset.code} onClick={() => toggle(asset.code)} aria-label={`${asset.code} ${asset.displayName}`}>
                {mode === 'fiat' && 'countryCode' in asset
                  ? <CurrencyFlag countryCode={asset.countryCode} currencyName={asset.displayName} language={language} />
                  : <CryptoBadge code={asset.code} />}
                <span><strong>{asset.code}</strong><small>{asset.displayName}</small></span>
                <span className="selection-mark" aria-hidden="true">{checked ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>
        <footer><span>{selected.length}/8 {copy.selected}</span><button type="button" onClick={onClose}>{copy.done}</button></footer>
      </section>
    </div>
  );
}
