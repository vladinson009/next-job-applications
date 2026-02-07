'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { ColumnsTable } from '@/db/schema';
import { and, eq, gt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteColumnById(columnId: string) {
  const session = await auth();
  if (!session?.user || !session?.user.id) {
    return;
  }
  if (!columnId) {
    return;
  }
  const [column] = await db
    .select({
      id: ColumnsTable.id,
      boardId: ColumnsTable.boardId,
      position: ColumnsTable.position,
    })
    .from(ColumnsTable)
    .where(eq(ColumnsTable.id, columnId))
    .limit(1);
  if (!column) {
    return;
  }

  const { boardId, position } = column;
  //Delete the column;
  await db.delete(ColumnsTable).where(eq(ColumnsTable.id, columnId));

  // Shift remainign columns left
  await db
    .update(ColumnsTable)
    .set({
      position: sql`${ColumnsTable.position} - 1`,
    })
    .where(
      and(eq(ColumnsTable.boardId, boardId), gt(ColumnsTable.position, position)),
    );

  revalidatePath(`/dashboard/${boardId}`);
}
