'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { ColumnsTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
  boardId: string;
  columnId: string;
  direction: 'left' | 'right';
};

export async function moveColumnById({ boardId, columnId, direction }: Props) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/');
  }

  const [current] = await db
    .select({ position: ColumnsTable.position, id: ColumnsTable.id })
    .from(ColumnsTable)
    .where(
      and(
        eq(ColumnsTable.id, columnId),
        eq(ColumnsTable.userId, session.user.id),
        eq(ColumnsTable.boardId, boardId),
      ),
    )
    .limit(1);
  if (!current) {
    return;
  }
  const targetPosition =
    direction === 'right' ? current.position + 1 : current.position - 1;
  if (targetPosition < 0) {
    return;
  }
  const [neighbor] = await db
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

  if (!neighbor) {
    return;
  }
  const targetColumn = db
    .update(ColumnsTable)
    .set({ position: neighbor.position })
    .where(eq(ColumnsTable.id, current.id));
  const neighborColumn = db
    .update(ColumnsTable)
    .set({ position: current.position })
    .where(eq(ColumnsTable.id, neighbor.id));

  await Promise.all([targetColumn, neighborColumn]);
  revalidatePath(`/dashboard/${boardId}`);
}
