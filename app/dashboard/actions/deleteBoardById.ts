'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { BoardsTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteBoardById(id: string) {
  const session = await auth();
  if (!session?.user || !session?.user.id) {
    return;
  }
  if (!id) {
    return;
  }
  await db
    .delete(BoardsTable)
    .where(and(eq(BoardsTable.id, id), eq(BoardsTable.userId, session.user.id)));
  revalidatePath('/dashboard');
}
