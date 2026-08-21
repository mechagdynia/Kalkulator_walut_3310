import { describe, expect, it, vi } from 'vitest';
import { readStorage, writeStorage } from '../src/services/storage';

describe('storage', () => {
  it('zapisuje i odczytuje dane z prefiksem', () => {
    writeStorage('theme', 'modern');
    expect(localStorage.getItem('waluta3310:theme')).toBe('"modern"');
    expect(readStorage('theme', 'retro')).toBe('modern');
  });

  it('zwraca wartość domyślną dla uszkodzonego JSON', () => {
    localStorage.setItem('waluta3310:bad', '{bad');
    expect(readStorage('bad', ['fallback'])).toEqual(['fallback']);
  });

  it('nie przerywa działania po błędzie zapisu', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => writeStorage('key', 'value')).not.toThrow();
  });
});
