'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { JobsTable } from '@/db/schema';
import { and, eq, gt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteJobById(jobId: string) {
  const session = await auth();
  if (!session?.user || !session?.user.id) {
    return;
  }
  if (!jobId) {
    return;
  }

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
    return;
  }

  const { columnId, position } = job;

  //Delete the column;
  await db.delete(JobsTable).where(eq(JobsTable.id, jobId));

  // Shift remainign columns left
  await db
    .update(JobsTable)
    .set({
      position: sql`${JobsTable.position} - 1`,
    })
    .where(and(eq(JobsTable.columnId, columnId), gt(JobsTable.position, position)));

  revalidatePath(`/dashboard/${job.boardId}`);
}
