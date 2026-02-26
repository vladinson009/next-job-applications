'use server';

import { db } from '@/db';
import { BoardsTable, ColumnsTable, JobsTable } from '@/db/schema';
import { requireUser } from '@/lib/auth-server';
import { isRedirectError } from '@/lib/redirectError';
import { and, eq, gt, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type Props = {
  columnId: string;
  targetColumnId: string;
  jobId: string;
};

export async function moveJobInColumnById({
  columnId,
  jobId,
  targetColumnId,
}: Props) {
  try {
    // Validate column and job
    if (!columnId.trim()) {
      return { success: false, error: 'NON_EXISTING_COLUMN' };
    }
    if (!targetColumnId.trim()) {
      return { success: false, error: 'NON_EXISTING_TARGET_COLUMN' };
    }
    if (!jobId.trim()) {
      return { success: false, error: 'NON_EXISTING_JOB' };
    }

    // Require user
    const user = await requireUser();
    if (!user.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // Query current job
    const [currentJob] = await db
      .select({
        id: JobsTable.id,
        position: JobsTable.position,
        boardId: JobsTable.boardId,
        columnId: JobsTable.columnId,
        columnPosition: ColumnsTable.position,
      })
      .from(JobsTable)
      .leftJoin(ColumnsTable, eq(JobsTable.columnId, ColumnsTable.id))
      .where(
        and(
          eq(JobsTable.id, jobId),
          eq(JobsTable.userId, user.id),
          eq(JobsTable.columnId, columnId),
        ),
      )
      .limit(1);

    if (!currentJob || !currentJob.columnPosition) {
      return { success: false, error: 'NON_EXISTING_JOB_AT_POSITION' };
    }

    // Query target column depending on target position
    const targetColumnQuery = db
      .select({
        id: ColumnsTable.id,
        position: ColumnsTable.position,
        lastJobPosition: sql<number>`MAX(${JobsTable.position})`,
      })
      .from(ColumnsTable)
      .leftJoin(JobsTable, eq(JobsTable.columnId, ColumnsTable.id))
      .where(
        and(
          eq(ColumnsTable.boardId, currentJob.boardId),
          eq(ColumnsTable.id, targetColumnId),
        ),
      )
      .groupBy(ColumnsTable.id, ColumnsTable.position)

      .limit(1);

    const [targetColumn] = await targetColumnQuery;
    if (!targetColumn) {
      return { success: false, error: 'NO_TARGET_COLUMN' };
    }

    const newPosition = (targetColumn.lastJobPosition ?? 0) + 1;

    // Push job to the new column [Critical mutation]
    await db
      .update(JobsTable)
      .set({
        columnId: targetColumnId,
        position: newPosition,
        updatedAt: sql`NOW()`,
      })
      .where(eq(JobsTable.id, currentJob.id));

    // Shift position to remaining jobs in old column by -1
    const shiftRemainingJobsQuery = db
      .update(JobsTable)
      .set({
        position: sql`${JobsTable.position} - 1`,
      })
      .where(
        and(
          eq(JobsTable.columnId, columnId),
          gt(JobsTable.position, currentJob.position),
        ),
      );

    // Touch columns
    const touchColumnsQuery = db
      .update(ColumnsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(or(eq(ColumnsTable.id, columnId), eq(ColumnsTable.id, targetColumnId)));

    // Touch board
    const touchBoardQuery = db
      .update(BoardsTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(BoardsTable.id, currentJob.boardId));

    // [Non-critical] metadata updates
    await Promise.all([shiftRemainingJobsQuery, touchColumnsQuery, touchBoardQuery]);

    revalidatePath(`/dashboard/${currentJob.boardId}`);

    return {
      success: true,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('[moveJobInColumnById]', error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
// export async function moveJobInColumnById({ columnId, direction, jobId }: Props) {
//   try {
//     // Validate column, job and direction
//     if (!columnId.trim()) {
//       return { success: false, error: 'NON_EXISTING_COLUMN' };
//     }
//     if (!jobId.trim()) {
//       return { success: false, error: 'NON_EXISTING_JOB' };
//     }
//     if (!direction.trim()) {
//       return { success: false, error: 'NON_EXISTING_DIRECTION' };
//     }

//     // Require user
//     const user = await requireUser();
//     if (!user.id) {
//       return { success: false, error: 'UNAUTHORIZED' };
//     }

//     // Query current job
//     const [currentJob] = await db
//       .select({
//         id: JobsTable.id,
//         position: JobsTable.position,
//         boardId: JobsTable.boardId,
//         columnId: JobsTable.columnId,
//         columnPosition: ColumnsTable.position,
//       })
//       .from(JobsTable)
//       .leftJoin(ColumnsTable, eq(JobsTable.columnId, ColumnsTable.id))
//       .where(
//         and(
//           eq(JobsTable.id, jobId),
//           eq(JobsTable.userId, user.id),
//           eq(JobsTable.columnId, columnId),
//         ),
//       )
//       .limit(1);

//     if (!currentJob || !currentJob.columnPosition) {
//       return { success: false, error: 'NON_EXISTING_JOB_AT_POSITION' };
//     }

//     const targetPosition =
//       direction === 'right' ?
//         currentJob.columnPosition + 1
//       : currentJob.columnPosition - 1;
//     if (targetPosition < 1) {
//       return { success: false, error: 'TARGET_POSITION_UNDER_ONE' };
//     }

//     // Query target column depending on target position
//     const targetColumnQuery = db
//       .select({
//         id: ColumnsTable.id,
//         position: ColumnsTable.position,
//         lastJobPosition: sql<number>`MAX(${JobsTable.position})`,
//       })
//       .from(ColumnsTable)
//       .leftJoin(JobsTable, eq(JobsTable.columnId, ColumnsTable.id))
//       .where(
//         and(
//           eq(ColumnsTable.boardId, currentJob.boardId),
//           direction === 'right' ?
//             gt(ColumnsTable.position, currentJob.columnPosition)
//           : lt(ColumnsTable.position, currentJob.columnPosition),
//         ),
//       )
//       .groupBy(ColumnsTable.id, ColumnsTable.position)
//       .orderBy(
//         direction === 'right' ?
//           asc(ColumnsTable.position)
//         : desc(ColumnsTable.position),
//       )
//       .limit(1);

//     const [targetColumn] = await targetColumnQuery;
//     if (!targetColumn) {
//       return { success: false, error: 'NO_TARGET_COLUMN' };
//     }

//     const targetColumnId = targetColumn.id;

//     const newPosition = (targetColumn.lastJobPosition ?? 0) + 1;

//     // Push job to the new column [Critical mutation]
//     await db
//       .update(JobsTable)
//       .set({
//         columnId: targetColumnId,
//         position: newPosition,
//         updatedAt: sql`NOW()`,
//       })
//       .where(eq(JobsTable.id, currentJob.id));

//     // Shift position to remaining jobs in old column by -1
//     const shiftRemainingJobsQuery = db
//       .update(JobsTable)
//       .set({
//         position: sql`${JobsTable.position} - 1`,
//       })
//       .where(
//         and(
//           eq(JobsTable.columnId, columnId),
//           gt(JobsTable.position, currentJob.position),
//         ),
//       );

//     // Touch columns
//     const touchColumnsQuery = db
//       .update(ColumnsTable)
//       .set({ updatedAt: sql`NOW()` })
//       .where(or(eq(ColumnsTable.id, columnId), eq(ColumnsTable.id, targetColumnId)));

//     // Touch board
//     const touchBoardQuery = db
//       .update(BoardsTable)
//       .set({ updatedAt: sql`NOW()` })
//       .where(eq(BoardsTable.id, currentJob.boardId));

//     // [Non-critical] metadata updates
//     await Promise.all([shiftRemainingJobsQuery, touchColumnsQuery, touchBoardQuery]);

//     revalidatePath(`/dashboard/${currentJob.boardId}`);

//     return {
//       success: true,
//     };
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error;
//     }
//     console.error('[moveJobInColumnById]', error);
//     return { success: false, error: 'SERVER_ERROR' };
//   }
// }
