<div align="right">

**🇬🇧 English** · [🇵🇱 Polski](README.pl.md)

</div>

# Waluta 3310

### A currency calculator living in two worlds: iconic Retro LCD and a colorful, modern mobile interface.

**Web · PWA · Android · iOS · 30 currencies · offline mode · no ads**

Waluta 3310 combines a full calculator with simultaneous multi-currency conversion. It works without an account or a proprietary backend, remembers the latest exchange rates and lets you switch the entire interface between a raw retro display and a polished contemporary design.

## Highlights

- Convert between 2 and 8 currencies at the same time.
- Browse 30 popular currencies with search, flags and symbols.
- Use a full calculator directly connected to the base amount.
- Switch between persistent Retro LCD and Modern UI themes.
- Detect the local currency automatically and change the base with SWAP.
- Fall back across four exchange-rate providers automatically.
- Keep the last valid rates available offline with their update date.
- Install as a PWA or build the native Android and iOS Capacitor projects.
- No ads, in-app purchases, user accounts or proprietary analytics.

## Security and privacy

- No API keys, access tokens or secrets in the client application.
- A dedicated expression parser with no `eval`.
- API response validation, request timeouts and a restrictive CSP.
- Production builds have no source maps; Android uses R8 and resource shrinking.
- Error reporting opens the user's email application only after an explicit action.

Minification discourages casual inspection but is not cryptographic source-code protection. Secrets must never be stored in `VITE_*` variables.

## Run locally

Node.js 22+ and npm are required.

```bash
npm install
npm run dev
```

Production build and full quality gate:

```bash
npm run build
npm run test:qa
npm run preview
```

## Android and iOS

Native projects are available in `android/` and `ios/`. Synchronize them after changing the web application:

```bash
npm run cap:sync
```

Android requires JDK 21 and Android SDK 36. iOS builds require macOS, Xcode, CocoaPods and an active Apple Developer signing identity. The application identifier is `pl.waluta3310.app`.

## Releases

The GitHub workflow prepares one release containing:

- `app-release.apk`
- `app-release.ipa`
- automatically generated source-code archives in ZIP and TAR.GZ formats

Publishing stops when genuine signing credentials are unavailable, preventing unsigned or placeholder packages from being released.

## Technology

React 19 · TypeScript · Vite · Capacitor 8 · Vitest · Testing Library · PWA

## Documentation

- [Privacy policy](PRIVACY.md)
- [License](LICENSE.md)
- [Store release checklist](STORE_RELEASE.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)

Exchange rates are informational and may be delayed. This application does not provide financial advice.
