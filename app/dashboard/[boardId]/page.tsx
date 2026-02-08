import Container from '@/components/container';
import { fetchColumnsByBoardId } from '../actions/fetchColumnsByBoardId';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteColumnButton from './delete-column-button';
import CreateColumnButton from './create-column-button';
import CreateJobButton from './create-job-button';
import { fetchJobsByBoardId } from '../actions/fetchJobsByBoardId';
import JobCard from './job-card';

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
  const [columns, jobs] = await Promise.all([columnsPromise, jobsPromise]);

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
            columns?.map((column) => (
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
                        <DeleteColumnButton column={column} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-2 overflow-auto">
                  {sortedJobs[column.id]?.map((job) => (
                    <JobCard key={job.id} job={job} />
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
