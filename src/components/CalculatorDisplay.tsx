interface CalculatorDisplayProps {
  base: string;
  expression: string;
  amount: number;
  onSwap: () => void;
}

export function CalculatorDisplay({ base, expression, amount, onSwap }: CalculatorDisplayProps) {
  return (
    <section className="calculator-display" aria-label="Wyświetlacz kalkulatora">
      <div className="base-label"><span>BASE</span><strong>{base}</strong></div>
      <div className="expression" aria-live="polite">
        <span className="expression-input">{expression}</span>
        <span className="expression-result">{Number.isFinite(amount) ? `= ${amount.toLocaleString('pl-PL', { maximumFractionDigits: 8 })}` : 'BŁĄD'}</span>
      </div>
      <button type="button" className="swap-button" onClick={onSwap} aria-label="Zmień walutę bazową na następną">SWAP <span aria-hidden="true">⇄</span></button>
    </section>
  );
}
