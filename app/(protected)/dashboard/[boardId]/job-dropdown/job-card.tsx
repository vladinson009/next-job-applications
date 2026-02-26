import { Badge } from '@/components/ui/badge';
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
import { JobFromDB } from '@/types/Job';
import Link from 'next/link';
import { JobDropdown } from './job-dropdown';
import { dataFormatter } from '@/lib/dataFormatter';
import { ColumnFromDB } from '@/types/Column';

type Props = {
  job: JobFromDB;
  columns: ColumnFromDB[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
};

export default function JobCard({
  job,
  columns,
  canMoveUp,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.companyName}</CardTitle>
        <CardDescription>{job.title}</CardDescription>
        <CardAction>
          <JobDropdown
            canMoveLeft={canMoveLeft}
            canMoveRight={canMoveRight}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            job={job}
            columns={columns}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="flex justify-between">
          <Badge className="bg-green-500">Location</Badge>
          <span> {job.location}</span>
        </p>
        {job.salary && (
          <p className="flex justify-between">
            <Badge className="bg-green-500">Salary</Badge>
            <span> {job.salary}</span>
          </p>
        )}
        {job.remote && (
          <p className="flex justify-between">
            <Badge className="bg-green-500">Remote</Badge>
            <span> {job.remote ? 'Yes' : 'No'}</span>
          </p>
        )}
        {job.url && (
          <p className="flex justify-between">
            <Button asChild variant="link">
              <Link href={job.url}>Visit page</Link>
            </Button>
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-start gap-1">
        <Badge className="bg-foreground">
          Updated: {dataFormatter(job.updatedAt, true)}
        </Badge>
        <Badge className="bg-muted-foreground">
          Created: {dataFormatter(job.createdAt, true)}
        </Badge>
      </CardFooter>
    </Card>
  );
}
