'use server';

import { db } from '@/db';
import { BoardsTable, ColumnsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { boardSchema } from '@/validations/boardValidation';
import { revalidatePath } from 'next/cache';

export async function createNewBoard(name: string) {
  try {
    // Zod validation
    const parsedData = boardSchema.safeParse({ name });
    if (!parsedData.success) {
      return { success: false, error: parsedData.error.issues[0].message };
    }
    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }
    // Create new board query
    const [newBoard] = await db
      .insert(BoardsTable)
      .values({
        name: parsedData.data.name,
        userId: user.id,
      })
      .returning();

    let columnsCount = 1;
    // Insert default columns query
    const columns = await db
      .insert(ColumnsTable)
      .values([
        {
          name: 'For applying',
          boardId: newBoard.id,
          position: columnsCount++,
          userId: user.id,
        },
        {
          name: 'Applied',
          boardId: newBoard.id,
          position: columnsCount++,
          userId: user.id,
        },
        {
          name: 'Rejected',
          boardId: newBoard.id,
          position: columnsCount++,
          userId: user.id,
        },
        {
          name: 'Interview',
          boardId: newBoard.id,
          position: columnsCount++,
          userId: user.id,
        },
      ])
      .returning();

    revalidatePath('/dashboard');

    const returnData = { columns, newBoard };
    return { success: true, data: returnData };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[createNewBoard]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
