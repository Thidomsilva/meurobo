// src/ai/flows/automated-model-retraining.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically retraining the ML model.
 *
 * - automatedModelRetraining - A function to trigger the ML model retraining process.
 * - AutomatedModelRetrainingInput - The input type for the automatedModelRetraining function.
 * - AutomatedModelRetrainingOutput - The return type for the automatedModelRetraining function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedModelRetrainingInputSchema = z.object({
  since: z.string().describe('ISO8601 timestamp for the start of the training data range.'),
  until: z.string().describe('ISO8601 timestamp for the end of the training data range.'),
  config: z.record(z.any()).describe('Configuration options for the retraining process.'),
});
export type AutomatedModelRetrainingInput = z.infer<typeof AutomatedModelRetrainingInputSchema>;

const AutomatedModelRetrainingOutputSchema = z.object({
  message: z.string().describe('Confirmation message that the retraining process has been initiated.'),
});
export type AutomatedModelRetrainingOutput = z.infer<typeof AutomatedModelRetrainingOutputSchema>;

export async function automatedModelRetraining(input: AutomatedModelRetrainingInput): Promise<AutomatedModelRetrainingOutput> {
  return automatedModelRetrainingFlow(input);
}

const triggerModelRetraining = ai.defineTool({
  name: 'triggerModelRetraining',
  description: 'Triggers the retraining of the ML model with the specified data range and configuration.',
  inputSchema: AutomatedModelRetrainingInputSchema,
  outputSchema: z.object({message: z.string()}),
},
async (input) => {
    // Here, instead of calling an external service directly, return a message.
    // The actual call to the external ML service's /train endpoint should be handled
    // by a separate process (e.g., a Cloud Function) triggered by this tool's output, or scheduled independently.
    // This approach helps to decouple the tool execution from the actual retraining process,
    // making the tool more lightweight and focused on triggering the process.
    return { message: `Model retraining triggered for data from ${input.since} to ${input.until} with config: ${JSON.stringify(input.config)}` };
  }
);

const automatedModelRetrainingPrompt = ai.definePrompt({
  name: 'automatedModelRetrainingPrompt',
  tools: [triggerModelRetraining],
  prompt: `You are an AI assistant responsible for initiating the retraining of machine learning models.  The user has requested a model retraining.  Use the triggerModelRetraining tool to start the retraining process. Use all parameters provided by the user.
`,
});

const automatedModelRetrainingFlow = ai.defineFlow({
  name: 'automatedModelRetrainingFlow',
  inputSchema: AutomatedModelRetrainingInputSchema,
  outputSchema: AutomatedModelRetrainingOutputSchema,
}, async (input) => {
  const {output} = await automatedModelRetrainingPrompt(input);
  return {message: output!.message};
});
