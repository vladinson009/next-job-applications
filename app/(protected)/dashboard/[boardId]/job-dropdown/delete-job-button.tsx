'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { JobFromDB } from '@/types/Job';
import { deleteJobById } from '@/features/dashboard/actions/deleteJobById';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';

type Props = { job: JobFromDB };

export default function DeleteJobButton({ job }: Props) {
  async function onDelete() {
    await deleteJobById(job.id);
  }

  return (
    <DropdownMenuItem asChild>
      <AlertDialog>
        <AlertDialogTrigger className="flex gap-1 items-center p-2 text-sm hover:bg-secondary text-left w-full rounded-md text-destructive">
          <span>
            <Trash2 className="size-5" />
          </span>
          <span>Delete</span>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete job as &quot;{job.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your job
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} variant="destructive">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
}
