import { useCallback, useEffect, useState } from 'react';
import { getRates } from '../services/rate-service';
import type { RateSnapshot, RateStatus } from '../types/currency';

export function useRates(base: string) {
  const [snapshot, setSnapshot] = useState<RateSnapshot | null>(null);
  const [status, setStatus] = useState<RateStatus>('loading');
  const [error, setError] = useState('');

  const refresh = useCallback(async (force = false) => {
    setStatus('loading');
    setError('');
    try {
      const result = await getRates(base, force);
      setSnapshot(result);
      setStatus(result.stale ? 'offline' : 'online');
    } catch (reason) {
      setSnapshot(null);
      setStatus('error');
      setError(reason instanceof Error ? reason.message : 'Nieznany błąd połączenia');
    }
  }, [base]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { snapshot, status, error, refresh };
}
