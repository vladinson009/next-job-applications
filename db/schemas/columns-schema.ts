import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { BoardsTable, UsersTable } from '../schema';

export const ColumnsTable = pgTable(
  'columns',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    boardId: uuid('board_id')
      .notNull()
      .references(() => BoardsTable.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('columns_board_idx').on(table.boardId)],
);
