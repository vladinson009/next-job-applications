'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { BoardsTable, ColumnsTable } from '@/db/schema';
import { boardSchema } from '@/validations/boardValidation';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function createNewBoard(name: string) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/');
  }

  const parsedData = boardSchema.safeParse({ name });
  if (!parsedData.success) {
    return { success: false };
  }

  const [newBoard] = await db
    .insert(BoardsTable)
    .values({
      name: parsedData.data.name,
      userId: session.user.id,
    })
    .returning();
  const [count] = await db
    .select({ count: ColumnsTable.id })
    .from(ColumnsTable)
    .where(eq(ColumnsTable.boardId, newBoard.id))
    .execute();
  let columnsCount = Number(count?.count ?? 0) + 1;

  const columns = await db
    .insert(ColumnsTable)
    .values([
      {
        name: 'For applying',
        boardId: newBoard.id,
        position: columnsCount++,
        userId: session.user.id,
      },
      {
        name: 'Applied',
        boardId: newBoard.id,
        position: columnsCount++,
        userId: session.user.id,
      },
      {
        name: 'Rejected',
        boardId: newBoard.id,
        position: columnsCount++,
        userId: session.user.id,
      },
      {
        name: 'Interview',
        boardId: newBoard.id,
        position: columnsCount++,
        userId: session.user.id,
      },
    ])
    .returning();

  return { success: true, board: newBoard, columns };
}
