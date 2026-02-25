/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Settings as SettingsIcon, 
  Play, 
  Square, 
  Cpu, 
  BarChart3, 
  History, 
  Zap,
  ChevronRight,
  Info,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { MOCK_COINS, MOCK_TRADES } from './services/mockData';
import { CoinData, Trade } from './types';
import { getMarketInsight } from './services/geminiService';

export default function App() {
  const [coins] = useState<CoinData[]>(MOCK_COINS);
  const [selectedCoin, setSelectedCoin] = useState<CoinData>(MOCK_COINS[0]);
  const [activeTrades, setActiveTrades] = useState<Trade[]>(MOCK_TRADES);
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    fetchInsight(selectedCoin);
  }, [selectedCoin]);

  const fetchInsight = async (coin: CoinData) => {
    setLoadingInsight(true);
    const text = await getMarketInsight(coin);
    setInsight(text || '');
    setLoadingInsight(false);
  };

  const toggleSystem = () => setIsSystemRunning(!isSystemRunning);
  const startTraining = () => {
    setIsTraining(true);
    setTimeout(() => setIsTraining(false), 5000); // Mock training
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="scanline" />
      
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Cpu className="text-black w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight uppercase">PowerTrader AI</h1>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">v2.5.0-PRO</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSystemRunning ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`} />
              <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                System: {isSystemRunning ? 'Active' : 'Standby'}
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isTraining ? 'bg-amber-500 animate-pulse' : 'bg-white/20'}`} />
              <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                Training: {isTraining ? 'In Progress' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={startTraining}
              disabled={isTraining || isSystemRunning}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
              title="Train All"
            >
              <Zap className="w-5 h-5 text-amber-400" />
            </button>
            <button 
              onClick={toggleSystem}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                isSystemRunning 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                  : 'bg-emerald-500 text-black hover:bg-emerald-400'
              }`}
            >
              {isSystemRunning ? <><Square className="w-4 h-4" /> Stop All</> : <><Play className="w-4 h-4" /> Start All</>}
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <SettingsIcon className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Coin List */}
        <aside className="w-72 border-r border-white/10 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Monitored Assets</h2>
            <div className="space-y-1">
              {coins.map(coin => (
                <button
                  key={coin.symbol}
                  onClick={() => setSelectedCoin(coin)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    selectedCoin.symbol === coin.symbol 
                      ? 'bg-white/10 border border-white/10' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold">
                      {coin.symbol[0]}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">{coin.symbol}</div>
                      <div className="text-[10px] text-white/40">{coin.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">${coin.currentPrice.toLocaleString()}</div>
                    <div className={`text-[10px] font-mono ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Active Signals</h2>
            <div className="space-y-3">
              {coins.map(coin => (
                <div key={`sig-${coin.symbol}`} className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold">{coin.symbol}</span>
                    <div className="flex gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${coin.neuralLevels.long >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                        L:{coin.neuralLevels.long}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${coin.neuralLevels.short > 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40'}`}>
                        S:{coin.neuralLevels.short}
                      </span>
                    </div>
                  </div>
                  <div className="neural-bar mb-1">
                    <div className="neural-fill-long" style={{ width: `${coin.neuralLevels.long * 10}%` }} />
                  </div>
                  <div className="neural-bar">
                    <div className="neural-fill-short" style={{ width: `${coin.neuralLevels.short * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 bg-black/40">
          {/* Top Row: Selected Coin Details & Active Trades */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coin Detail Card */}
            <div className="lg:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <BarChart3 className="w-32 h-32" />
              </div>
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-bold tracking-tighter">{selectedCoin.name}</h2>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white/60">{selectedCoin.symbol}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-mono font-bold tracking-tighter">${selectedCoin.currentPrice.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${selectedCoin.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {selectedCoin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(selectedCoin.change24h)}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Neural Signal Strength</div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-emerald-400">{selectedCoin.neuralLevels.long}</div>
                      <div className="text-[8px] text-white/40 uppercase">Long</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-red-400">{selectedCoin.neuralLevels.short}</div>
                      <div className="text-[8px] text-white/40 uppercase">Short</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedCoin.predictions.map(pred => (
                  <div key={pred.timeframe} className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{pred.timeframe} Prediction</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/30 uppercase">High</span>
                        <span className="text-xs font-mono text-emerald-400">${pred.predictedHigh.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/30 uppercase">Low</span>
                        <span className="text-xs font-mono text-red-400">${pred.predictedLow.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Trades Panel */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Active Trades
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                  {activeTrades.length} Positions
                </span>
              </div>
              
              <div className="flex-1 space-y-4">
                {activeTrades.length > 0 ? (
                  activeTrades.map(trade => (
                    <div key={trade.id} className="p-4 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm font-bold">{trade.symbol} / USD</div>
                          <div className="text-[10px] text-white/40 font-mono">Entry: ${trade.entryPrice.toLocaleString()}</div>
                        </div>
                        <div className={`text-sm font-mono font-bold ${trade.profitPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trade.profitPercentage >= 0 ? '+' : ''}{trade.profitPercentage}%
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/60">
                          DCA Level: <span className="text-white font-bold">{trade.dcaCount}</span>
                        </div>
                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/60">
                          Trailing: <span className="text-white font-bold">${trade.trailingStopPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                        Close Position
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                    <History className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-xs uppercase tracking-widest">No active trades</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: AI Insights & System Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                  <Cpu className="text-black w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">AI Market Analysis</h3>
              </div>
              
              <div className="min-h-[120px] relative">
                {loadingInsight ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                    <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm leading-relaxed text-white/80 italic font-serif markdown-body"
                  >
                    <Markdown>{insight}</Markdown>
                  </motion.div>
                )}
              </div>
              
              <div className="mt-6 flex items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Info className="w-3 h-3" /> Powered by Gemini 3 Flash
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Not Financial Advice
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="p-6 bg-black/40 rounded-2xl border border-white/10 flex flex-col h-[240px]">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BarChart3 className="w-3 h-3" /> System Activity
              </h3>
              <div className="flex-1 font-mono text-[10px] space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="text-white/40">[01:23:21] <span className="text-emerald-400">INFO:</span> PowerTrader AI Hub initialized.</div>
                <div className="text-white/40">[01:23:22] <span className="text-emerald-400">INFO:</span> Loading neural models for BTC, ETH, SOL.</div>
                <div className="text-white/40">[01:23:25] <span className="text-emerald-400">INFO:</span> Connecting to Robinhood API...</div>
                <div className="text-white/40">[01:23:26] <span className="text-emerald-400">INFO:</span> Connected. Account balance: $12,450.20</div>
                <div className="text-white/40">[01:23:27] <span className="text-amber-400">WARN:</span> SOL LONG level reached 7. Monitoring for entry...</div>
                <div className="text-white/40">[01:23:30] <span className="text-emerald-400">INFO:</span> BTC trade #1 trailing stop updated to $94,000.</div>
                <div className="text-white/40">[01:23:35] <span className="text-white/20">DEBUG:</span> Thinker heartbeat active.</div>
                <div className="text-white/40">[01:23:40] <span className="text-white/20">DEBUG:</span> Trader heartbeat active.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-white/10 bg-black flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">API: Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Database: Sync</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
          © 2026 PowerTrader AI • Open Source Apache 2.0
        </div>
      </footer>
    </div>
  );
}
