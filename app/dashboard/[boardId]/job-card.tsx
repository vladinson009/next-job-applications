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
import { MoreVerticalIcon, XCircleIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import DeleteJobButton from './delete-job-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  job: JobFromDB;
};

export default function JobCard({ job }: Props) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{job.companyName}</CardTitle>
        <CardDescription>{job.title}</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVerticalIcon className="text-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DeleteJobButton job={job} />
            </DropdownMenuContent>
          </DropdownMenu>
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
        <p className="flex justify-between">
          <Button asChild variant="link">
            <Link href="#">Visit page</Link>
          </Button>
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap items-start gap-1">
        <Badge className="bg-foreground">
          Last update: {job.updatedAt.toLocaleDateString()}
        </Badge>
        <Badge className="bg-muted-foreground">
          Created at: {job.createdAt.toLocaleDateString()}
        </Badge>
      </CardFooter>
    </Card>
  );
}
// title: string;
// companyName: string;
// location: string;
// salary: number | null;
// remote: boolean | null;
// position: number;
// createdAt: Date;
// updatedAt: Date;
