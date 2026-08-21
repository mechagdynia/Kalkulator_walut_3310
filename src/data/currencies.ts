import type { CurrencyInfo } from '../types/currency';

type CurrencyRecord = [code: string, name: string, countryCode: string, decimals?: number];

const currencySymbol = (code: string): string => {
  try {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: code, currencyDisplay: 'narrowSymbol' })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? code;
  } catch {
    return code;
  }
};

const NBP_CURRENCIES: CurrencyRecord[] = [
  ['PLN', 'Polski złoty', 'PL'],
  ['EUR', 'Euro', 'EU'],
  ['USD', 'Dolar amerykański', 'US'],
  ['GBP', 'Funt szterling', 'GB'],
  ['NOK', 'Korona norweska', 'NO'],
  ['SEK', 'Korona szwedzka', 'SE'],
  ['DKK', 'Korona duńska', 'DK'],
  ['CHF', 'Frank szwajcarski', 'CH'],
  ['CZK', 'Korona czeska', 'CZ'],
  ['HUF', 'Forint węgierski', 'HU'],
  ['UAH', 'Hrywna ukraińska', 'UA'],
  ['JPY', 'Jen japoński', 'JP', 0],
  ['CNY', 'Yuan renminbi', 'CN'],
  ['CAD', 'Dolar kanadyjski', 'CA'],
  ['AUD', 'Dolar australijski', 'AU'],
  ['NZD', 'Dolar nowozelandzki', 'NZ'],
  ['ISK', 'Korona islandzka', 'IS', 0],
  ['RON', 'Lej rumuński', 'RO'],
  ['TRY', 'Lira turecka', 'TR'],
  ['ILS', 'Nowy izraelski szekel', 'IL'],
  ['CLP', 'Peso chilijskie', 'CL'],
  ['PHP', 'Peso filipińskie', 'PH'],
  ['MXN', 'Peso meksykańskie', 'MX'],
  ['ZAR', 'Rand południowoafrykański', 'ZA'],
  ['BRL', 'Real brazylijski', 'BR'],
  ['MYR', 'Ringgit malezyjski', 'MY'],
  ['IDR', 'Rupia indonezyjska', 'ID'],
  ['INR', 'Rupia indyjska', 'IN'],
  ['KRW', 'Won południowokoreański', 'KR', 0],
  ['SGD', 'Dolar singapurski', 'SG'],
  ['HKD', 'Dolar Hongkongu', 'HK'],
  ['THB', 'Bat tajski', 'TH'],
  ['XDR', 'SDR Międzynarodowego Funduszu Walutowego', 'UN'],
  ['AFN', 'Afgani afgański', 'AF'],
  ['MGA', 'Ariary malgaski', 'MG'],
  ['PAB', 'Balboa panamski', 'PA'],
  ['ETB', 'Birr etiopski', 'ET'],
  ['VES', 'Boliwar soberano', 'VE'],
  ['BOB', 'Boliwiano boliwijskie', 'BO'],
  ['CRC', 'Colon kostarykański', 'CR'],
  ['SVC', 'Colon salwadorski', 'SV'],
  ['NIO', 'Cordoba oro', 'NI'],
  ['GMD', 'Dalasi gambijskie', 'GM'],
  ['MKD', 'Denar macedoński', 'MK'],
  ['DZD', 'Dinar algierski', 'DZ'],
  ['BHD', 'Dinar bahrajski', 'BH'],
  ['IQD', 'Dinar iracki', 'IQ'],
  ['JOD', 'Dinar jordański', 'JO'],
  ['KWD', 'Dinar kuwejcki', 'KW'],
  ['LYD', 'Dinar libijski', 'LY'],
  ['RSD', 'Dinar serbski', 'RS'],
  ['TND', 'Dinar tunezyjski', 'TN'],
  ['MAD', 'Dirham marokański', 'MA'],
  ['AED', 'Dirham ZEA', 'AE'],
  ['STN', 'Dobra Wysp Świętego Tomasza i Książęcej', 'ST'],
  ['BSD', 'Dolar bahamski', 'BS'],
  ['BBD', 'Dolar barbadoski', 'BB'],
  ['BZD', 'Dolar belizeński', 'BZ'],
  ['BND', 'Dolar brunejski', 'BN'],
  ['FJD', 'Dolar Fidżi', 'FJ'],
  ['GYD', 'Dolar gujański', 'GY'],
  ['JMD', 'Dolar jamajski', 'JM'],
  ['LRD', 'Dolar liberyjski', 'LR'],
  ['NAD', 'Dolar namibijski', 'NA'],
  ['SRD', 'Dolar surinamski', 'SR'],
  ['TTD', 'Dolar Trynidadu i Tobago', 'TT'],
  ['XCD', 'Dolar wschodniokaraibski', 'UN'],
  ['SBD', 'Dolar Wysp Salomona', 'SB'],
  ['VND', 'Dong wietnamski', 'VN'],
  ['AMD', 'Dram armeński', 'AM'],
  ['CVE', 'Escudo Zielonego Przylądka', 'CV'],
  ['AWG', 'Florin arubański', 'AW'],
  ['BIF', 'Frank burundyjski', 'BI'],
  ['XOF', 'Frank CFA BCEAO', 'UN'],
  ['XAF', 'Frank CFA BEAC', 'UN'],
  ['XPF', 'Frank CFP', 'UN'],
  ['DJF', 'Frank Dżibuti', 'DJ'],
  ['GNF', 'Frank gwinejski', 'GN'],
  ['KMF', 'Frank Komorów', 'KM'],
  ['CDF', 'Frank kongijski', 'CD'],
  ['RWF', 'Frank rwandyjski', 'RW'],
  ['EGP', 'Funt egipski', 'EG'],
  ['GIP', 'Funt gibraltarski', 'GI'],
  ['LBP', 'Funt libański', 'LB'],
  ['SSP', 'Funt południowosudański', 'SS'],
  ['SDG', 'Funt sudański', 'SD'],
  ['SYP', 'Funt syryjski', 'SY'],
  ['GHS', 'Cedi ghańskie', 'GH'],
  ['HTG', 'Gourde haitańskie', 'HT'],
  ['PYG', 'Guarani paragwajskie', 'PY'],
  ['XCG', 'Gulden karaibski', 'CW'],
  ['PGK', 'Kina papuaska', 'PG'],
  ['LAK', 'Kip laotański', 'LA'],
  ['MWK', 'Kwacha malawijska', 'MW'],
  ['ZMW', 'Kwacha zambijska', 'ZM'],
  ['AOA', 'Kwanza angolska', 'AO'],
  ['MMK', 'Kyat birmański', 'MM'],
  ['GEL', 'Lari gruzińskie', 'GE'],
  ['MDL', 'Lej mołdawski', 'MD'],
  ['ALL', 'Lek albański', 'AL'],
  ['HNL', 'Lempira honduraska', 'HN'],
  ['SLE', 'Leone sierraleoński', 'SL'],
  ['SZL', 'Lilangeni Eswatini', 'SZ'],
  ['LSL', 'Loti lesotyjskie', 'LS'],
  ['AZN', 'Manat azerski', 'AZ'],
  ['MZN', 'Metical mozambicki', 'MZ'],
  ['NGN', 'Naira nigeryjska', 'NG'],
  ['ERN', 'Nakfa erytrejska', 'ER'],
  ['TWD', 'Nowy dolar tajwański', 'TW'],
  ['TMT', 'Manat turkmeński', 'TM'],
  ['MRU', 'Ouguiya mauretańska', 'MR'],
  ['TOP', 'Paʻanga tongijska', 'TO'],
  ['MOP', 'Pataca Makau', 'MO'],
  ['ARS', 'Peso argentyńskie', 'AR'],
  ['DOP', 'Peso dominikańskie', 'DO'],
  ['COP', 'Peso kolumbijskie', 'CO'],
  ['CUP', 'Peso kubańskie', 'CU'],
  ['UYU', 'Peso urugwajskie', 'UY'],
  ['BWP', 'Pula botswańska', 'BW'],
  ['GTQ', 'Quetzal gwatemalski', 'GT'],
  ['IRR', 'Rial irański', 'IR'],
  ['YER', 'Rial jemeński', 'YE'],
  ['QAR', 'Rial katarski', 'QA'],
  ['OMR', 'Rial omański', 'OM'],
  ['SAR', 'Rial saudyjski', 'SA'],
  ['KHR', 'Riel kambodżański', 'KH'],
  ['BYN', 'Rubel białoruski', 'BY'],
  ['RUB', 'Rubel rosyjski', 'RU'],
  ['LKR', 'Rupia lankijska', 'LK'],
  ['MVR', 'Rupia malediwska', 'MV'],
  ['MUR', 'Rupia Mauritiusu', 'MU'],
  ['NPR', 'Rupia nepalska', 'NP'],
  ['PKR', 'Rupia pakistańska', 'PK'],
  ['SCR', 'Rupia seszelska', 'SC'],
  ['PEN', 'Sol peruwiański', 'PE'],
  ['KGS', 'Som kirgiski', 'KG'],
  ['TJS', 'Somoni tadżyckie', 'TJ'],
  ['UZS', 'Sum uzbecki', 'UZ'],
  ['KES', 'Szyling kenijski', 'KE'],
  ['SOS', 'Szyling somalijski', 'SO'],
  ['TZS', 'Szyling tanzański', 'TZ'],
  ['UGX', 'Szyling ugandyjski', 'UG'],
  ['BDT', 'Taka bengalska', 'BD'],
  ['WST', 'Tala samoańska', 'WS'],
  ['KZT', 'Tenge kazachskie', 'KZ'],
  ['MNT', 'Tugrik mongolski', 'MN'],
  ['VUV', 'Vatu vanuackie', 'VU'],
  ['BAM', 'Marka zamienna Bośni i Hercegowiny', 'BA'],
  ['ZWG', 'Zimbabwe Gold', 'ZW']
];

