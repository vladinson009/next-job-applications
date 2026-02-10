'use server';

import { db } from '@/db';
import { BoardsTable, ColumnsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { and, eq, gt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteColumnById(columnId: string) {
  try {
    // Validate column id
    if (!columnId.trim()) {
      return { success: false, error: 'NON_EXISTING_COLUMN' };
    }
    // Require auth user
    await requireUser();

    // Query column
    const [column] = await db
      .select({
        id: ColumnsTable.id,
        boardId: ColumnsTable.boardId,
        position: ColumnsTable.position,
      })
      .from(ColumnsTable)
      .where(eq(ColumnsTable.id, columnId))
      .limit(1);
    if (!column) {
      return { success: false, error: 'NON_EXISTING_COLUMN' };
    }

    const { boardId, position } = column;

    //Delete column
    const deleteColumnQuery = db
      .delete(ColumnsTable)
      .where(eq(ColumnsTable.id, columnId));

    // Touch board query
    const touchBoardQuery = db
      .update(BoardsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(BoardsTable.id, column.boardId));

    await Promise.all([deleteColumnQuery, touchBoardQuery]);

    // Shift remainign columns left
    await db
      .update(ColumnsTable)
      .set({
        position: sql`${ColumnsTable.position} - 1`,
      })
      .where(
        and(eq(ColumnsTable.boardId, boardId), gt(ColumnsTable.position, position)),
      );

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[deleteColumnById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
