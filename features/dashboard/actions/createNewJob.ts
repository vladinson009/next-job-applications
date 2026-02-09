'use server';
import { auth } from '@/auth';
import { db } from '@/db';
import { JobsTable } from '@/db/schema';
import { jobSchema } from '@/validations/jobValidation';
import { and, eq, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

export async function createNewJob(
  data: z.output<typeof jobSchema>,
  columnId: string,
  boardId: string,
) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/');
  }

  const parsedData = jobSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false };
  }

  const [result] = await db
    .select({
      position: max(JobsTable.position),
    })
    .from(JobsTable)
    .where(
      and(eq(JobsTable.columnId, columnId), eq(JobsTable.userId, session.user.id)),
    )
    .limit(1);

  const nextPosition = (result.position ?? 0) + 1;

  await db.insert(JobsTable).values({
    userId: session.user.id,
    position: nextPosition,
    columnId,
    companyName: parsedData.data.companyName,
    location: parsedData.data.location,
    title: parsedData.data.title,
    remote: parsedData.data.remote === 'true' ? true : false,
    salary: parsedData.data.salary || null,
    boardId: boardId,
  });
  revalidatePath(`/dashboard/${boardId}`);
  return { success: true };
}
