import { countryFlag, currencyByCode } from '../data/currencies';
import type { RateSnapshot } from '../types/currency';
import { formatMoney } from '../utils/format';

interface CurrencyListProps {
  currencies: string[];
  active: string;
  amount: number;
  snapshot: RateSnapshot | null;
  onSelect: (code: string) => void;
  onEdit: () => void;
}

export function CurrencyList({ currencies, active, amount, snapshot, onSelect, onEdit }: CurrencyListProps) {
  return (
    <section className="currency-panel" aria-label="Przeliczone waluty">
      <div className="lcd-header">
        <div>
          <span className="lcd-kicker">WALUTA 3310</span>
          <span className="lcd-title">MULTI CONVERTER</span>
        </div>
        <button className="edit-currencies" type="button" onClick={onEdit} aria-label="Edytuj listę walut">EDYTUJ</button>
      </div>
      <div className="currency-list">
        {currencies.map((code) => {
          const currency = currencyByCode(code);
          const rate = code === active ? 1 : snapshot?.rates[code];
          const converted = rate === undefined ? null : amount * rate;
          return (
            <button
              type="button"
              className={`currency-row ${code === active ? 'active' : ''}`}
              key={code}
              onClick={() => onSelect(code)}
              aria-pressed={code === active}
            >
              <span className="flag" role="img" aria-label={`Flaga: ${currency.name}`}>{countryFlag(currency.countryCode)}</span>
              <span className="currency-meta">
                <strong>{code}</strong>
                <small>{currency.symbol}</small>
              </span>
              <span className="currency-value">{converted === null ? '— — —' : formatMoney(converted, code)}</span>
            </button>
          );
        })}
      </div>
      <div className="scanlines" aria-hidden="true" />
    </section>
  );
}
