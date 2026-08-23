export type Language = 'pl' | 'en';

export const languageFromLocale = (): Language =>
  (navigator.languages?.[0] ?? navigator.language).toLowerCase().startsWith('pl') ? 'pl' : 'en';

export const COPY = {
  pl: {
    appName: 'Waluta 3310',
    fiatTab: 'WALUTY',
    cryptoTab: 'KRYPTO',
    mixedTab: 'WALUTY/KRYPTO',
    connecting: 'ŁĄCZENIE…',
    offlineLast: 'OFFLINE · OSTATNIA AKTUALIZACJA',
    missing: 'BRAK',
    noRates: 'BRAK KURSÓW',
    online: 'ONLINE',
    report: 'ZGŁOŚ',
    refresh: 'Odśwież kursy',
    ratesCurrent: 'Kursy aktualne',
    modernTheme: 'Włącz motyw nowoczesny',
    retroTheme: 'Włącz motyw retro 3310',
    edit: 'EDYTUJ',
    editFiat: 'Edytuj listę walut',
    editCrypto: 'Edytuj listę kryptowalut',
    editMixed: 'Zmień walutę i listę kryptowalut',
    convertedFiat: 'Przeliczone waluty',
    convertedCrypto: 'Przeliczone kryptowaluty',
    convertedMixed: 'Przeliczone waluty i kryptowaluty',
    fiatTitle: 'MULTI CONVERTER',
    cryptoTitle: 'CRYPTO CONVERTER',
    mixedTitle: 'FIAT + CRYPTO',
    calculatorDisplay: 'Wyświetlacz kalkulatora',
    swapBase: 'Zmień walutę bazową na następną',
    error: 'BŁĄD',
    keypad: 'Klawiatura kalkulatora',
    deleteLast: 'Usuń ostatni znak',
    fiatRange: '2–8 WALUT',
    cryptoRange: '2–8 KRYPTOWALUT',
    mixedRange: '1 WALUTA + 1–7 KRYPTO',
    yourList: 'Twoja lista',
    close: 'Zamknij',
    searchFiat: 'Kod lub nazwa waluty',
    searchCrypto: 'Kod lub nazwa kryptowaluty',
    searchMixed: 'Waluta lub kryptowaluta',
    searchFiatLabel: 'Szukaj waluty',
    searchCryptoLabel: 'Szukaj kryptowaluty',
    searchMixedLabel: 'Szukaj waluty lub kryptowaluty',
    selected: 'wybranych',
    done: 'GOTOWE',
    flag: 'Flaga',
    language: 'Zmień język na angielski'
  },
  en: {
    appName: 'Currency Calculator 3310',
    fiatTab: 'CURRENCIES',
    cryptoTab: 'CRYPTO',
    mixedTab: 'FIAT/CRYPTO',
    connecting: 'CONNECTING…',
    offlineLast: 'OFFLINE · LAST UPDATE',
    missing: 'NONE',
    noRates: 'NO RATES',
    online: 'ONLINE',
    report: 'REPORT',
    refresh: 'Refresh rates',
    ratesCurrent: 'Rates are current',
    modernTheme: 'Enable modern theme',
    retroTheme: 'Enable retro 3310 theme',
    edit: 'EDIT',
    editFiat: 'Edit currency list',
    editCrypto: 'Edit cryptocurrency list',
    editMixed: 'Change fiat currency and crypto list',
    convertedFiat: 'Converted currencies',
    convertedCrypto: 'Converted cryptocurrencies',
    convertedMixed: 'Converted currencies and cryptocurrencies',
    fiatTitle: 'MULTI CONVERTER',
    cryptoTitle: 'CRYPTO CONVERTER',
    mixedTitle: 'FIAT + CRYPTO',
    calculatorDisplay: 'Calculator display',
    swapBase: 'Change to the next base asset',
    error: 'ERROR',
    keypad: 'Calculator keypad',
    deleteLast: 'Delete the last character',
    fiatRange: '2–8 CURRENCIES',
    cryptoRange: '2–8 CRYPTO ASSETS',
    mixedRange: '1 FIAT + 1–7 CRYPTO',
    yourList: 'Your list',
    close: 'Close',
    searchFiat: 'Currency code or name',
    searchCrypto: 'Crypto code or name',
    searchMixed: 'Currency or cryptocurrency',
    searchFiatLabel: 'Search currencies',
    searchCryptoLabel: 'Search cryptocurrencies',
    searchMixedLabel: 'Search currencies and cryptocurrencies',
    selected: 'selected',
    done: 'DONE',
    flag: 'Flag',
    language: 'Zmień język na polski'
  }
} as const;

export const currencyDisplayName = (code: string, fallback: string, language: Language): string => {
  try {
    const name = new Intl.DisplayNames([language], { type: 'currency' }).of(code) ?? fallback;
    return name.charAt(0).toLocaleUpperCase(language) + name.slice(1);
  } catch {
    return fallback;
  }
};
