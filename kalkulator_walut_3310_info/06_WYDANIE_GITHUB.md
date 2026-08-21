# Wydanie GitHub v1.0.0

## Zakres

- Jedno wydanie zawiera podpisany `app-release.apk` i `app-release.ipa`.
- GitHub automatycznie dodaje archiwa kodu źródłowego ZIP i TAR.GZ dla taga.
- Wydanie powstaje jako szkic i wymaga ręcznego opublikowania po sprawdzeniu plików.

## Automatyzacja

- Plik `.github/workflows/release.yml` uruchamia testy, buduje Android i iOS oraz tworzy szkic Release.
- Android używa JDK 21, Android SDK z runnera i podpisu przechowywanego wyłącznie w GitHub Secrets.
- iOS używa macOS, Xcode, certyfikatu dystrybucyjnego i profilu App Store przechowywanych wyłącznie w GitHub Secrets.
- Brak któregokolwiek sekretu zatrzymuje publikację zamiast tworzyć niepodpisany lub fałszywy plik.

## Sekrety GitHub

Android:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

iOS:

- `IOS_CERTIFICATE_BASE64`
- `IOS_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`
- `IOS_TEAM_ID`

## Stan

- Konto docelowe: `mechagdynia`.
- E-mail autora: `mechagdynia@gmail.com`.
- Repozytorium docelowe: `Kalkulator_walut_3310`.
- Wersja: `1.0.0`.
- Tag: `v1.0.0`.
- Prywatne repozytorium utworzono i wysłano gałąź `main`.
- Podpisane pliki nie zostały jeszcze zbudowane, ponieważ sekrety wydawnicze nie są skonfigurowane.
