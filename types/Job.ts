import { JobsTable } from '@/db/schema';
import { jobSchema } from '@/validations/jobValidation';
import { InferSelectModel } from 'drizzle-orm';
import z from 'zod';

export type JobFromDB = InferSelectModel<typeof JobsTable>;
export type JobsOutputSchema = z.output<typeof jobSchema>;
