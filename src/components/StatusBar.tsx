import type { RateStatus } from '../types/currency';
import { formatRateDate } from '../utils/format';

interface StatusBarProps {
  status: RateStatus;
  source?: string;
  fetchedAt?: number;
  onRefresh: () => void;
  onReport: () => void;
  theme: 'retro' | 'modern';
  onToggleTheme: () => void;
}

export function StatusBar({ status, source, fetchedAt, onRefresh, onReport, theme, onToggleTheme }: StatusBarProps) {
  const online = status === 'online';
  const label = status === 'loading'
    ? 'ŁĄCZENIE…'
    : status === 'offline'
      ? `OFFLINE · ${fetchedAt ? formatRateDate(fetchedAt) : 'CACHE'}`
      : status === 'error'
        ? 'BRAK KURSÓW'
        : `ONLINE · ${source ?? 'API'}`;

  return (
    <div className="status-bar" aria-live="polite">
      <span className={`status-dot status-${status}`} aria-hidden="true" />
      <span className="status-label">{label}</span>
      {status === 'error' && <button className="text-action" onClick={onReport}>ZGŁOŚ</button>}
      <button className="theme-button" type="button" onClick={onToggleTheme} aria-label={`Włącz motyw ${theme === 'retro' ? 'nowoczesny' : 'Nokia 3310'}`}>
        <span aria-hidden="true">{theme === 'retro' ? '◐' : '▦'}</span>
        <span>{theme === 'retro' ? 'MODERN' : '3310'}</span>
      </button>
      <button className="refresh-button" type="button" onClick={onRefresh} disabled={status === 'loading'} aria-label="Odśwież kursy">
        <span aria-hidden="true" className={status === 'loading' ? 'spin' : ''}>↻</span>
      </button>
      <span className="sr-only">{online ? 'Kursy aktualne' : label}</span>
    </div>
  );
}
