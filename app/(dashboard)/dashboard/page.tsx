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
import { MoreVerticalIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteBoardButton from './delete-board-button';
import EditBoardButton from './edit-board-button';
import CreateBoardButton from './create-board-button';

export default async function DashboardPage() {
  const boards = await fetchBoards();

  return (
    <section>
      <Container className="my-5 xl:my-15 space-y-5">
        <CreateBoardButton />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {boards.map((board) => (
            <Card key={board.id} className="">
              <CardHeader>
                <CardTitle>{board.name}</CardTitle>
                <CardDescription>
                  <p>Created at: {board.createdAt.toLocaleDateString()}</p>
                  <p>Last update: {board.updatedAt.toLocaleDateString()}</p>
                </CardDescription>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* Content */}
                      <DeleteBoardButton board={board} />
                      <EditBoardButton board={board} />
                      {/* Content */}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
