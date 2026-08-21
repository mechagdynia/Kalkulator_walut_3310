import { useCallback, useEffect, useState } from 'react';
import { getRates } from '../services/rate-service';
import type { AssetMode, RateSnapshot, RateStatus } from '../types/currency';

export function useRates(base: string, mode: AssetMode) {
  const [snapshot, setSnapshot] = useState<RateSnapshot | null>(null);
  const [status, setStatus] = useState<RateStatus>('loading');
  const [error, setError] = useState('');

  const refresh = useCallback(async (force = false) => {
    setStatus('loading');
    setError('');
    try {
      const result = await getRates(base, force, mode);
      setSnapshot(result);
      setStatus(result.stale || !navigator.onLine ? 'offline' : 'online');
    } catch (reason) {
      setSnapshot(null);
      setStatus('error');
      setError(reason instanceof Error ? reason.message : 'Nieznany błąd połączenia');
    }
  }, [base, mode]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handleOffline = () => setStatus((current) => current === 'error' ? current : 'offline');
    const handleOnline = () => void refresh(true);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [refresh]);

  return { snapshot, status, error, refresh };
}
