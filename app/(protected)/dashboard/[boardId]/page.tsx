import Container from '@/components/container';
import { fetchColumnsByBoardId } from '../../../../features/dashboard/actions/fetchColumnsByBoardId';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateColumnButton from './create-column-button';
import CreateJobButton from './column-dropdown/create-job-button';
import { fetchJobsByBoardId } from '../../../../features/dashboard/actions/fetchJobsByBoardId';
import JobCard from './job-dropdown/job-card';
import ColumnDropdown from './column-dropdown/column-dropdown';
import { dataFormatter } from '@/lib/dataFormatter';
import { Suspense } from 'react';
import BoardPageData from './page-data';
import BoardPageSkeleton from './page-skeleton';

type Props = {
  params: {
    boardId: string;
  };
};

export default async function BoardPage({ params }: Props) {
  const urlParams = await params;
  const boardId = urlParams.boardId;

  return (
    <section className="grow">
      <Suspense fallback={<BoardPageSkeleton />}>
        <BoardPageData boardId={boardId} />
      </Suspense>
    </section>
  );
}
