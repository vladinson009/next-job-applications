import z from 'zod';

export const boardSchema = z.object({
  name: z
    .string('Board name must be a valid string')
    .min(1, 'Board name is required')
    .max(100, 'Name is too long. Try to fit in 100 characters')
    .trim(),
});
