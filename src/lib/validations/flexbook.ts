import { z } from 'zod';

export const flexPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  caption: z.string().min(1, 'Caption is required'),
});

export type FlexPostInput = z.infer<typeof flexPostSchema>;
