import { COPY, type Language } from '../i18n';
import type { AssetMode } from '../types/currency';

interface AssetTabsProps {
  mode: AssetMode;
  language: Language;
  onChange: (mode: AssetMode) => void;
}

export function AssetTabs({ mode, language, onChange }: AssetTabsProps) {
  const copy = COPY[language];
  return (
    <nav className="asset-tabs" aria-label={language === 'pl' ? 'Rodzaj aktywów' : 'Asset type'}>
      <button type="button" className={mode === 'fiat' ? 'active' : ''} aria-pressed={mode === 'fiat'} onClick={() => onChange('fiat')}>{copy.fiatTab}</button>
      <button type="button" className={mode === 'crypto' ? 'active' : ''} aria-pressed={mode === 'crypto'} onClick={() => onChange('crypto')}>{copy.cryptoTab}</button>
    </nav>
  );
}
