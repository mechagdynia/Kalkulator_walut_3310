import { describe, expect, it } from 'vitest';
import { evaluateExpression, pressCalculatorKey } from '../src/utils/calculator';

describe('evaluateExpression', () => {
  it.each([
    ['0', 0],
    ['100+25.5*2', 151],
    ['2+3*4', 14],
    ['20/4-3', 2],
    ['-5+2', -3],
    ['5.', 5],
    ['1,5+2,5', 4],
    ['1÷4', 0.25],
    ['3×7', 21]
  ])('oblicza %s', (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  it.each(['9/0', '(2+3)', '1a2', '', '-', '1..2', '2/**3', 'Infinity', '2^3'])('odrzuca %s', (expression) => {
    expect(evaluateExpression(expression)).toBeNull();
  });

  it('respektuje kolejność działań', () => {
    expect(evaluateExpression('100-20/4*3+2')).toBe(87);
  });
});

describe('pressCalculatorKey', () => {
  it('realizuje pełną sekwencję kalkulatora', () => {
    const keys = ['AC', '1', '0', '+', '5', '×', '2', '='];
    expect(keys.reduce(pressCalculatorKey, '0')).toBe('20');
  });

  it('obsługuje procent, zmianę znaku i kasowanie', () => {
    expect(pressCalculatorKey('9', '%')).toBe('0.09');
    expect(pressCalculatorKey('9', '+/−')).toBe('-9');
    expect(pressCalculatorKey('123', 'DEL')).toBe('12');
    expect(pressCalculatorKey('1', 'DEL')).toBe('0');
  });

  it('nie pozwala na dwie kropki ani dwa operatory', () => {
    expect(pressCalculatorKey('1.2', '.')).toBe('1.2');
    expect(pressCalculatorKey('10+', '×')).toBe('10×');
  });

  it('ogranicza długość wejścia', () => {
    const long = '1'.repeat(32);
    expect(pressCalculatorKey(long, '2')).toBe(long);
  });
});
