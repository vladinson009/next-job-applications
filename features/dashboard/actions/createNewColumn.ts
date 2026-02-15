'use server';

import { db } from '@/db';
import { BoardsTable, ColumnsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { columnSchema } from '@/validations/columnValidation';
import { eq, max, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createNewColumn(name: string, boardId: string) {
  try {
    // Zod validation
    const parsedData = columnSchema.safeParse({ name });
    if (!parsedData.success) {
      return { success: false, error: parsedData.error.message };
    }
    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Query last column position
    const [columnLastPosition] = await db
      .select({
        position: max(ColumnsTable.position),
      })
      .from(ColumnsTable)
      .where(eq(ColumnsTable.boardId, boardId))
      .limit(1);

    const nextPosition = (columnLastPosition.position ?? 0) + 1;

    // Query insert new column on next position
    const newColumnQuery = db.insert(ColumnsTable).values({
      name: parsedData.data.name,
      boardId: boardId,
      position: nextPosition,
      userId: user.id,
    });
    // Query touch board
    const touchBoardQuery = db
      .update(BoardsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(BoardsTable.id, boardId));

    await Promise.all([newColumnQuery, touchBoardQuery]);

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[createNewColumn]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
