'use server';

import { db } from '@/db';
import { ColumnsTable, JobsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { JobsOutputSchema } from '@/types/Job';
import { jobSchema } from '@/validations/jobValidation';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function editJob(
  data: JobsOutputSchema,
  columnId: string,
  boardId: string,
  jobId: string,
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

    // Update job
    const updateJobQuery = db
      .update(JobsTable)
      .set({
        companyName: parsedData.data.companyName,
        location: parsedData.data.location,
        title: parsedData.data.title,
        remote: parsedData.data.remote ? true : false,
        salary: Number(parsedData.data.salary) || null,
      })
      .where(eq(JobsTable.id, jobId));
    // Query touch column
    const touchColumnQuery = db
      .update(ColumnsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(ColumnsTable.id, columnId));

    await Promise.all([updateJobQuery, touchColumnQuery]);

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[editJob]', error);
    return {
      success: false,
      error: 'SERVER_ERROR',
    };
  }
}
