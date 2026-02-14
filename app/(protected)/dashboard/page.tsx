import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { fetchBoards } from '../../../features/dashboard/actions/fetchBoards';
import CreateBoardButton from './create-board-button';
import BoardDropDown from './board-dropdown/board-dropdown';
import { dataFormatter } from '@/lib/dataFormatter';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const data = await fetchBoards();
  const boards = data.data ?? [];
  return (
    <section>
      <Container className="my-5 space-y-5 ">
        <CreateBoardButton />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {boards.map((board) => (
            <Card key={board.id}>
              <CardHeader>
                <CardTitle>
                  <Badge className="bg-foreground">{board.name}</Badge>
                </CardTitle>
                <CardDescription>
                  <p>Created at: {dataFormatter(board.createdAt)}</p>
                  <p>Last update: {dataFormatter(board.updatedAt)}</p>
                </CardDescription>
                <CardAction>
                  <BoardDropDown board={board} />
                </CardAction>
              </CardHeader>
              <CardContent>
                <Button variant="link" asChild>
                  <Link href={`/dashboard/${board.id}`}>Show board</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
