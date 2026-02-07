import z, { string } from 'zod';

export const columnSchema = z.object({
  name: string('Name must be a string')
    .max(100, 'Name must be under 100 characters')
    .min(1, 'Name is required'),
});
