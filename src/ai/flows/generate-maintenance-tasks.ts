'use server';

/**
 * @fileOverview A flow to generate maintenance tasks based on the selected equipment type.
 *
 * - generateMaintenanceTasks - A function that generates maintenance tasks.
 * - GenerateMaintenanceTasksInput - The input type for the generateMaintenanceTasks function.
 * - GenerateMaintenanceTasksOutput - The return type for the generateMaintenanceTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMaintenanceTasksInputSchema = z.object({
  equipmentType: z
    .string()
    .describe('The type of equipment for which to generate maintenance tasks.'),
});
export type GenerateMaintenanceTasksInput = z.infer<typeof GenerateMaintenanceTasksInputSchema>;

const GenerateMaintenanceTasksOutputSchema = z.object({
  tasks: z
    .array(z.string())
    .describe('A list of maintenance tasks for the selected equipment type.'),
});
export type GenerateMaintenanceTasksOutput = z.infer<typeof GenerateMaintenanceTasksOutputSchema>;

export async function generateMaintenanceTasks(
  input: GenerateMaintenanceTasksInput
): Promise<GenerateMaintenanceTasksOutput> {
  return generateMaintenanceTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMaintenanceTasksPrompt',
  input: {schema: GenerateMaintenanceTasksInputSchema},
  output: {schema: GenerateMaintenanceTasksOutputSchema},
  prompt: `You are an expert maintenance technician. Based on the equipment type provided, generate a list of common maintenance tasks.

Equipment Type: {{{equipmentType}}}

Tasks:`,
});

const generateMaintenanceTasksFlow = ai.defineFlow(
  {
    name: 'generateMaintenanceTasksFlow',
    inputSchema: GenerateMaintenanceTasksInputSchema,
    outputSchema: GenerateMaintenanceTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
