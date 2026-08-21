import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve('.');
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const walk = (directory: string): string[] => readdirSync(directory).flatMap((entry) => {
  const path = join(directory, entry);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

describe('build i bezpieczeństwo', () => {
  it('ma produkcyjny build bez map źródłowych', () => {
    const files = walk(join(root, 'dist'));
    expect(files.some((file) => file.endsWith('.map'))).toBe(false);
    expect(files.some((file) => file.endsWith('.js'))).toBe(true);
    expect(files.some((file) => file.endsWith('.css'))).toBe(true);
  });

  it('ogranicza CSP do znanych źródeł', () => {
    const html = read('index.html');
    expect(html).toContain("script-src 'self'");
    expect(html).toContain("object-src 'none'");
    expect(html).toContain("frame-ancestors 'none'");
    expect(html).not.toContain("'unsafe-eval'");
  });

  it('ma kompletną instalację PWA', () => {
    const manifest = JSON.parse(read('public/manifest.webmanifest'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.orientation).toBe('portrait');
    expect(existsSync(join(root, 'public/icon-192.png'))).toBe(true);
    expect(existsSync(join(root, 'public/icon-512.png'))).toBe(true);
    expect(JSON.parse(read('public/manifest.pl.webmanifest')).lang).toBe('pl');
    expect(read('public/sw.js')).toContain("const CACHE = 'waluta-3310-v3'");
    expect(readdirSync(join(root, 'public/flags')).filter((file) => file.endsWith('.svg')).length).toBeGreaterThanOrEqual(145);
  });

  it('nie zawiera sekretów ani niebezpiecznego eval w źródłach', () => {
    const source = walk(join(root, 'src')).map((file) => readFileSync(file, 'utf8')).join('\n');
    expect(source).not.toMatch(/\beval\s*\(/);
    expect(source).not.toMatch(/new\s+Function\s*\(/);
    expect(source).not.toMatch(/api[_-]?key\s*[:=]/i);
    expect(source).not.toMatch(/bearer\s+[a-z0-9._-]+/i);
  });

  it('ma utwardzoną konfigurację Android API 36', () => {
    expect(read('android/variables.gradle')).toContain('targetSdkVersion = 36');
    expect(read('android/variables.gradle')).toContain('compileSdkVersion = 36');
    expect(read('android/app/src/main/AndroidManifest.xml')).toContain('android:allowBackup="false"');
    expect(read('android/app/src/main/AndroidManifest.xml')).toContain('android:usesCleartextTraffic="false"');
    expect(read('android/app/build.gradle')).toContain('minifyEnabled = true');
  });

  it('ma projekt iOS 15 z UIScene', () => {
    expect(read('ios/App/Podfile')).toContain("platform :ios, '15.0'");
    expect(read('ios/App/App/Info.plist')).toContain('<key>UIApplicationSceneManifest</key>');
    expect(existsSync(join(root, 'ios/App/App/SceneDelegate.swift'))).toBe(true);
  });
});
