'use server';

/**
 * @fileOverview An AI-powered prediction flow for market movement.
 *
 * - aiPoweredPrediction - A function that handles the prediction of the next market movement.
 * - AIPoweredPredictionInput - The input type for the aiPoweredPrediction function.
 * - AIPoweredPredictionOutput - The return type for the aiPoweredPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredPredictionInputSchema = z.object({
  pair: z.string().describe('The trading pair (e.g., EURUSD).'),
  timeframeSec: z.number().describe('The timeframe in seconds.'),
  features: z.array(z.number()).describe('The feature vector for the ML model.'),
  modelVersion: z.string().default('auto').describe('The version of the ML model to use.'),
});
export type AIPoweredPredictionInput = z.infer<typeof AIPoweredPredictionInputSchema>;

const AIPoweredPredictionOutputSchema = z.object({
  p_up: z.number().describe('The predicted probability of an upward movement.'),
  p_down: z.number().describe('The predicted probability of a downward movement.'),
  uncertainty: z.number().describe('The uncertainty of the prediction.'),
  modelVersion: z.string().describe('The version of the ML model used for the prediction.'),
  latencyMs: z.number().describe('The latency of the prediction in milliseconds.'),
});
export type AIPoweredPredictionOutput = z.infer<typeof AIPoweredPredictionOutputSchema>;

export async function aiPoweredPrediction(input: AIPoweredPredictionInput): Promise<AIPoweredPredictionOutput> {
  return aiPoweredPredictionFlow(input);
}

const predict = ai.defineTool({
  name: 'predict',
  description: 'Calls the ML service to predict the next market movement.',
  inputSchema: AIPoweredPredictionInputSchema,
  outputSchema: AIPoweredPredictionOutputSchema,
},
async (input) => {
    // This is a placeholder implementation.  In a real application,
    // this would make an API call to the ML service.
    // Implement your logic to call the /predict endpoint of the ML service here.
    // For now, return dummy values.
    console.log("Calling ML predict service with input: " + JSON.stringify(input));
    const p_up = 0.55; // Replace with actual prediction
    const p_down = 0.45; // Replace with actual prediction
    const uncertainty = 0.1; // Replace with actual uncertainty
    const modelVersion = 'gbm-v1'; // Replace with actual model version
    const latencyMs = 25; // Replace with actual latency

    return {
      p_up: p_up,
      p_down: p_down,
      uncertainty: uncertainty,
      modelVersion: modelVersion,
      latencyMs: latencyMs,
    };
  }
);

const aiPoweredPredictionFlow = ai.defineFlow(
  {
    name: 'aiPoweredPredictionFlow',
    inputSchema: AIPoweredPredictionInputSchema,
    outputSchema: AIPoweredPredictionOutputSchema,
    tools: [predict]
  },
  async input => {
    // Call the predict tool to get the market movement prediction
    const prediction = await predict(input);
    return prediction!;
  }
);
