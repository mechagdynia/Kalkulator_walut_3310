import { flagAsset } from '../data/currencies';
import { COPY, type Language } from '../i18n';

interface CurrencyFlagProps {
  countryCode: string;
  currencyName: string;
  language: Language;
}

export function CurrencyFlag({ countryCode, currencyName, language }: CurrencyFlagProps) {
  return <img className="flag" src={flagAsset(countryCode)} alt={`${COPY[language].flag}: ${currencyName}`} loading="lazy" decoding="async" />;
}
