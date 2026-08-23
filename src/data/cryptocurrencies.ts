export interface CryptoInfo {
  code: string;
  name: string;
  symbol: string;
  color: string;
}

export const CRYPTOCURRENCIES: CryptoInfo[] = [
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', color: '#f7931a' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', color: '#627eea' },
  { code: 'USDT', name: 'Tether', symbol: '₮', color: '#26a17b' },
  { code: 'BNB', name: 'BNB', symbol: 'BNB', color: '#f3ba2f' },
  { code: 'SOL', name: 'Solana', symbol: 'SOL', color: '#8b5cf6' },
  { code: 'XRP', name: 'XRP', symbol: 'XRP', color: '#23292f' },
  { code: 'USDC', name: 'USD Coin', symbol: 'USDC', color: '#2775ca' },
  { code: 'ADA', name: 'Cardano', symbol: '₳', color: '#3468d4' },
  { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð', color: '#c2a633' },
  { code: 'AVAX', name: 'Avalanche', symbol: 'AVAX', color: '#e84142' },
  { code: 'DOT', name: 'Polkadot', symbol: 'DOT', color: '#e6007a' },
  { code: 'LINK', name: 'Chainlink', symbol: 'LINK', color: '#2a5ada' },
  { code: 'MATIC', name: 'Polygon', symbol: 'MATIC', color: '#8247e5' },
  { code: 'LTC', name: 'Litecoin', symbol: 'Ł', color: '#345d9d' },
  { code: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH', color: '#8dc351' },
  { code: 'ATOM', name: 'Cosmos', symbol: 'ATOM', color: '#2e3148' },
  { code: 'XLM', name: 'Stellar', symbol: 'XLM', color: '#111827' },
  { code: 'ETC', name: 'Ethereum Classic', symbol: 'ETC', color: '#328332' },
  { code: 'FIL', name: 'Filecoin', symbol: 'FIL', color: '#0090ff' },
  { code: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR', color: '#24272a' },
  { code: 'APT', name: 'Aptos', symbol: 'APT', color: '#169b8b' },
  { code: 'ARB', name: 'Arbitrum', symbol: 'ARB', color: '#2d374b' },
  { code: 'OP', name: 'Optimism', symbol: 'OP', color: '#ff0420' },
  { code: 'ICP', name: 'Internet Computer', symbol: 'ICP', color: '#6c5ce7' },
  { code: 'HBAR', name: 'Hedera', symbol: 'ℏ', color: '#222222' },
  { code: 'ALGO', name: 'Algorand', symbol: 'ALGO', color: '#333333' },
  { code: 'VET', name: 'VeChain', symbol: 'VET', color: '#15bdff' },
  { code: 'AAVE', name: 'Aave', symbol: 'AAVE', color: '#7b61ff' },
  { code: 'UNI', name: 'Uniswap', symbol: 'UNI', color: '#ff007a' },
  { code: 'DAI', name: 'Dai', symbol: 'DAI', color: '#f5ac37' }
];

export const DEFAULT_CRYPTOCURRENCIES = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP'];

const CRYPTO_CODES = new Set(CRYPTOCURRENCIES.map((crypto) => crypto.code));

export const isCryptoCode = (code: string): boolean => CRYPTO_CODES.has(code);

export const cryptoByCode = (code: string): CryptoInfo =>
  CRYPTOCURRENCIES.find((crypto) => crypto.code === code) ?? { code, name: code, symbol: code, color: '#586174' };
