# Lista wydania Google Play / Apple App Store

## Wspólne

- Nazwa: **Waluta 3310**
- Kategoria: Finanse lub Narzędzia
- Model: bezpłatna, bez reklam i zakupów w aplikacji
- Kontakt pomocy: `mechagdynia@gmail.com`
- Politykę prywatności z `PRIVACY.md` opublikować pod publicznym adresem HTTPS i wkleić ten adres w obu panelach sklepowych.
- Opis musi zaznaczać, że kursy są informacyjne i mogą być opóźnione.
- Nie używać logo ani materiałów firmy Nokia; obecna grafika jest autorska i tylko stylistycznie nawiązuje do ekranów LCD.

## Google Play

- Wygenerować podpisany Android App Bundle (AAB) w Android Studio.
- Projekt celuje w Android API 36, wymagane dla nowych aplikacji i aktualizacji od 31 sierpnia 2026 r.
- Użyć JDK 21, Android SDK 36 i aktualnego Android Studio zgodnego z Android Gradle Plugin 8.13.
- Włączyć Play App Signing i bezpiecznie zarchiwizować klucz przesyłania.
- W formularzu Data safety ujawnić połączenia z dostawcami kursów oraz brak własnej analityki/reklam.
- Ustawić dostęp sieciowy; aplikacja zachowuje ostatnie kursy offline.
- Przetestować na zamkniętej ścieżce testowej i spełnić aktualny wymagany poziom target API.

## Apple App Store

- Ustawić zespół i podpis w Xcode, następnie przygotować Archive.
- W App Privacy zadeklarować stan zgodny z `PRIVACY.md`; zweryfikować również praktyki dostawców API.
- Jeżeli nie zostanie dodana niestandardowa EULA w App Store Connect, Apple stosuje swoją standardową EULA.
- Projekt ma minimalny system iOS 15 i korzysta z cyklu życia UIScene wymaganego przez aktualny Capacitor.
- Przetestować widoki na aktualnych rozmiarach iPhone, zachowanie bez sieci i otwieranie programu pocztowego.

Wymagania sklepów zmieniają się. Przed wysłaniem wydania trzeba sprawdzić aktualne formularze i zasady w obu konsolach deweloperskich.
