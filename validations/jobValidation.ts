import z from 'zod';

export const jobSchema = z.object({
  title: z
    .string('Title must be a text')
    .min(1, 'Title is required')
    .max(100, 'Title length is too long. Limit 100 characters'),
  companyName: z
    .string('Company name must be a text')
    .min(1, 'Company name is required')
    .max(255, 'Company name length is too long. Limit 255 characters'),
  location: z
    .string('Location must be a text')
    .min(1, 'Location is required')
    .max(255, 'Location length is too long. Limit 255 characters'),
  salary: z.coerce
    .number<number>('Salary must be a number')
    .optional()
    .or(z.string().length(0)),
  remote: z.boolean('Remote must be a boolean').default(false).nonoptional(),
  url: z.url().or(z.literal('')),
});
