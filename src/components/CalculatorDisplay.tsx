import { COPY, type Language } from '../i18n';

interface CalculatorDisplayProps {
  base: string;
  expression: string;
  amount: number;
  language: Language;
  onSwap: () => void;
}

export function CalculatorDisplay({ base, expression, amount, language, onSwap }: CalculatorDisplayProps) {
  const copy = COPY[language];
  return (
    <section className="calculator-display" aria-label={copy.calculatorDisplay}>
      <div className="base-label"><span>BASE</span><strong>{base}</strong></div>
      <div className="expression" aria-live="polite">
        <span className="expression-input">{expression}</span>
        <span className="expression-result">{Number.isFinite(amount) ? `= ${amount.toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US', { maximumFractionDigits: 8 })}` : copy.error}</span>
      </div>
      <button type="button" className="swap-button" onClick={onSwap} aria-label={copy.swapBase}>SWAP <span aria-hidden="true">⇄</span></button>
    </section>
  );
}
