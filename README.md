# Waluta 3310

Mobilny kalkulator i multi-przelicznik walut działający jako strona WWW, instalowalna PWA oraz aplikacja Android/iOS przez Capacitor. Ma dwie zapamiętywane skórki: retro LCD i współczesną kolorową.

## Uruchomienie

Wymagane są Node.js 22+ i npm.

```bash
npm install
npm run dev
```

Produkcja i podgląd:

```bash
npm run build
npm run preview
```

## Android i iOS

Projekty natywne znajdują się już w repozytorium. Po każdej zmianie wersji web należy je zsynchronizować:

```bash
npm run cap:sync
```

Android wymaga Android Studio, JDK 21 i Android SDK 36. Kompilacja iOS wymaga macOS z Xcode i CocoaPods. Przed publikacją należy ustawić własny, unikalny `appId` w `capacitor.config.ts` i identyczny identyfikator w kontach sklepów.

## Bezpieczeństwo

- Brak kluczy API, tokenów i sekretów w kodzie klienta.
- Brak `eval`; działania matematyczne obsługuje własny parser.
- Content Security Policy ogranicza skrypty, obrazy i połączenia sieciowe.
- Kursy są walidowane przed użyciem, żądania mają limit czasu, a build nie zawiera map źródłowych.
- Cache kursów działa przez godzinę i pozwala użyć ostatnich danych offline.
- Raport błędu jest wysyłany wyłącznie po zatwierdzeniu przez użytkownika w aplikacji pocztowej.

Minifikacja utrudnia przypadkowe czytanie paczki, ale — tak jak w innych aplikacjach webowych i hybrydowych — nie stanowi ochrony kryptograficznej kodu. Sekretów nie należy dodawać do zmiennych `VITE_*`, ponieważ są publiczne w gotowej aplikacji.

## Publikacja

Metadane, polityka prywatności, zrzuty ekranów, klasyfikacja wiekowa oraz formularze bezpieczeństwa danych muszą zostać uzupełnione w Google Play Console i App Store Connect zgodnie z faktyczną wersją wydania. Aplikacja nie udziela porad finansowych; kursy są informacyjne.
