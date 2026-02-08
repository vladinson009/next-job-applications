import { JobsTable } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type JobFromDB = InferSelectModel<typeof JobsTable>;
