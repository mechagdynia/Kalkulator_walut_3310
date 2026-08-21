import { COPY, type Language } from '../i18n';
import type { RateStatus } from '../types/currency';
import { formatRateDate } from '../utils/format';

interface StatusBarProps {
  status: RateStatus;
  source?: string;
  fetchedAt?: number;
  onRefresh: () => void;
  onReport: () => void;
  theme: 'retro' | 'modern';
  language: Language;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export function StatusBar({ status, source, fetchedAt, onRefresh, onReport, theme, language, onToggleTheme, onToggleLanguage }: StatusBarProps) {
  const copy = COPY[language];
  const online = status === 'online';
  const label = status === 'loading'
    ? copy.connecting
    : status === 'offline'
      ? `${copy.offlineLast} ${fetchedAt ? formatRateDate(fetchedAt, language) : copy.missing}`
      : status === 'error'
        ? copy.noRates
        : `${copy.online} · ${source ?? 'API'}`;

  return (
    <div className="status-bar" aria-live="polite">
      <span className={`status-dot status-${status}`} aria-hidden="true" />
      <span className="status-label" title={label}>{label}</span>
      {status === 'error' && <button className="text-action" onClick={onReport}>{copy.report}</button>}
      <button className="language-button" type="button" onClick={onToggleLanguage} aria-label={copy.language}>{language === 'pl' ? 'EN' : 'PL'}</button>
      <button className="theme-button" type="button" onClick={onToggleTheme} aria-label={theme === 'retro' ? copy.modernTheme : copy.retroTheme}>
        <span aria-hidden="true">{theme === 'retro' ? '◐' : '▦'}</span>
        <span>{theme === 'retro' ? 'MODERN' : '3310'}</span>
      </button>
      <button className="refresh-button" type="button" onClick={onRefresh} disabled={status === 'loading'} aria-label={copy.refresh}>
        <span aria-hidden="true" className={status === 'loading' ? 'spin' : ''}>↻</span>
      </button>
      <span className="sr-only">{online ? copy.ratesCurrent : label}</span>
    </div>
  );
}
