import Container from '@/components/container';
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
import JobCard from './job-dropdown/job-card';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { JobFromDB } from '@/types/Job';
import { Button } from '@/components/ui/button';

export default function BoardPageSkeleton() {
  const date = new Date();
  const skeletonJob: JobFromDB = {
    boardId: '1',
    columnId: '1',
    companyName: 'Loading...',
    createdAt: date,
    id: '1',
    location: 'Loading...',
    position: 1,
    remote: true,
    salary: 0,
    title: 'Loading...',
    updatedAt: date,
    userId: '1',
  };

  return (
    <Skeleton>
      <Container className="pb-5 space-y-2">
        <h2>Loading...</h2>
        <Button className="" type="button">
          Create column
        </Button>
        <div className="flex gap-3 overflow-auto w-full min-h-125 h-[70vh]">
          {Array.from({ length: 3 }).map((_, colIndex) => (
            <Card
              className="bg-foreground shrink-0 w-1/3 min-w-80 even:bg-muted-foreground"
              key={colIndex}
            >
              <CardHeader>
                <CardTitle>
                  <Badge className="bg-secondary text-foreground">Loading...</Badge>
                </CardTitle>
                <CardDescription className="text-background">
                  Last update: Loading...
                </CardDescription>
                <CardAction>
                  <MoreVerticalIcon className="" />
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2 overflow-auto">
                {Array.from({ length: 1 }).map((_, index) => (
                  <JobCard
                    key={index}
                    job={skeletonJob}
                    canMoveUp={index > 0}
                    canMoveDown={index < 3 - 1}
                    canMoveLeft={colIndex > 0}
                    canMoveRight={colIndex < 3 - 1}
                  />
                ))}
              </CardContent>
              <CardFooter className="mt-auto">
                <PlusIcon className="text-primary" />
              </CardFooter>
            </Card>
          )) || ''}
        </div>
      </Container>
    </Skeleton>
  );
}
