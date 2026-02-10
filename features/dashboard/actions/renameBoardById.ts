'use server';

import { db } from '@/db';
import { BoardsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { BoardFromDB } from '@/types/Board';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function renameBoardById(board: BoardFromDB, newName: string) {
  try {
    // Validate new board name
    if (board.name === newName) {
      return { success: false, error: 'CHOOSE_DIFFERENT_NAME' };
    }
    if (!newName.trim()) {
      return { success: false, error: 'NON_EXISTING_NAME' };
    }

    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Set new board name & updateAt field
    await db
      .update(BoardsTable)
      .set({
        name: newName,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(BoardsTable.id, board.id), eq(BoardsTable.userId, user.id)));

    revalidatePath('/dashboard');

    return {
      success: true,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[renameBoardById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
