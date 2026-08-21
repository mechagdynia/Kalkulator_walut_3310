import { currencyByCode } from '../data/currencies';
import { cryptoByCode } from '../data/cryptocurrencies';
import { COPY, currencyDisplayName, type Language } from '../i18n';
import type { AssetMode, RateSnapshot } from '../types/currency';
import { formatMoney } from '../utils/format';
import { CryptoBadge } from './CryptoBadge';
import { CurrencyFlag } from './CurrencyFlag';

interface CurrencyListProps {
  currencies: string[];
  active: string;
  amount: number;
  snapshot: RateSnapshot | null;
  mode: AssetMode;
  language: Language;
  onSelect: (code: string) => void;
  onEdit: () => void;
}

export function CurrencyList({ currencies, active, amount, snapshot, mode, language, onSelect, onEdit }: CurrencyListProps) {
  const copy = COPY[language];
  return (
    <section className="currency-panel" aria-label={mode === 'fiat' ? copy.convertedFiat : copy.convertedCrypto}>
      <div className="lcd-header">
        <div>
          <span className="lcd-kicker">{copy.appName.toUpperCase()}</span>
          <span className="lcd-title">{mode === 'fiat' ? copy.fiatTitle : copy.cryptoTitle}</span>
        </div>
        <button className="edit-currencies" type="button" onClick={onEdit} aria-label={mode === 'fiat' ? copy.editFiat : copy.editCrypto}>{copy.edit}</button>
      </div>
      <div className="currency-list">
        {currencies.map((code) => {
          const currency = mode === 'fiat' ? currencyByCode(code) : cryptoByCode(code);
          const name = mode === 'fiat' ? currencyDisplayName(code, currency.name, language) : currency.name;
          const rate = code === active ? 1 : snapshot?.rates[code];
          const converted = rate === undefined ? null : amount * rate;
          return (
            <button
              type="button"
              className={`currency-row ${code === active ? 'active' : ''}`}
              key={code}
              onClick={() => onSelect(code)}
              aria-pressed={code === active}
              aria-label={`${code} ${name}`}
            >
              {mode === 'fiat' && 'countryCode' in currency
                ? <CurrencyFlag countryCode={currency.countryCode} currencyName={name} language={language} />
                : <CryptoBadge code={code} />}
              <span className="currency-meta">
                <strong>{code}</strong>
                <small>{currency.symbol}</small>
              </span>
              <span className="currency-value">{converted === null ? '— — —' : formatMoney(converted, code, language, mode === 'crypto')}</span>
            </button>
          );
        })}
      </div>
      <div className="scanlines" aria-hidden="true" />
    </section>
  );
}
