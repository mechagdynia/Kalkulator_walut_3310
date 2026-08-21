<div align="right">

[🇬🇧 English](README.md) · **🇵🇱 Polski**

</div>

# Waluta 3310

### Kalkulator i przelicznik walut w dwóch światach: kultowe Retro LCD oraz lekki, kolorowy Modern UI.

**Web · PWA · Android · iOS · 30 walut · tryb offline · bez reklam**

Waluta 3310 łączy pełny kalkulator z jednoczesnym przeliczaniem wielu walut. Aplikacja działa bez konta i własnego backendu, zapamiętuje ostatnie kursy oraz pozwala przełączyć cały interfejs między surową stylistyką retro a współczesnym wyglądem mobilnym.

## Dlaczego warto

- Przeliczanie od 2 do 8 walut jednocześnie.
- 30 popularnych walut z wyszukiwaniem, flagami i symbolami.
- Kalkulator działań połączony bezpośrednio z kwotą bazową.
- Dwie zapamiętywane skórki: Retro LCD i Modern UI.
- Automatyczny wybór waluty lokalnej oraz szybka funkcja SWAP.
- Cztery źródła kursów z automatycznym przełączeniem awaryjnym.
- Ostatnie poprawne kursy pozostają dostępne offline wraz z datą aktualizacji.
- Instalowalna PWA oraz natywne projekty Android i iOS przez Capacitor.
- Brak reklam, zakupów w aplikacji, kont użytkowników i własnej analityki.

## Bezpieczeństwo i prywatność

- Brak kluczy API, tokenów i sekretów w kodzie aplikacji.
- Własny parser kalkulatora bez `eval`.
- Walidacja odpowiedzi API, limit czasu zapytań i restrykcyjna polityka CSP.
- Produkcyjny build bez map źródłowych; Android korzysta z R8 i zmniejszania zasobów.
- Zgłoszenie problemu otwiera program pocztowy dopiero po działaniu użytkownika.

Minifikacja utrudnia przypadkowe czytanie paczki, ale nie stanowi kryptograficznej ochrony kodu. Sekretów nie należy umieszczać w zmiennych `VITE_*`.

## Uruchomienie lokalne

Wymagane są Node.js 22+ i npm.

```bash
npm install
npm run dev
```

Produkcja i pełna kontrola jakości:

```bash
npm run build
npm run test:qa
npm run preview
```

## Android i iOS

Projekty natywne znajdują się w katalogach `android/` i `ios/`. Po zmianach warstwy webowej należy je zsynchronizować:

```bash
npm run cap:sync
```

Android wymaga JDK 21 i Android SDK 36. Kompilacja iOS wymaga macOS, Xcode, CocoaPods oraz aktywnego podpisu Apple Developer. Identyfikator aplikacji to `pl.waluta3310.app`.

## Wydania

Workflow GitHub przygotowuje jedno wydanie zawierające:

- `app-release.apk`
- `app-release.ipa`
- automatyczne archiwa kodu źródłowego ZIP i TAR.GZ

Publikacja zatrzymuje się, gdy brakuje prawdziwych danych podpisujących. Dzięki temu repozytorium nie udostępnia niepodpisanych ani fikcyjnych paczek.

## Technologie

React 19 · TypeScript · Vite · Capacitor 8 · Vitest · Testing Library · PWA

## Dokumentacja

- [Polityka prywatności](PRIVACY.md)
- [Licencja](LICENSE.md)
- [Lista publikacji sklepowej](STORE_RELEASE.md)
- [Informacje o usługach zewnętrznych](THIRD_PARTY_NOTICES.md)

Kursy mają charakter informacyjny i mogą być opóźnione. Aplikacja nie udziela porad finansowych.
