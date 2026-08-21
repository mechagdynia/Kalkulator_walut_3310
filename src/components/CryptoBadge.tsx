import { cryptoByCode } from '../data/cryptocurrencies';

interface CryptoBadgeProps {
  code: string;
}

export function CryptoBadge({ code }: CryptoBadgeProps) {
  const crypto = cryptoByCode(code);
  return <span className="crypto-badge" style={{ backgroundColor: crypto.color }} aria-hidden="true">{crypto.symbol.length > 2 ? crypto.code.slice(0, 2) : crypto.symbol}</span>;
}
