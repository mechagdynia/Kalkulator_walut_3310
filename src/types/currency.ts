export interface CurrencyInfo {
  code: string;
  name: string;
  countryCode: string;
  symbol: string;
  decimals?: number;
}

export interface RateSnapshot {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number;
  source: string;
  stale: boolean;
}

export type RateStatus = 'loading' | 'online' | 'offline' | 'error';

export type AssetMode = 'fiat' | 'crypto';
