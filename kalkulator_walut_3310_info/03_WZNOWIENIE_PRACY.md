# Wznowienie pracy

1. Przeczytaj `00_STAN_PROJEKTU.md`.
2. Sprawdź `git status --short`, aby nie nadpisać cudzych zmian.
3. Uruchom `npm install`, jeśli nie ma `node_modules`.
4. Uruchom `npm run typecheck` i `npm run build`.
5. Uruchom `npm run dev` i sprawdź skórki Retro/Modern, kalkulator, wybór walut, SWAP i błąd offline.
6. Po zmianach zaktualizuj stan oraz mapę plików w tym folderze.
7. Przy wydaniu przeczytaj `06_WYDANIE_GITHUB.md` i uruchom ręcznie workflow `Release`.

Na tym komputerze globalny `npm` nie jest dostępny. Sprawdzona ścieżka Node to `C:\Users\mecha\AppData\Local\Programs\cursor\resources\app\resources\helpers\node.exe`. Moduł npm znajduje się w instalacji Unity pod `C:\Program Files\Unity\Hub\Editor\6000.5.0f1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\Emscripten\node\node_modules\npm\bin\npm-cli.js`. Przed komendą npm trzeba dodać folder Node do zmiennej PATH tylko dla bieżącego procesu PowerShell.

## Ważne ograniczenia

- Nie dodawać opisowych komentarzy do kodu źródłowego.
- Nie dodawać sekretów ani tokenów do `VITE_*`.
- Nie dodawać backendu bez nowej zgody użytkownika.
- Nie wysyłać e-maila automatycznie; używać jawnego `mailto:`.
- Nie używać logo ani chronionych materiałów firmy Nokia.
- Zachować dwie skórki i pełny ekran bez przewijania głównego widoku.
- Android wymaga JDK 21 i Android SDK 36; Java 8 wykryta w systemie nie wystarczy.
- iOS wymaga macOS, Xcode i CocoaPods.

## Testy krytyczne

- Dzielenie przez zero nie może wyświetlać `Infinity`.
- Niedozwolone znaki nie mogą wejść do parsera.
- Zmiana bazy ma zachować równoważną kwotę.
- Uszkodzone dane API nie mogą trafić do interfejsu.
- Po utracie internetu mają działać kalkulator, skórki i ostatni cache kursów.
- Przycisk `ZGŁOŚ` ma kierować na `mechagdynia@gmail.com` dopiero po błędzie wszystkich źródeł.
