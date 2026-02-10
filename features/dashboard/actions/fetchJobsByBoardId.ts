'use server';

import { db } from '@/db';
import { JobsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { asc, eq } from 'drizzle-orm';

export async function fetchJobsByBoardId(boardId: string) {
  try {
    // Validate board id
    if (!boardId.trim()) {
      return { success: false, error: 'NON_EXISTING_BOARD' };
    }
    // Request auth user
    await requireUser();

    // Query jobs
    const jobs = await db
      .select()
      .from(JobsTable)
      .where(eq(JobsTable.boardId, boardId))
      .orderBy(asc(JobsTable.position));

    return { success: true, data: jobs };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[fetchJobsByBoardId]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