export const CURRENCIES: CurrencyInfo[] = NBP_CURRENCIES.map(([code, name, countryCode, decimals]) => ({
  code,
  name,
  countryCode,
  symbol: currencySymbol(code),
  ...(decimals === undefined ? {} : { decimals })
}));

export const DEFAULT_CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP', 'NOK', 'SEK'];

export const currencyByCode = (code: string): CurrencyInfo =>
  CURRENCIES.find((currency) => currency.code === code) ?? {
    code,
    name: code,
    countryCode: 'UN',
    symbol: code
  };

export const flagAsset = (countryCode: string): string =>
  `${import.meta.env.BASE_URL}flags/${/^[A-Z]{2}$/.test(countryCode) ? countryCode.toLowerCase() : 'un'}.svg`;

const REGION_BASE: Record<string, string> = {
  ...Object.fromEntries(NBP_CURRENCIES.filter(([, , countryCode]) => !['EU', 'UN'].includes(countryCode)).map(([code, , countryCode]) => [countryCode, code])),
  AT: 'EUR', BE: 'EUR', BG: 'EUR', CY: 'EUR', DE: 'EUR', EE: 'EUR', ES: 'EUR', FI: 'EUR', FR: 'EUR', GR: 'EUR', HR: 'EUR', IE: 'EUR', IT: 'EUR', LT: 'EUR', LU: 'EUR', LV: 'EUR', MT: 'EUR', NL: 'EUR', PT: 'EUR', SI: 'EUR', SK: 'EUR',
  AD: 'EUR', MC: 'EUR', ME: 'EUR', SM: 'EUR', VA: 'EUR',
  BJ: 'XOF', BF: 'XOF', CI: 'XOF', GW: 'XOF', ML: 'XOF', NE: 'XOF', SN: 'XOF', TG: 'XOF',
  CM: 'XAF', CF: 'XAF', TD: 'XAF', CG: 'XAF', GQ: 'XAF', GA: 'XAF',
  PF: 'XPF', NC: 'XPF', WF: 'XPF',
  AI: 'XCD', AG: 'XCD', DM: 'XCD', GD: 'XCD', MS: 'XCD', KN: 'XCD', LC: 'XCD', VC: 'XCD', SX: 'XCG'
};

export const currencyFromLocale = (): string => {
  const locale = navigator.languages?.[0] ?? navigator.language;
  const region = locale.match(/[-_]([A-Za-z]{2})\b/)?.[1]?.toUpperCase();
  return (region && REGION_BASE[region]) || 'PLN';
};
