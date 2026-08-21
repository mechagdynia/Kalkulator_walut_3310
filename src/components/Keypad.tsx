import { useEffect } from 'react';
import { COPY, type Language } from '../i18n';

const KEYS = [
  { label: 'AC', kind: 'function' }, { label: 'DEL', kind: 'function' }, { label: '%', kind: 'function' }, { label: '÷', kind: 'operator' },
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '×', kind: 'operator' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '−', kind: 'operator' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '+', kind: 'operator' },
  { label: '+/−', kind: 'function' }, { label: '0' }, { label: '.' }, { label: '=', kind: 'equals' }
];

interface KeypadProps {
  language: Language;
  onKey: (key: string) => void;
}

export function Keypad({ language, onKey }: KeypadProps) {
  const copy = COPY[language];
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const map: Record<string, string> = { Enter: '=', Backspace: 'DEL', Escape: 'AC', '*': '×', '/': '÷', '-': '−', ',': '.' };
      const key = map[event.key] ?? event.key;
      if (/^[0-9.]$/.test(key) || ['=', 'DEL', 'AC', '×', '÷', '−', '+', '%'].includes(key)) {
        event.preventDefault();
        onKey(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKey]);

  const press = (key: string) => {
    if ('vibrate' in navigator) navigator.vibrate(8);
    onKey(key);
  };

  return (
    <section className="keypad" aria-label={copy.keypad}>
      {KEYS.map(({ label, kind }) => (
        <button type="button" key={label} className={`key ${kind ? `key-${kind}` : ''}`} onClick={() => press(label)} aria-label={label === 'DEL' ? copy.deleteLast : label}>
          {label}
        </button>
      ))}
    </section>
  );
}
