'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { BoardsTable, ColumnsTable } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function fetchColumnsByBoardId(boardId: string) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return [];
  }
  if (!boardId) return;

  const columns = await db
    .select({
      id: ColumnsTable.id,
      name: ColumnsTable.name,
      position: ColumnsTable.position,
      boardId: ColumnsTable.boardId,
      boardName: BoardsTable.name,
      createdAt: ColumnsTable.createdAt,
      updatedAt: ColumnsTable.updatedAt,
      userId: ColumnsTable.userId,
    })
    .from(ColumnsTable)
    .leftJoin(BoardsTable, eq(ColumnsTable.boardId, BoardsTable.id))
    .where(eq(ColumnsTable.boardId, boardId))
    .orderBy(asc(ColumnsTable.position));

  return columns;
}
