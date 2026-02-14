'use server';

import { db } from '@/db';
import { ColumnsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { ColumnFromDB } from '@/types/Column';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
type ErrorCases =
  | 'CHOOSE_DIFFERENT_NAME'
  | 'NON_EXISTING_NAME'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR';
type RenameColumnByIdResponse =
  | { success: true }
  | { success: false; error: ErrorCases };

export async function renameColumnById(
  column: ColumnFromDB,
  newName: string,
): Promise<RenameColumnByIdResponse> {
  try {
    // Validate new column name
    if (column.name.trim() === newName.trim()) {
      return { success: false, error: 'CHOOSE_DIFFERENT_NAME' };
    }
    if (!newName) {
      return { success: false, error: 'NON_EXISTING_NAME' };
    }

    // Require auth user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Set new column name & updateAt field
    await db
      .update(ColumnsTable)
      .set({
        name: newName,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(ColumnsTable.id, column.id), eq(ColumnsTable.userId, user.id)));

    revalidatePath(`/dashboard/${column.boardId}`);

    return {
      success: true,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[renameColumnById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
