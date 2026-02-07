'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { ColumnsTable } from '@/db/schema';
import { columnSchema } from '@/validations/columnValidation';
import { eq, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNewColumn(name: string, boardId: string) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/');
  }

  const parsedData = columnSchema.safeParse({ name });
  if (!parsedData.success) {
    return { success: false };
  }

  const [result] = await db
    .select({
      position: max(ColumnsTable.position),
    })
    .from(ColumnsTable)
    .where(eq(ColumnsTable.boardId, boardId))
    .limit(1);

  const nextPosition = (result.position ?? 0) + 1;

  await db.insert(ColumnsTable).values({
    name: parsedData.data.name,
    boardId: boardId,
    position: nextPosition,
    userId: session.user.id,
  });
  revalidatePath(`/dashboard/${boardId}`);
  return { success: true };
}
