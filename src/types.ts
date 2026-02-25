export enum Timeframe {
  H1 = '1h',
  H4 = '4h',
  D1 = '1d',
  W1 = '1w',
}

export interface Prediction {
  timeframe: Timeframe;
  predictedHigh: number;
  predictedLow: number;
  currentPrice: number;
}

export interface NeuralLevels {
  long: number; // 0-10
  short: number; // 0-10
}

export interface CoinData {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  neuralLevels: NeuralLevels;
  predictions: Prediction[];
}

export interface Trade {
  id: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  amount: number;
  dcaCount: number;
  status: 'OPEN' | 'CLOSED';
  startTime: string;
  profitPercentage: number;
  trailingStopPrice?: number;
}

export interface AppState {
  coins: CoinData[];
  activeTrades: Trade[];
  isSystemRunning: boolean;
  isTraining: boolean;
}
