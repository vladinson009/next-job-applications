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
import { MoreVerticalIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteColumnButton from './delete-column-button';
import CreateColumnButton from './create-column-button';
import CreateJobButton from './create-job-button';
import { fetchJobsByBoardId } from '../../../../features/dashboard/actions/fetchJobsByBoardId';
import JobCard from './job-card';
import MoveColumnButton from './move-column-button';

type Props = {
  params: {
    boardId: string;
  };
};

export default async function BoardPage({ params }: Props) {
  const urlParams = await params;
  const boardId = urlParams.boardId;

  const columnsPromise = fetchColumnsByBoardId(boardId);
  const jobsPromise = fetchJobsByBoardId(boardId);
  const [columns, jobsFromServer] = await Promise.all([columnsPromise, jobsPromise]);
  const jobs = jobsFromServer ?? [];

  const sortedJobs =
    jobs?.reduce<Record<string, typeof jobs>>((acc, current) => {
      if (!acc[current.columnId]) {
        acc[current.columnId] = [];
      }
      acc[current.columnId].push(current);
      return acc;
    }, {}) || {};

  return (
    <section className="grow">
      <Container className="pb-5">
        <CreateColumnButton boardId={boardId} />
        <h2>{columns && columns[0].boardName}</h2>
        <div className="flex gap-3 overflow-auto w-full h-[70vh]">
          {columns?.length &&
            columns?.map((column, colIndex) => (
              <Card
                className="bg-foreground shrink-0 w-1/3 min-w-55 even:bg-muted-foreground"
                key={column.id}
              >
                <CardHeader>
                  <CardTitle>
                    <Badge className="bg-secondary text-foreground">
                      {column.name}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-background">
                    Last update: {column.updatedAt.toLocaleDateString()}
                  </CardDescription>
                  <CardAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVerticalIcon className="text-primary" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          {column.position !== 1 && (
                            <MoveColumnButton
                              boardId={column.boardId}
                              columnId={column.id}
                              direction="left"
                            />
                          )}
                          {columns.length - 1 !== colIndex && (
                            <MoveColumnButton
                              boardId={column.boardId}
                              columnId={column.id}
                              direction="right"
                            />
                          )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DeleteColumnButton column={column} />
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-2 overflow-auto">
                  {sortedJobs[column.id]?.map((job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      canMoveUp={index > 0}
                      canMoveDown={index < sortedJobs[column.id].length - 1}
                      canMoveLeft={colIndex > 0}
                      canMoveRight={colIndex < columns.length - 1}
                    />
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <p></p>
                  <CreateJobButton column={column} boardId={boardId} />
                </CardFooter>
              </Card>
            ))}
        </div>
      </Container>
    </section>
  );
}
