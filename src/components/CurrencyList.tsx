import { currencyByCode } from '../data/currencies';
import { cryptoByCode, isCryptoCode } from '../data/cryptocurrencies';
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
  const regionLabel = mode === 'fiat' ? copy.convertedFiat : mode === 'crypto' ? copy.convertedCrypto : copy.convertedMixed;
  const title = mode === 'fiat' ? copy.fiatTitle : mode === 'crypto' ? copy.cryptoTitle : copy.mixedTitle;
  const editLabel = mode === 'fiat' ? copy.editFiat : mode === 'crypto' ? copy.editCrypto : copy.editMixed;
  return (
    <section className="currency-panel" aria-label={regionLabel}>
      <div className="lcd-header">
        <div>
          <span className="lcd-kicker">{copy.appName.toUpperCase()}</span>
          <span className="lcd-title">{title}</span>
        </div>
        <button className="edit-currencies" type="button" onClick={onEdit} aria-label={editLabel}>{copy.edit}</button>
      </div>
      <div className="currency-list">
        {currencies.map((code) => {
          const crypto = isCryptoCode(code);
          const currency = crypto ? cryptoByCode(code) : currencyByCode(code);
          const name = crypto ? currency.name : currencyDisplayName(code, currency.name, language);
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
              {!crypto
                ? <CurrencyFlag countryCode={currencyByCode(code).countryCode} currencyName={name} language={language} />
                : <CryptoBadge code={code} />}
              <span className="currency-meta">
                <strong>{code}</strong>
                <small>{currency.symbol}</small>
              </span>
              <span className="currency-value">{converted === null ? '— — —' : formatMoney(converted, code, language, crypto)}</span>
            </button>
          );
        })}
      </div>
      <div className="scanlines" aria-hidden="true" />
    </section>
  );
}
