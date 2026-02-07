import Container from '@/components/container';
import { fetchColumnsByBoardId } from '../actions/fetchColumnsByBoardId';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteColumnButton from './delete-column-button';
import Link from 'next/link';
import CreateColumnButton from './create-column-button';

type Props = {
  params: {
    boardId: string;
  };
};

export default async function BoardPage({ params }: Props) {
  const urlParams = await params;
  const boardId = urlParams.boardId;

  const columns = await fetchColumnsByBoardId(boardId);

  return (
    <section className="flex grow">
      <Container className="py-5 xl:py-15 min-h-full ">
        <CreateColumnButton boardId={boardId} />
        <h2>Board {columns && columns[0].boardName}</h2>
        <div className="flex gap-3 overflow-auto min-h-full">
          {columns?.length &&
            columns?.map((column) => (
              <Card
                className="min-w-1/3  shrink-0 even:bg-secondary"
                key={column.id}
              >
                <CardHeader>
                  <CardTitle>
                    <Badge>{column.name}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {column.updatedAt.toLocaleDateString()}
                  </CardDescription>
                  <CardAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVerticalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DeleteColumnButton column={column} />
                        {/* Content */}
                        {/* <DeleteBoardButton board={board} />
                        <EditBoardButton board={board} /> */}
                        {/* Content */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <p>
                    Last update: {column.updatedAt.toLocaleDateString()} at{' '}
                    {column.updatedAt.toLocaleTimeString()}
                  </p>
                  <PlusIcon />
                </CardFooter>
                {/* <p>Board ID: {column.boardId}</p>
                <p>Created At:{column.createdAt.toLocaleDateString()}</p>
                <p>ID: {column.id}</p>
                <p>Name: {column.name}</p>
                <p>Positioin: {column.position}</p>
                <p>Updated At: {column.updatedAt.toLocaleDateString()}</p>
                <p>BoardName: {column.boardName}</p> */}
              </Card>
            ))}
        </div>
      </Container>
    </section>
  );
}
