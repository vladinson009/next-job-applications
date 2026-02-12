'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';
import MoveJobButton from './move-job-button';
import MoveJobInColumnButton from './move-job-in-column-button';
import EditJobButton from './edit-job-button';
import DeleteJobButton from './delete-job-button';
import { JobFromDB } from '@/types/Job';
import { useState } from 'react';
type Props = {
  job: JobFromDB;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
};
export function JobDropdown({
  job,
  canMoveUp,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <MoreVerticalIcon className="text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {canMoveUp && (
            <MoveJobButton columnId={job.columnId} jobId={job.id} direction="up" />
          )}
          {canMoveDown && (
            <MoveJobButton columnId={job.columnId} jobId={job.id} direction="down" />
          )}
          {(canMoveDown || canMoveUp) && <DropdownMenuSeparator />}

          {canMoveLeft && (
            <MoveJobInColumnButton
              columnId={job.columnId}
              direction="left"
              jobId={job.id}
            />
          )}
          {canMoveRight && (
            <MoveJobInColumnButton
              columnId={job.columnId}
              direction="right"
              jobId={job.id}
            />
          )}
        </DropdownMenuGroup>
        {(canMoveLeft || canMoveRight) && <DropdownMenuSeparator />}
        <EditJobButton job={job} setOpen={setOpen} />
        <DeleteJobButton job={job} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
