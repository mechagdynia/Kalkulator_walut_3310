# Pliki natywne

## Android

- `android/settings.gradle` — moduły aplikacji i mostu Capacitor.
- `android/build.gradle` — repozytoria i Android Gradle Plugin 8.13.
- `android/variables.gradle` — minSdk 24, compileSdk/targetSdk 36 i wersje AndroidX.
- `android/gradle.properties` — parametry procesu Gradle i AndroidX.
- `android/gradle/wrapper/gradle-wrapper.properties` — Gradle 8.14.3.
- `android/gradlew` i `android/gradlew.bat` — uruchamianie Gradle na macOS/Linux i Windows.
- `android/app/build.gradle` — identyfikator `pl.waluta3310.app`, wersja 1.0, R8 i zależności.
- `android/app/proguard-rules.pro` — dodatkowe reguły R8, obecnie bez własnych wyjątków.
- `android/app/src/main/AndroidManifest.xml` — tylko INTERNET, brak backupu, brak HTTP, orientacja pionowa.
- `android/app/src/main/java/pl/waluta3310/app/MainActivity.java` — natywna aktywność Capacitor.
- `android/app/src/main/res/` — motywy, kolory, splash screen i ikony launchera.
- `android/app/src/main/assets/public/` — kopia ostatniego buildu web.
- `android/app/src/main/assets/capacitor.config.json` — wygenerowana konfiguracja mostu.
- `android/capacitor.settings.gradle` i `android/app/capacitor.build.gradle` — generowane połączenia pluginów.
- `android/capacitor-cordova-android-plugins/` — generowany pusty most zgodności Cordova.
- `android/app/src/test/` i `android/app/src/androidTest/` — szkielety testów natywnych.

## iOS

- `ios/App/Podfile` — CocoaPods, iOS 15 i lokalne moduły Capacitor.
- `ios/App/App.xcodeproj/` — projekt, konfiguracje Debug/Release i lista zasobów.
- `ios/App/App.xcworkspace/` — workspace używany po instalacji CocoaPods.
- `ios/App/App/Info.plist` — nazwa, orientacja pionowa, arm64 i UIScene.
- `ios/App/App/AppDelegate.swift` — cykl życia aplikacji oraz przekazanie linków do Capacitor.
- `ios/App/App/SceneDelegate.swift` — okno aplikacji i most Capacitor dla UIScene.
- `ios/App/App/Base.lproj/Main.storyboard` — główny kontroler widoku.
- `ios/App/App/Base.lproj/LaunchScreen.storyboard` — ekran startowy.
- `ios/App/App/Assets.xcassets/` — AppIcon oraz Splash.
- `ios/App/App/public/` — kopia ostatniego buildu web.
- `ios/App/App/capacitor.config.json` — wygenerowana konfiguracja mostu.

Pliki `public/` wewnątrz Androida i iOS są generowane przez `cap sync`. Nie edytować ich ręcznie; źródła są w głównych `src/` i `public/`.
