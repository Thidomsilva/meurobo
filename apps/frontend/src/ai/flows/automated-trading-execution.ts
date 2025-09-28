'use server';

/**
 * @fileOverview A Genkit flow for automated trading execution based on AI predictions.
 *
 * - executeTrade - A function that executes trades based on AI predictions and strategy rules.
 * - ExecuteTradeInput - The input type for the executeTrade function.
 * - ExecuteTradeOutput - The return type for the executeTrade function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExecuteTradeInputSchema = z.object({
  pair: z.string().describe('The trading pair (e.g., EURUSD).'),
  timeframeSec: z.number().describe('The timeframe in seconds.'),
  features: z.array(z.number()).describe('The feature vector for the ML service.'),
  stake: z.number().describe('The amount to stake on the trade.'),
  expirationSec: z.number().describe('The expiration time in seconds.'),
  thUp: z.number().describe('The threshold for an upward prediction.'),
  thDown: z.number().describe('The threshold for a downward prediction.'),
  minEdge: z.number().describe('The minimum edge for entering a trade.'),
  maxAtrZ: z.number().optional().describe('Maximum ATR z-score (volatility filter).'),
  maxConsecutiveCandles: z.number().optional().describe('Maximum consecutive candles in one direction.'),
  cooldownSec: z.number().optional().describe('Cooldown period after losses.'),
});
export type ExecuteTradeInput = z.infer<typeof ExecuteTradeInputSchema>;

const ExecuteTradeOutputSchema = z.object({
  side: z.enum(['CALL', 'PUT']).optional().describe('The trade side (CALL or PUT).'),
  pUp: z.number().optional().describe('The probability of an upward movement.'),
  pDown: z.number().optional().describe('The probability of a downward movement.'),
  uncertainty: z.number().optional().describe('The uncertainty of the prediction.'),
  enteredTrade: z.boolean().describe('Whether a trade was entered or not.'),
  reason: z.string().optional().describe('The reason why a trade was not entered, if applicable.'),
});
export type ExecuteTradeOutput = z.infer<typeof ExecuteTradeOutputSchema>;

export async function executeTrade(input: ExecuteTradeInput): Promise<ExecuteTradeOutput> {
  return executeTradeFlow(input);
}

const predict = ai.defineTool({
  name: 'predict',
  description: 'Calls the ML service to predict the next move (up/down and probability) based on market data.',
  inputSchema: z.object({
    pair: z.string().describe('The trading pair (e.g., EURUSD).'),
    timeframeSec: z.number().describe('The timeframe in seconds.'),
    features: z.array(z.number()).describe('The feature vector for the ML service.'),
  }),
  outputSchema: z.object({
    p_up: z.number().describe('The probability of an upward movement.'),
    p_down: z.number().describe('The probability of a downward movement.'),
    uncertainty: z.number().describe('The uncertainty of the prediction.'),
    modelVersion: z.string().describe('The model version used for the prediction.'),
    latencyMs: z.number().describe('The latency of the prediction.'),
  }),
}, async (input) => {
  // TODO: Implement the actual call to the ML service.
  // This is a placeholder implementation.
  console.log("Calling predict tool with input:", input);
  return {
    p_up: 0.5,
    p_down: 0.5,
    uncertainty: 0.1,
    modelVersion: 'gbm-v1',
    latencyMs: 10,
  };
});

const executeTradeFlow = ai.defineFlow(
  {
    name: 'executeTradeFlow',
    inputSchema: ExecuteTradeInputSchema,
    outputSchema: ExecuteTradeOutputSchema,
  },
  async input => {
    const {pair, timeframeSec, features, stake, expirationSec, thUp, thDown, minEdge} = input;

    // 1. Call the ML service to get predictions.
    const prediction = await predict({
      pair,
      timeframeSec,
      features,
    });

    const {p_up, p_down, uncertainty} = prediction;

    // 2. Policy Decision.
    let side: 'CALL' | 'PUT' | undefined = undefined;
    if (p_up >= thUp) {
      side = 'CALL';
    } else if (p_down >= thDown) {
      side = 'PUT';
    }

    const edge = Math.max(p_up, p_down) - 0.5;
    if (side && edge < minEdge) {
      return {
        enteredTrade: false,
        reason: `Edge ${edge} is less than minEdge ${minEdge}`,
      };
    }

    if (!side) {
      return {
        enteredTrade: false,
        reason: `No trade signal: p_up = ${p_up}, thUp = ${thUp}, p_down = ${p_down}, thDown = ${thDown}`,
      };
    }

    // TODO: Add volatility filter (ATR z-score).
    // TODO: Add consecutive candles filter.
    // TODO: Add cooldown after losses.

    // 3. Execute the trade (Placeholder).
    console.log(`Executing trade: side = ${side}, stake = ${stake}, expirationSec = ${expirationSec}`);

    return {
      side,
      pUp: p_up,
      pDown: p_down,
      uncertainty,
      enteredTrade: true,
    };
  }
);

