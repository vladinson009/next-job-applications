'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { ColumnsTable, JobsTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
  columnId: string;
  direction: 'up' | 'down';
  jobId: string;
};

export async function moveJobById({ columnId, direction, jobId }: Props) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/');
  }

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
        eq(JobsTable.userId, session.user.id),
        eq(JobsTable.columnId, columnId),
      ),
    )
    .limit(1);
  if (!current) {
    return;
  }
  const targetPosition =
    direction === 'down' ? current.position + 1 : current.position - 1;
  if (targetPosition < 0) {
    return;
  }
  const [neighbor] = await db
    .select({
      id: JobsTable.id,
      position: JobsTable.position,
    })
    .from(JobsTable)
    .where(
      and(eq(JobsTable.columnId, columnId), eq(JobsTable.position, targetPosition)),
    )
    .limit(1);

  if (!neighbor) {
    return;
  }
  const targetJob = db
    .update(JobsTable)
    .set({ position: neighbor.position })
    .where(eq(JobsTable.id, current.id));
  const neighborJob = db
    .update(JobsTable)
    .set({ position: current.position })
    .where(eq(JobsTable.id, neighbor.id));

  await Promise.all([targetJob, neighborJob]);
  revalidatePath(`/dashboard/${current.boardId}`);
}
