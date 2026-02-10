'use server';

import { db } from '@/db';
import { ColumnsTable, JobsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { and, eq, gt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteJobById(jobId: string) {
  try {
    // Validate job id
    if (!jobId) {
      return { success: false, error: 'NON_EXISTIN_JOB' };
    }

    // Require auth user
    await requireUser();

    // Query job
    const [job] = await db
      .select({
        id: JobsTable.id,
        columnId: JobsTable.columnId,
        position: JobsTable.position,
        boardId: JobsTable.boardId,
      })
      .from(JobsTable)
      .where(eq(JobsTable.id, jobId))
      .limit(1);
    if (!job) {
      return { success: false, error: 'NON_EXISTIN_JOB' };
    }

    const { columnId, position } = job;

    //Delete job query
    const deleteJobQuery = db.delete(JobsTable).where(eq(JobsTable.id, jobId));

    // Touch column query
    const touchColumnQuery = db
      .update(ColumnsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(ColumnsTable.id, job.columnId));

    await Promise.all([deleteJobQuery, touchColumnQuery]);

    // Shift remaining jobs
    await db
      .update(JobsTable)
      .set({
        position: sql`${JobsTable.position} - 1`,
      })
      .where(
        and(eq(JobsTable.columnId, columnId), gt(JobsTable.position, position)),
      );

    revalidatePath(`/dashboard/${job.boardId}`);
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[deleteJobById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
