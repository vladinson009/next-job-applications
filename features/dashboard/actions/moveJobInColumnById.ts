'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { ColumnsTable, JobsTable } from '@/db/schema';
import { and, asc, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
  columnId: string;
  direction: 'right' | 'left';
  jobId: string;
};

export async function moveJobInColumnById({ columnId, direction, jobId }: Props) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/');
  }

  const [currentJob] = await db
    .select({
      id: JobsTable.id,
      position: JobsTable.position,
      boardId: JobsTable.boardId,
      columnId: JobsTable.columnId,
      columnPosition: ColumnsTable.position,
    })
    .from(JobsTable)
    .leftJoin(ColumnsTable, eq(JobsTable.columnId, ColumnsTable.id))

    .where(
      and(
        eq(JobsTable.id, jobId),
        eq(JobsTable.userId, session.user.id),
        eq(JobsTable.columnId, columnId),
      ),
    )
    .limit(1);

  if (!currentJob || !currentJob.columnPosition) {
    return;
  }

  const targetPosition =
    direction === 'right' ?
      currentJob.columnPosition + 1
    : currentJob.columnPosition - 1;
  if (targetPosition < 0) {
    return;
  }
  const neighborColumnQuery =
    direction === 'right' ?
      db
        .select({ id: ColumnsTable.id, position: ColumnsTable.position })
        .from(ColumnsTable)
        .where(
          and(
            eq(ColumnsTable.boardId, currentJob.boardId),
            gt(ColumnsTable.position, currentJob.columnPosition),
          ),
        )
        .orderBy(asc(ColumnsTable.position))
        .limit(1)
    : db
        .select({ id: ColumnsTable.id, position: ColumnsTable.position })
        .from(ColumnsTable)
        .where(
          and(
            eq(ColumnsTable.boardId, currentJob.boardId),
            lt(ColumnsTable.position, currentJob.columnPosition),
          ),
        )
        .orderBy(desc(ColumnsTable.position))
        .limit(1);

  const [neighborColumn] = await neighborColumnQuery;
  if (!neighborColumn) {
    return;
  }

  const targetColumnId = neighborColumn.id;

  const [lastJobInTargetColumn] = await db
    .select({ position: JobsTable.position })
    .from(JobsTable)
    .where(eq(JobsTable.columnId, targetColumnId))
    .orderBy(desc(JobsTable.position))
    .limit(1);

  const newPosition = lastJobInTargetColumn ? lastJobInTargetColumn.position + 1 : 1;

  await db
    .update(JobsTable)
    .set({ columnId: targetColumnId, position: newPosition })
    .where(eq(JobsTable.id, currentJob.id));

  // Shift remainign columns left
  await db
    .update(JobsTable)
    .set({
      position: sql`${JobsTable.position} - 1`,
    })
    .where(
      and(
        eq(JobsTable.columnId, columnId),
        gt(JobsTable.position, currentJob.position),
      ),
    );

  revalidatePath(`/dashboard/${currentJob.boardId}`);
}
