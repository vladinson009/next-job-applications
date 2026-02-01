import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { UsersTable } from '../schema';

export const BoardsTable = pgTable('boards', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
