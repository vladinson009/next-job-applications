import { ColumnsTable } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type ColumnFromDB = InferSelectModel<typeof ColumnsTable>;
