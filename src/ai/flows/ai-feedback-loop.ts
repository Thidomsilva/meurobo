'use server';

/**
 * @fileOverview A flow to submit trade results to the ML service for continuous learning and model improvement.
 *
 * - aiFeedbackLoop - A function that submits trade feedback to the ML service.
 * - AIFeedbackLoopInput - The input type for the aiFeedbackLoop function.
 * - AIFeedbackLoopOutput - The return type for the aiFeedbackLoop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIFeedbackLoopInputSchema = z.object({
  features: z.array(z.number()).describe('The features used for the trade.'),
  label: z.number().describe('The result of the trade: 1 for win, -1 for loss, 0 for void.'),
  tradeMeta: z.record(z.any()).describe('Metadata about the trade.'),
  modelVersion: z.string().describe('The version of the ML model used.'),
});
export type AIFeedbackLoopInput = z.infer<typeof AIFeedbackLoopInputSchema>;

const AIFeedbackLoopOutputSchema = z.object({
  success: z.boolean().describe('Whether the feedback was successfully submitted.'),
});
export type AIFeedbackLoopOutput = z.infer<typeof AIFeedbackLoopOutputSchema>;

export async function aiFeedbackLoop(input: AIFeedbackLoopInput): Promise<AIFeedbackLoopOutput> {
  return aiFeedbackLoopFlow(input);
}

const aiFeedbackLoopFlow = ai.defineFlow(
  {
    name: 'aiFeedbackLoopFlow',
    inputSchema: AIFeedbackLoopInputSchema,
    outputSchema: AIFeedbackLoopOutputSchema,
  },
  async input => {
    try {
      const response = await fetch(process.env.ML_SERVICE_URL + '/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        console.error('Failed to submit feedback to ML service:', response.status, response.statusText);
        return {success: false};
      }

      // Optionally, parse the response body to check for a success indicator.
      // const result = await response.json();
      // if (result.status !== 'success') {
      //   return { success: false };
      // }

      return {success: true};
    } catch (error) {
      console.error('Error submitting feedback to ML service:', error);
      return {success: false};
    }
  }
);
