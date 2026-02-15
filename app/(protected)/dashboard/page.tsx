import Container from '@/components/container';
import CreateBoardButton from './create-board-button';
import { Suspense } from 'react';
import DashboardCardsSkeleton from '@/components/dashboard/dashboard-cards-skeleton';
import BoardCards from './board-dropdown/board-cards';

export default async function DashboardPage() {
  return (
    <section>
      <Container className="my-5 space-y-5 ">
        <CreateBoardButton />
        <Suspense fallback={<DashboardCardsSkeleton />}>
          <BoardCards />
        </Suspense>
      </Container>
    </section>
  );
}
