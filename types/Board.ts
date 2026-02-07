import { BoardsTable } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type BoardFromDB = InferSelectModel<typeof BoardsTable>;
