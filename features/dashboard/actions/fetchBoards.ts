'use server';

import { db } from '@/db';
import { BoardsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { desc, eq } from 'drizzle-orm';

export async function fetchBoards() {
  try {
    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }
    // Query boards
    const boards = await db
      .select()
      .from(BoardsTable)
      .where(eq(BoardsTable.userId, user.id))
      .orderBy(desc(BoardsTable.updatedAt));

    return { success: true, data: boards };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[fetchBoards]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
