# Mapa plików

## Konfiguracja główna

- `package.json` — zależności i komendy dev/build/Capacitor.
- `package-lock.json` — dokładne wersje zależności; pojawi się po instalacji.
- `tsconfig.json` — TypeScript dla aplikacji.
- `tsconfig.node.json` — TypeScript dla konfiguracji Vite i Capacitor.
- `vite.config.ts` — build web, minifikacja, brak sourcemap, serwer lokalny.
- `vitest.config.ts` — środowisko i parametry testów automatycznych.
- `capacitor.config.ts` — identyfikator, nazwa i ustawienia Android/iOS.
- `index.html` — wejście aplikacji, meta, CSP, manifest.
- `.gitignore` — pliki pomijane w repozytorium.
- `.env.example` — informuje, że aplikacja nie wymaga sekretów.
- `.github/workflows/release.yml` — testy, podpisane buildy mobilne i jeden szkic GitHub Release.
- `.github/workflows/deploy.yml` — automatyczny build Vite i publikacja folderu `dist/` na GitHub Pages.

## Kod aplikacji

- `src/main.tsx` — start React i rejestracja service workera.
- `src/App.tsx` — główny stan, persystencja, motyw, zmiana bazy i zgłoszenie e-mail.
- `src/styles.css` — cały wygląd obu skórek i responsywność.
- `src/vite-env.d.ts` — typy środowiska Vite.
- `src/types/currency.ts` — typy waluty, snapshotu i stanu połączenia.
- `src/data/currencies.ts` — katalog walut, flagi, symbole i dobór waluty z regionu.
- `src/data/cryptocurrencies.ts` — katalog 30 kryptowalut, symbole i kolory.
- `src/i18n.ts` — teksty polskie i angielskie oraz wykrywanie języka.
- `src/utils/calculator.ts` — bezpieczny parser działań i obsługa klawiszy.
- `src/utils/format.ts` — format kwot oraz daty kursu.
- `src/services/storage.ts` — bezpieczny odczyt/zapis localStorage.
- `src/services/rate-service.ts` — cache, walidacja, timeout i failover API.
- `src/hooks/useRates.ts` — stan ładowania kursów dla React.
- `src/components/StatusBar.tsx` — status sieci, odświeżanie, zgłoszenie i motyw.
- `src/components/AssetTabs.tsx` — zakładki Waluty i Krypto.
- `src/components/CryptoBadge.tsx` — kolorowe oznaczenia kryptowalut.
- `src/components/CurrencyFlag.tsx` — lokalna flaga Flagpedii z tekstem alternatywnym.
- `src/components/CurrencyList.tsx` — lista przeliczonych walut.
- `src/components/CalculatorDisplay.tsx` — pasek działania, wyniku i SWAP.
- `src/components/Keypad.tsx` — klawiatura ekranowa i fizyczna.
- `src/components/CurrencyPicker.tsx` — wyszukiwarka i wybór walut.

## PWA i grafika

- `public/manifest.webmanifest` — instalacja PWA i dane ikon.
- `public/manifest.pl.webmanifest` — polska nazwa i opis instalowanej PWA.
- `public/sw.js` — cache powłoki oraz działanie offline.
- `public/icon.svg` — wektorowa ikona źródłowa.
- `public/icon-192.png` — mała ikona PWA; generowana z SVG.
- `public/icon-512.png` — duża ikona PWA; generowana z SVG.
- `public/flags/` — lokalne flagi SVG z Flagpedii dla katalogu NBP.

## Dokumenty

- `README.md` — międzynarodowa instrukcja po angielsku i przełącznik języka.
- `README.pl.md` — pełna instrukcja po polsku i przełącznik języka.
- `LICENSE.md` — bezpłatna licencja użytkownika końcowego.
- `PRIVACY.md` — polityka prywatności.
- `THIRD_PARTY_NOTICES.md` — biblioteki, API i znaki towarowe.
- `STORE_RELEASE.md` — lista kontrolna Google Play i Apple App Store.
- `kalkulator_walut_3310_info/00_STAN_PROJEKTU.md` — aktualny postęp.
- `kalkulator_walut_3310_info/01_KONCEPT.md` — pełny koncept produktu.
- `kalkulator_walut_3310_info/02_MAPA_PLIKOW.md` — przeznaczenie wszystkich plików.
- `kalkulator_walut_3310_info/03_WZNOWIENIE_PRACY.md` — szybki start po przerwaniu pracy.
- `kalkulator_walut_3310_info/04_PLIKI_NATYWNE.md` — mapa projektów Android i iOS.
- `kalkulator_walut_3310_info/05_RAPORT_QA_2026-08-21.md` — końcowy raport testów senior QA.
- `kalkulator_walut_3310_info/06_WYDANIE_GITHUB.md` — konfiguracja i stan wydania `v1.0.0`.
- `kalkulator_walut_3310_info/07_OPIS_WYDANIA_v1.0.0.md` — publiczny opis GitHub Release.
- `kalkulator_walut_3310_info/08_PODPIS_ANDROID.md` — niepoufne odciski i zasady przechowania klucza Android.

## Testy

- `tests/setup.ts` — wspólne czyszczenie DOM i localStorage.
- `tests/calculator.test.ts` — parser, operatory, błędne dane i sekwencje klawiszy.
- `tests/storage.test.ts` — zapis, błędny JSON i brak miejsca.
- `tests/rate-service.test.ts` — cache, walidacja, cztery źródła i offline.
- `tests/app.test.tsx` — integracja React, motywy, kalkulator, SWAP, modal i błędy.
- `tests/currencies-format.test.ts` — katalog walut, flagi i formatowanie.
- `tests/build-security.test.ts` — build, CSP, PWA, sekrety, Android i iOS.

## Katalogi generowane

- `dist/` — gotowy build web; generowany przez `npm run build`.
- `node_modules/` — zainstalowane zależności.
- `android/` — gotowy natywny projekt Android Capacitor 8/API 36.
- `ios/` — gotowy natywny projekt iOS Capacitor 8/iOS 15.
