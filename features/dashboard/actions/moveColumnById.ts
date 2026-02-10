'use server';

import { db } from '@/db';
import { ColumnsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type Props = {
  boardId: string;
  columnId: string;
  direction: 'left' | 'right';
};

export async function moveColumnById({ boardId, columnId, direction }: Props) {
  try {
    // Validate board, column and direction
    if (!boardId.trim()) {
      return { success: false, error: 'NON_EXISTING_BOARD' };
    }
    if (!columnId.trim()) {
      return { success: false, error: 'NON_EXISTING_COLUMN' };
    }
    if (!direction.trim()) {
      return { success: false, error: 'NON_EXISTING_DIRECTION' };
    }

    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Query current column
    const [current] = await db
      .select({ position: ColumnsTable.position, id: ColumnsTable.id })
      .from(ColumnsTable)
      .where(
        and(
          eq(ColumnsTable.id, columnId),
          eq(ColumnsTable.userId, user.id),
          eq(ColumnsTable.boardId, boardId),
        ),
      )
      .limit(1);
    if (!current) {
      return { success: false, error: 'NON_EXISTING_COLUMN' };
    }
    const targetPosition =
      direction === 'right' ? current.position + 1 : current.position - 1;

    if (targetPosition < 1) {
      return { success: false, error: 'TARGET_COLUMN_UNDER_ONE' };
    }

    // Querry target column
    const [target] = await db
      .select({
        id: ColumnsTable.id,
        position: ColumnsTable.position,
      })
      .from(ColumnsTable)
      .where(
        and(
          eq(ColumnsTable.boardId, boardId),
          eq(ColumnsTable.position, targetPosition),
        ),
      )
      .limit(1);

    if (!target) {
      return { success: false, error: 'NO_TARGET_COLUMN' };
    }
    // Query columns and swap position
    const targetColumnQuery = db
      .update(ColumnsTable)
      .set({ position: target.position })
      .where(eq(ColumnsTable.id, current.id));
    const neighborColumnQuery = db
      .update(ColumnsTable)
      .set({ position: current.position })
      .where(eq(ColumnsTable.id, target.id));

    await Promise.all([targetColumnQuery, neighborColumnQuery]);

    revalidatePath(`/dashboard/${boardId}`);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[moveColumnById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
