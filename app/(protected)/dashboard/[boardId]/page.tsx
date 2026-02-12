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
  const [columnsFromServer, jobsFromServer] = await Promise.all([
    columnsPromise,
    jobsPromise,
  ]);
  const jobs = jobsFromServer.data ?? [];
  const columns = columnsFromServer.data ?? [];

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
        <div className="flex gap-3 overflow-auto w-full min-h-125 h-[70vh]">
          {columns?.length &&
            columns?.map((column, colIndex) => (
              <Card
                className="bg-foreground shrink-0 w-1/3 min-w-80 even:bg-muted-foreground"
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
                    <ColumnDropdown
                      column={column}
                      columns={columns}
                      colIndex={colIndex}
                    />
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
