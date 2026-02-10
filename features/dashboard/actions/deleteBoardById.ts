'use server';

import { db } from '@/db';
import { BoardsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteBoardById(id: string) {
  try {
    // Validate board id
    if (!id.trim()) {
      return { success: false, error: 'NON_EXISTING_BOARD' };
    }

    // Requre auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Delete board
    await db
      .delete(BoardsTable)
      .where(and(eq(BoardsTable.id, id), eq(BoardsTable.userId, user.id)));

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[deleteBoardById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
