# Stan projektu

Ostatnia aktualizacja: 21 sierpnia 2026

## Zrobione

- Utworzono aplikację React + TypeScript + Vite od zera.
- Powstał kalkulator bez `eval`, multi-przelicznik i wybór od 2 do 8 walut.
- Dodano 30 walut, flagi emoji, formatowanie kwot i zmianę waluty bazowej.
- Dodano cztery źródła kursów z automatycznym failover i limitem czasu.
- Dodano pamięć kursów na godzinę oraz użycie starych kursów offline.
- Dodano dwie zapamiętywane skórki: `retro` i `modern`.
- Dodano PWA, service worker, manifest i konfigurację Capacitor Android/iOS.
- Utworzono kompletne katalogi `android/` i `ios/`, zaktualizowane do Capacitor 8.5.
- Android ma minSdk 24, compileSdk/targetSdk 36, AGP 8.13 i Gradle 8.14.3.
- iOS ma minimalną wersję 15.0 i cykl życia UIScene.
- Dodano CSP, walidację danych, brak map źródłowych i brak sekretów w kliencie.
- Dodano przycisk zgłoszenia błędu do `mechagdynia@gmail.com` przez program pocztowy użytkownika.
- Dodano licencję, politykę prywatności, informacje o usługach zewnętrznych i listę publikacji sklepowej.
- Komentarze opisowe są przechowywane w tym folderze, a nie w kodzie.

## Zweryfikowane

- `npm install` zakończone; istnieje blokada wersji `package-lock.json`.
- TypeScript oraz produkcyjny build Vite zakończone bez błędów.
- Parser kalkulatora przeszedł 10/10 testów, także dzielenie przez zero i niedozwolone znaki.
- Publiczne API Frankfurter odpowiedziało kodem 200 dla PLN i zwróciło 29 kursów.
- PWA zwraca kod 200 dla strony, manifestu, service workera i obu ikon PNG.
- Web build został zsynchronizowany do Androida i iOS.
- Dodano trwały pakiet Vitest + Testing Library: 6 plików, 57/57 testów zaliczonych.
- Lokalny podgląd produkcyjny działa pod `http://127.0.0.1:4173/`.
- Dodano workflow jednego GitHub Release z podpisanymi APK/IPA i automatycznymi archiwami źródeł.

## Pozostało przed publikacją

- Ręcznie obejrzeć obie skórki; automatyczna przeglądarka nie była dostępna w sesji.
- Zbudować i podpisać AAB w Android Studio z JDK 21 oraz Android SDK 36; na komputerze wykryto tylko Java 8 i brak Android SDK.
- Na macOS uruchomić CocoaPods/Xcode, zbudować Archive i podpisać iOS.
- Ustawić ostateczny, unikalny identyfikator pakietu zgodny z kontami sklepów.
- Opublikować politykę prywatności pod adresem HTTPS i wypełnić formularze sklepowe.
- Skonfigurować sekrety podpisu Android i Apple na GitHubie, uruchomić workflow i sprawdzić szkic `v1.0.0`.

## Najważniejsza decyzja

Aplikacja nie ma backendu, kont użytkowników, stałego tokenu ani kluczy API. Korzysta bezpośrednio z publicznych źródeł kursów. Kod web jest standardowo zminifikowany, mapy źródłowe są wyłączone, a wydanie Android ma włączone R8 i zmniejszanie zasobów.
