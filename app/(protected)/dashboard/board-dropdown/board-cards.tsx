import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchBoards } from '@/features/dashboard/actions/fetchBoards';
import { dataFormatter } from '@/lib/dataFormatter';
import BoardDropDown from './board-dropdown';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function BoardCards() {
  const data = await fetchBoards();
  const boards = data.data ?? [];
  return (
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
  );
}
