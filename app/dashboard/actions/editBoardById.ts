'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { BoardsTable } from '@/db/schema';
import { BoardFromDB } from '@/types/Board';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function editBoardById(board: BoardFromDB, newName: string) {
  const session = await auth();
  if (!session?.user || !session?.user.id) {
    return;
  }
  if (!board) {
    return;
  }
  if (board.name === newName) {
    return;
  }
  await db
    .update(BoardsTable)
    .set({ name: newName })
    .where(
      and(eq(BoardsTable.id, board.id), eq(BoardsTable.userId, session.user.id)),
    );
  revalidatePath('/dashboard');
}
