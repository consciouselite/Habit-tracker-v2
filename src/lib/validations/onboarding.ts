import { z } from 'zod';

export const surveySchema = z.object({
  ageCategory: z.enum(['18-25', '26-35', '36-45', '46+']),
});

export const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  importance: z.string().min(1, 'Importance is required'),
});

export const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  category: z.enum(['Health', 'Productivity', 'Finance', 'Relationships', 'Learning', 'Spiritual/Mental']),
  description: z.string().optional(),
});

export const assessmentSchema = z.object({
  limitingBeliefs: z.string().min(1, 'Field is required'),
  badHabits: z.string().min(1, 'Field is required'),
  timeWasters: z.string().min(1, 'Field is required'),
  energyDrainers: z.string().min(1, 'Field is required'),
  growthBlockers: z.string().min(1, 'Field is required'),
});

export const visionSchema = z.object({
  newBeliefs: z.string().min(1, 'Field is required'),
  empoweringHabits: z.string().min(1, 'Field is required'),
  timeInvestment: z.string().min(1, 'Field is required'),
  energyGains: z.string().min(1, 'Field is required'),
  growthAreas: z.string().min(1, 'Field is required'),
});
