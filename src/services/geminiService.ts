import { GoogleGenAI } from "@google/genai";
import { CoinData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getMarketInsight(coin: CoinData) {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      As a crypto trading expert for the PowerTrader AI system, analyze the following data for ${coin.name} (${coin.symbol}):
      
      Current Price: $${coin.currentPrice}
      24h Change: ${coin.change24h}%
      Neural Levels: LONG ${coin.neuralLevels.long}, SHORT ${coin.neuralLevels.short}
      
      Predictions:
      ${coin.predictions.map(p => `- ${p.timeframe}: High $${p.predictedHigh}, Low $${p.predictedLow}`).join('\n')}
      
      The PowerTrader AI system starts a trade if LONG level is 3 or higher and SHORT is 0.
      Provide a concise 2-3 sentence analysis of whether this is a good entry point and what the risk looks like.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting market insight:", error);
    return "Unable to generate insight at this time.";
  }
}
