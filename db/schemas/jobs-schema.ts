import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { BoardsTable, ColumnsTable, UsersTable } from '../schema';

export const JobsTable = pgTable(
  'jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    companyName: varchar('company_name', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    salary: integer('salary'),
    remote: boolean('remote').default(false),
    position: integer('position').notNull(),
    columnId: uuid('column_id')
      .notNull()
      .references(() => ColumnsTable.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),
    boardId: uuid('board_id')
      .notNull()
      .references(() => BoardsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('jobs_column_idx').on(table.columnId)],
);
