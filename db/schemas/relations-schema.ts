//! Relations

import { relations } from 'drizzle-orm';
import { BoardsTable, ColumnsTable, JobsTable } from '../schema';

export const boardsRelations = relations(BoardsTable, ({ many }) => ({
  columns: many(ColumnsTable),
}));

export const columnsRelations = relations(ColumnsTable, ({ many, one }) => ({
  jobs: many(JobsTable),
  board: one(BoardsTable, {
    fields: [ColumnsTable.boardId],
    references: [BoardsTable.id],
  }),
}));
