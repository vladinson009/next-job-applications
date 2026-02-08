'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { JobsTable } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function fetchJobsByBoardId(boardId: string) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return [];
  }
  if (!boardId) return;

  const jobs = await db
    .select()
    .from(JobsTable)
    .where(eq(JobsTable.boardId, boardId))
    .orderBy(asc(JobsTable.position));

  return jobs;
}
