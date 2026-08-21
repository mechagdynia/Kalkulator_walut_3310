# Koncept aplikacji

## Nazwa

Waluta 3310 / Currency Calculator 3310

## Cel

Bezpłatny, szybki kalkulator walut i kryptowalut działający w przeglądarce, jako instalowalna PWA oraz aplikacja Android/iOS. Użytkownik wpisuje działanie matematyczne, a wszystkie wybrane aktywa przeliczają się na żywo. Interfejs działa po polsku i angielsku.

## Układ

- Nad ekranem: zakładki Waluty i Krypto.
- Góra około 40%: lista 2–8 walut albo kryptowalut.
- Środek około 10%: działanie, wynik, waluta bazowa i SWAP.
- Dół około 50%: klawiatura kalkulatora 4×5.
- Brak przewijania głównego ekranu; przewijają się tylko listy.

## Skórka Retro

- Zielony ekran LCD z siatką pikseli i scanlines.
- Monospace, mocny kontrast, fizycznie wyglądające klawisze.
- Ciemna obudowa inspirowana telefonami z początku lat 2000.

## Skórka Modern

- Jasne gradienty, kolor fioletowy i turkusowy, półprzezroczyste karty.
- Miękkie cienie, duże promienie, wygląd inspirowany iOS i Material 3.
- Ta sama ergonomia i funkcjonalność co w skórce Retro.

## Kursy

Waluty tradycyjne korzystają najpierw z tabel A+B NBP, a następnie z Frankfurter/ECB, ExchangeRate-API i Currency API. Kryptowaluty korzystają z publicznego endpointu Coinbase. Po niepowodzeniu źródeł aplikacja używa ostatniego zapisu lokalnego i pokazuje tryb offline. Pamięć świeżych kursów trwa 60 minut dla walut i 5 minut dla kryptowalut.

## Prywatność

Brak analityki, reklam, kont i lokalizacji IP. Region waluty początkowej pochodzi z ustawień językowych urządzenia. Zgłoszenie błędu nie wysyła się samo — otwiera pocztę z treścią do zatwierdzenia.
