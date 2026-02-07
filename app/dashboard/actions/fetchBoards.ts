import { auth } from '@/auth';
import { db } from '@/db';
import { BoardsTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function fetchBoards() {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return [];
  }

  const boards = await db
    .select()
    .from(BoardsTable)
    .where(eq(BoardsTable.userId, session.user.id))
    .orderBy(desc(BoardsTable.updatedAt));
  return boards;
}
