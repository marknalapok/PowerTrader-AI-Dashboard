import { CoinData, Timeframe, Trade } from '../types';

export const MOCK_COINS: CoinData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 94500.25,
    change24h: 1.2,
    neuralLevels: { long: 4, short: 0 },
    predictions: [
      { timeframe: Timeframe.H1, predictedHigh: 95200, predictedLow: 93800, currentPrice: 94500 },
      { timeframe: Timeframe.H4, predictedHigh: 96500, predictedLow: 92000, currentPrice: 94500 },
      { timeframe: Timeframe.D1, predictedHigh: 98000, predictedLow: 91000, currentPrice: 94500 },
      { timeframe: Timeframe.W1, predictedHigh: 105000, predictedLow: 85000, currentPrice: 94500 },
    ],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: 2650.75,
    change24h: -0.5,
    neuralLevels: { long: 1, short: 2 },
    predictions: [
      { timeframe: Timeframe.H1, predictedHigh: 2700, predictedLow: 2620, currentPrice: 2650 },
      { timeframe: Timeframe.H4, predictedHigh: 2800, predictedLow: 2550, currentPrice: 2650 },
      { timeframe: Timeframe.D1, predictedHigh: 3000, predictedLow: 2400, currentPrice: 2650 },
      { timeframe: Timeframe.W1, predictedHigh: 3500, predictedLow: 2200, currentPrice: 2650 },
    ],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    currentPrice: 145.30,
    change24h: 5.4,
    neuralLevels: { long: 7, short: 0 },
    predictions: [
      { timeframe: Timeframe.H1, predictedHigh: 150, predictedLow: 142, currentPrice: 145 },
      { timeframe: Timeframe.H4, predictedHigh: 160, predictedLow: 135, currentPrice: 145 },
      { timeframe: Timeframe.D1, predictedHigh: 180, predictedLow: 120, currentPrice: 145 },
      { timeframe: Timeframe.W1, predictedHigh: 220, predictedLow: 100, currentPrice: 145 },
    ],
  },
];

export const MOCK_TRADES: Trade[] = [
  {
    id: '1',
    symbol: 'BTC',
    entryPrice: 93000,
    currentPrice: 94500.25,
    amount: 0.05,
    dcaCount: 1,
    status: 'OPEN',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    profitPercentage: 1.61,
    trailingStopPrice: 94000,
  },
];
