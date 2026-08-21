import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pl.waluta3310.app',
  appName: 'Currency Calculator 3310',
  webDir: 'dist',
  backgroundColor: '#151915',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },
  android: {
    allowMixedContent: false
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  }
};

export default config;
