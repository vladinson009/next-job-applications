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
