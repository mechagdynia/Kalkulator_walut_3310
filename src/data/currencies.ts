import type { CurrencyInfo } from '../types/currency';

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'PLN', name: 'Polski złoty', countryCode: 'PL', symbol: 'zł' },
  { code: 'EUR', name: 'Euro', countryCode: 'EU', symbol: '€' },
  { code: 'USD', name: 'Dolar amerykański', countryCode: 'US', symbol: '$' },
  { code: 'GBP', name: 'Funt szterling', countryCode: 'GB', symbol: '£' },
  { code: 'NOK', name: 'Korona norweska', countryCode: 'NO', symbol: 'kr' },
  { code: 'SEK', name: 'Korona szwedzka', countryCode: 'SE', symbol: 'kr' },
  { code: 'DKK', name: 'Korona duńska', countryCode: 'DK', symbol: 'kr' },
  { code: 'CHF', name: 'Frank szwajcarski', countryCode: 'CH', symbol: 'Fr' },
  { code: 'CZK', name: 'Korona czeska', countryCode: 'CZ', symbol: 'Kč' },
  { code: 'HUF', name: 'Forint węgierski', countryCode: 'HU', symbol: 'Ft' },
  { code: 'UAH', name: 'Hrywna ukraińska', countryCode: 'UA', symbol: '₴' },
  { code: 'JPY', name: 'Jen japoński', countryCode: 'JP', symbol: '¥', decimals: 0 },
  { code: 'CNY', name: 'Juan chiński', countryCode: 'CN', symbol: '¥' },
  { code: 'CAD', name: 'Dolar kanadyjski', countryCode: 'CA', symbol: 'C$' },
  { code: 'AUD', name: 'Dolar australijski', countryCode: 'AU', symbol: 'A$' },
  { code: 'NZD', name: 'Dolar nowozelandzki', countryCode: 'NZ', symbol: 'NZ$' },
  { code: 'ISK', name: 'Korona islandzka', countryCode: 'IS', symbol: 'kr', decimals: 0 },
  { code: 'RON', name: 'Lej rumuński', countryCode: 'RO', symbol: 'lei' },
  { code: 'BGN', name: 'Lew bułgarski', countryCode: 'BG', symbol: 'лв' },
  { code: 'TRY', name: 'Lira turecka', countryCode: 'TR', symbol: '₺' },
  { code: 'ILS', name: 'Nowy szekel', countryCode: 'IL', symbol: '₪' },
  { code: 'INR', name: 'Rupia indyjska', countryCode: 'IN', symbol: '₹' },
  { code: 'KRW', name: 'Won południowokoreański', countryCode: 'KR', symbol: '₩', decimals: 0 },
  { code: 'SGD', name: 'Dolar singapurski', countryCode: 'SG', symbol: 'S$' },
  { code: 'HKD', name: 'Dolar hongkoński', countryCode: 'HK', symbol: 'HK$' },
  { code: 'MXN', name: 'Peso meksykańskie', countryCode: 'MX', symbol: 'Mex$' },
  { code: 'BRL', name: 'Real brazylijski', countryCode: 'BR', symbol: 'R$' },
  { code: 'ZAR', name: 'Rand południowoafrykański', countryCode: 'ZA', symbol: 'R' },
  { code: 'AED', name: 'Dirham ZEA', countryCode: 'AE', symbol: 'د.إ' },
  { code: 'THB', name: 'Bat tajski', countryCode: 'TH', symbol: '฿' }
];

export const DEFAULT_CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP', 'NOK', 'SEK'];

export const currencyByCode = (code: string): CurrencyInfo =>
  CURRENCIES.find((currency) => currency.code === code) ?? {
    code,
    name: code,
    countryCode: 'UN',
    symbol: code
  };

export const countryFlag = (countryCode: string): string => {
  if (countryCode === 'EU') return '🇪🇺';
  if (countryCode === 'UN') return '🌐';
  return countryCode
    .toUpperCase()
    .split('')
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join('');
};

const REGION_BASE: Record<string, string> = {
  PL: 'PLN', NO: 'NOK', SE: 'SEK', DK: 'DKK', CH: 'CHF', GB: 'GBP', US: 'USD',
  CA: 'CAD', AU: 'AUD', NZ: 'NZD', CZ: 'CZK', HU: 'HUF', UA: 'UAH', JP: 'JPY',
  CN: 'CNY', RO: 'RON', BG: 'BGN', TR: 'TRY', IL: 'ILS', IN: 'INR', KR: 'KRW',
  SG: 'SGD', HK: 'HKD', MX: 'MXN', BR: 'BRL', ZA: 'ZAR', AE: 'AED', TH: 'THB', IS: 'ISK'
};

export const currencyFromLocale = (): string => {
  const locale = navigator.languages?.[0] ?? navigator.language;
  const region = locale.match(/[-_]([A-Za-z]{2})\b/)?.[1]?.toUpperCase();
  return (region && REGION_BASE[region]) || 'PLN';
};
