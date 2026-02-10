'use server';

import { db } from '@/db';
import { ColumnsTable, JobsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type Props = {
  columnId: string;
  direction: 'up' | 'down';
  jobId: string;
};

export async function moveJobById({ columnId, direction, jobId }: Props) {
  try {
    // Validate column, job and direction
    if (!columnId.trim) {
      return { success: false, error: 'NON_EXISTING_COLUMN' };
    }
    if (!jobId.trim) {
      return { success: false, error: 'NON_EXISTING_JOB' };
    }
    if (!direction.trim) {
      return { success: false, error: 'NON_EXISTING_DIRECTION' };
    }

    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Query current job
    const [current] = await db
      .select({
        position: JobsTable.position,
        id: JobsTable.id,
        boardId: JobsTable.boardId,
      })
      .from(JobsTable)
      .where(
        and(
          eq(JobsTable.id, jobId),
          eq(JobsTable.userId, user.id),
          eq(JobsTable.columnId, columnId),
        ),
      )
      .limit(1);
    if (!current) {
      return { success: false, error: 'NON_EXISTING_JOB' };
    }
    const targetPosition =
      direction === 'down' ? current.position + 1 : current.position - 1;
    if (targetPosition < 1) {
      return { success: false, error: 'TARGET_POSITION_UNDER_ONE' };
    }

    // Query target job
    const [target] = await db
      .select({
        id: JobsTable.id,
        position: JobsTable.position,
      })
      .from(JobsTable)
      .where(
        and(
          eq(JobsTable.columnId, columnId),
          eq(JobsTable.position, targetPosition),
        ),
      )
      .limit(1);

    if (!target) {
      return { success: false, error: 'NO_TARGET_JOB' };
    }

    // Swap jobs position queries
    const currentJobQuery = db
      .update(JobsTable)
      .set({ position: target.position, updatedAt: sql`NOW()` })
      .where(eq(JobsTable.id, current.id));
    const targetJobQuery = db
      .update(JobsTable)
      .set({ position: current.position, updatedAt: sql`NOW()` })
      .where(eq(JobsTable.id, target.id));

    // Touch column query
    const touchColumnQuery = db
      .update(ColumnsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(ColumnsTable.id, columnId));

    await Promise.all([currentJobQuery, targetJobQuery, touchColumnQuery]);
    revalidatePath(`/dashboard/${current.boardId}`);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[moveJobById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
