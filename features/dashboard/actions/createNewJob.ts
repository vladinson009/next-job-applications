'use server';

import { db } from '@/db';
import { ColumnsTable, JobsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { JobsOutputSchema } from '@/types/Job';
import { jobSchema } from '@/validations/jobValidation';
import { and, eq, max, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createNewJob(
  data: JobsOutputSchema,
  columnId: string,
  boardId: string,
) {
  try {
    // Zod validation
    const parsedData = jobSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, error: parsedData.error.message };
    }

    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Query last job position
    const [lastJobPosition] = await db
      .select({
        position: max(JobsTable.position),
      })
      .from(JobsTable)
      .where(and(eq(JobsTable.columnId, columnId), eq(JobsTable.userId, user.id)))
      .limit(1);

    const nextPosition = (lastJobPosition.position ?? 0) + 1;

    // Insert new job on next position
    const newJobQuery = db.insert(JobsTable).values({
      userId: user.id,
      position: nextPosition,
      columnId,
      companyName: parsedData.data.companyName,
      location: parsedData.data.location,
      title: parsedData.data.title,
      remote: parsedData.data.remote ? true : false,
      salary: parsedData.data.salary || null,
      boardId: boardId,
    });
    // Query touch column
    const touchColumnQuery = db
      .update(ColumnsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(ColumnsTable.id, columnId));

    await Promise.all([newJobQuery, touchColumnQuery]);

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[createNewJob]', error);
    return {
      success: false,
      error: 'SERVER_ERROR',
    };
  }
}
