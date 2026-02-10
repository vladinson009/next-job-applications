'use server';

import { db } from '@/db';
import { BoardsTable, ColumnsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { asc, eq } from 'drizzle-orm';

export async function fetchColumnsByBoardId(boardId: string) {
  try {
    // Validate board id
    if (!boardId.trim()) {
      return { success: false, error: 'NON_EXISTING_BOARD' };
    }

    // Require auth user
    await requireUser();

    // Query columns
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

    return { success: true, data: columns };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[fetchColumnsByBoardId]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
