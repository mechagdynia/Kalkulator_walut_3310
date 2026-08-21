const MAX_LENGTH = 32;

const normalize = (expression: string): string => expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.');

export function evaluateExpression(expression: string): number | null {
  let input = normalize(expression);
  if (/[^0-9.+\-*/]/.test(input)) return null;
  input = input.replace(/\.$/, '').replace(/[+\-*/]+$/, '');
  if (!input || input === '-') return null;

  const tokens = input.match(/(?:^|[+\-*/])(?:-?\d+(?:\.\d*)?)/g);
  if (!tokens || tokens.join('') !== input) return null;

  const numbers: number[] = [];
  const operations: string[] = [];
  let cursor = 0;
  const firstMatch = input.match(/^-?\d+(?:\.\d*)?/);
  if (!firstMatch) return null;
  numbers.push(Number(firstMatch[0]));
  cursor = firstMatch[0].length;

  while (cursor < input.length) {
    const operator = input[cursor];
    const rest = input.slice(cursor + 1);
    const numberMatch = rest.match(/^-?\d+(?:\.\d*)?/);
    if (!numberMatch) return null;
    operations.push(operator);
    numbers.push(Number(numberMatch[0]));
    cursor += 1 + numberMatch[0].length;
  }

  for (let index = 0; index < operations.length;) {
    if (operations[index] === '*' || operations[index] === '/') {
      const right = numbers[index + 1];
      if (operations[index] === '/' && right === 0) return null;
      numbers.splice(index, 2, operations[index] === '*' ? numbers[index] * right : numbers[index] / right);
      operations.splice(index, 1);
    } else {
      index += 1;
    }
  }

  const result = operations.reduce((total, operation, index) =>
    operation === '+' ? total + numbers[index + 1] : total - numbers[index + 1], numbers[0]);
  return Number.isFinite(result) ? result : null;
}

export function pressCalculatorKey(expression: string, key: string): string {
  if (key === 'AC') return '0';
  if (key === 'DEL') return expression.length <= 1 ? '0' : expression.slice(0, -1);
  if (key === '=') {
    const result = evaluateExpression(expression);
    return result === null ? expression : String(Number(result.toPrecision(12)));
  }
  if (key === '+/−') {
    if (expression === '0') return expression;
    const result = evaluateExpression(expression);
    return result === null ? expression : String(-result);
  }
  if (key === '%') {
    const result = evaluateExpression(expression);
    return result === null ? expression : String(Number((result / 100).toPrecision(12)));
  }
  if (expression.length >= MAX_LENGTH) return expression;

  const isOperator = ['+', '−', '×', '÷'].includes(key);
  if (isOperator) {
    const normalizedKey = key === '−' ? '-' : key;
    if (/[+\-×÷]$/.test(expression)) return expression.slice(0, -1) + normalizedKey;
    return expression + normalizedKey;
  }

  const segment = expression.split(/[+\-×÷]/).at(-1) ?? '';
  if (key === '.' && segment.includes('.')) return expression;
  if (expression === '0' && key !== '.') return key;
  return expression + key;
}
